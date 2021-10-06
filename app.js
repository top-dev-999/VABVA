/**
 * @lib/framework
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const crypto = require("crypto");

const app = express();

app.use(bodyParser.json());

/**
 * @models
 */
const Locations = require("./models/Locations");
const Price = require("./models/Prices");
const Company = require("./models/Company");
const SIC = require("./models/Sic");
const Reviews = require("./models/Reviews");
const Cache = require("./models/Cache");

/*
 String to colour import
 string-to-color
  */
const stc = require("string-to-color");
const { getSEOsettings } = require("./helper/metaSEO");

/**
 * @routes
 */
const CompanyRoute = require("./routes/company");
// const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");
// const { count } = require("./models/Locations");

let mongoServerUrl = "mongodb://167.99.228.201:27017/skiphire";

if (process.env.NODE_ENV == "production") {
  mongoServerUrl = "mongodb://localhost:27017/skiphire";
} else {
  app.use(cors());
}


mongoose
  .connect(
    // remote connection
    mongoServerUrl,
    {
      useNewUrlParser: true,
      poolSize: 50
    }
    // "mongodb://localhost:27017/skips"
    // "mongodb://localhost:27017/skiphire"
    // "mongodb://167.99.228.201:27017/skiphire"
  )
  .then(() => {
    console.log("Mongodb Connected ");
  })
  .catch((e) => {
    console.log("error databse connection failed ", e);
  });
// expose routes
app.use(`/api/v1/company`, CompanyRoute);

//extend String functionality
String.prototype.capitalize = function () {
  let arr = this.split(" ");
  let _string = "";

  arr.map((word, index) => {
    _string += word.charAt(0).toUpperCase() + word.slice(1);
    if (index !== arr.length - 1) {
      _string += " ";
    }
  });

  return _string;
};

/**
 * Getting only SEO data for performance reason.
 * Code was copied from app route `getMapsearch`
 */
const getSHA1 = (data) => {
  return crypto.createHash("sha1").update(data, "binary").digest("hex");
};

app.post("/api/getmapseo", async (req, res) => {
  let data = req.body;

  let nearbyQuery = {};
  let sicCodes;

  if (data && data.hasOwnProperty("services")) {
    let regexSearch = [];

    for (let i = 0; i < data.services.length; i++) {
      regexSearch.push(
        new RegExp("^" + data.services[i].split("-").join(" "), "i")
      );
    }
    sicCodes = await SIC.find(
      { tags: { $in: regexSearch } },
      { code: 1, tags: 1 }
    );
  }

  if (data && data.hasOwnProperty("coordinates")) {
    try {
      if (
        typeof Number(data.coordinates.long) === "number" &&
        typeof Number(data.coordinates.lat) === "number"
      ) {
        // set nearby query search
        nearbyQuery = {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [data.coordinates.long, data.coordinates.lat],
              },
            },
          },
        };
      }
    } catch (ex) { }
  }

  let nearestLocation = await Locations.find(nearbyQuery).limit(1);
  let SEO = null;

  if (nearestLocation.length > 0) {
    let nearbyPlaces = await getNearbyPlaces(
      nearestLocation[0].county,
      nearestLocation[0].full_url,
      true
    );
    nearbyPlaces.counties = await Promise.all(nearbyPlaces.counties);

    let _data = {
      nearestLocation: data.hasOwnProperty("coordinates")
        ? nearestLocation
        : null,
      nearbyPlaces,
      query: data,
      SIC: sicCodes,
      companies: Array(),
    };
    SEO = await getSEOsettings(_data, "map");
  }

  res.json({ search: SEO });
});

app.post("/api/getmapsearch", async (req, res) => {
  let data = req.body;

  let queryIndex = { ...data };
  delete queryIndex.country; //should be removed when error is fixed
  delete queryIndex.county;

  if (queryIndex && queryIndex.hasOwnProperty("coordinates")) {
    //we put another coordinates on top here, so we can send pre-rendered pages up here
    //without doing deeper computations.
    try {
      if (
        typeof Number(queryIndex.coordinates.long) === "number" &&
        typeof Number(queryIndex.coordinates.lat) === "number"
      ) {
        data.coordinates = queryIndex.coordinates = {
          lat: Number(queryIndex.coordinates.lat).toFixed(5).toString(),
          long: Number(queryIndex.coordinates.long).toFixed(6).toString(),
        };
      }
    } catch { }
  }

  //generates a Hash identifier for the query (excluding county because this is not used...)
  queryIndex = getSHA1(JSON.stringify(queryIndex));
  let response = await Cache.find({ uri: queryIndex, page: "map" }).limit(1);
  if (response.length == 1) {
    //return json response...
    res.json(JSON.parse(response[0].content));
  }


  console.log("data: ", data);



  //   data = {
  //     county: "Greater Manchester",
  //     coordinates: { lat: "51.494785", long: "-0.839535" },
  //     services: ["skip-hire", "waste-removal", "hazardous"],
  //     company: "limited",
  //     distance: { value: "50", measurement: "miles" },
  //     reviews: "5",
  //   };

  let _query = {
    // companyActive: true,
  };

  let nearbyQuery = {};
  let sicCodes;

  /**
   * Takes services
   * Example: waste-management and replaces - with a space which would be added to the _query object
   */
  if (data && data.hasOwnProperty("services")) {
    let regexSearch = [];
    for (let i = 0; i < data.services.length; i++) {
      regexSearch.push(
        new RegExp("^" + data.services[i].split("-").join(" "), "i")
      );
    }
    sicCodes = await SIC.find(
      { tags: { $in: regexSearch } },
      { code: 1, tags: 1 }
    );
    let sicCodesArray = [...new Array(sicCodes.length)].map(
      (value, index) => sicCodes[index].code
    );
    _query["SIC"] = { $in: sicCodesArray };
    /*
     Here we handle the prefix Meta Title
     */
  }

  //change name to companyName
  if (data && data.hasOwnProperty("company")) {
    if (data.company.trim().length > 0) {
      _query["companyName"] = new RegExp(data.company, "i");
    }
  }

  if (data && data.hasOwnProperty("coordinates")) {
    try {
      if (
        typeof Number(data.coordinates.long) === "number" &&
        typeof Number(data.coordinates.lat) === "number"
      ) {
        _query["location"] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [data.coordinates.long, data.coordinates.lat],
            },
          },
        };

        // set nearby query search
        nearbyQuery = {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [data.coordinates.long, data.coordinates.lat],
              },
            },
          },
        };
        //voided - getskip hire prices for this cooridinates, if the company matches waste management SIC codes....
        //maybe this should have it's own if statement?
      }
    } catch (ex) { }
  }

  if (data && data.hasOwnProperty("distance")) {
    try {
      if (_query.hasOwnProperty("location")) {
        if (data.distance.measurement == "miles") {
          //convert miles to meters
          _query["location"]["$near"]["$maxDistance"] =
            Number(data.distance.value) <= 50
              ? data.distance.value * 1609.34
              : 50 * 1609.34;
        }
      }
    } catch (ex) { }
  }

  //Visual representation of a full search
  // data = {
  //   "county": "Greater Manchester",
  //   "coordinates": { "lat": "40.579505", "long": "-73.98241999999999" },
  //   "services": ["skip hire", "waste removal", "hazardous"],
  //   "company": "iera",
  //   "distance": { "value": "3", "measurement": "miles" },
  //   "reviews": "5"
  // }
  //
  // let query = {
  //   name: new RegExp(data.company, 'i'),
  //   SIC: { $in: sicCodesArray },
  //   location: {
  //     $near: {
  //       $maxDistance: data.distance.value * 1609.34,
  //       $geometry: {
  //         type: "Point", coordinates: [data.coordinates.long, data.coordinates.lat]
  //       }
  //     }
  //   },
  //   companyActive: true
  // }

  // console.log("nearby: ", Object.keys(nearbyQuery).length)

  //4 - Then filter reviews
  let companies = await Company.find(_query, {
    "details.opening_hours": 0,
    license: 0,
    companyNumber: 0,
    companyActive: 0,
    updatedAt: 0,
  }).limit(1000);
  console.log("Mongo search: ", JSON.stringify(_query));
  //return or filter reviews

  console.log("companies length: ", companies.length);
  //update nearbyQuery here, if its empty.
  //if company result is more than 0 and coordinates wasn't set in the search i.e. "/map" visited without coordinates
  if (companies.length > 0 && Object.keys(nearbyQuery).length !== 1) {
    nearbyQuery = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: companies[0].location.coordinates,
          },
        },
      },
    };
  }

  let searchResults = [];
  let reviews;
  let companyArray = [...new Array(companies.length)].map((value, index) =>
    companies[index]._id.toString()
  );
  //A List of unique SIC codes we code from the result.
  let SICresults = [];
  let SICcount = [];

  /**
   * This section processes and cleans companies results based on reviews. All results are also attached with a review
   * in this section.
   *
   * In this section we also take advantage of the loop to get SICresult collection
   *
   */
  reviews = await Reviews.aggregate([
    {
      $match: { sentEmailConfirmed: true }
    },
    {
      $group: {
        _id: "$company_id",
        ratingScore: { $avg: "$ratingScore" }
      },
    },
    {
      $match: {
        ratingScore:
          data.hasOwnProperty("reviews") &&
            typeof Number(data.reviews) === "number"
            ? { $gte: Number(data.reviews) }
            : { $gte: 0 },
        _id: { $in: companyArray }
      },
    },
  ]);

  let reviewsArray = [...new Array(reviews.length)].map((value, index) =>
    reviews[index]._id.toString()
  );
  //set search results
  //filters with companies that only have 5 star reivews
  for (let i = 0; i < companies.length; i++) {
    let company = JSON.parse(JSON.stringify(companies[i]));

    /**
     * Since we're already looping through the companies collection, lets convert the SIC codes to colours here as well
     *
     */
    //collect a list of SIC codes we need to get descriptions for.
    if (company.hasOwnProperty("SIC")) {
      if (company["SIC"].length > 0) {
        company["SIC"].map((SICcode) => {
          if (!SICresults.includes(SICcode.toString())) {
            SICcount[SICcode] = 1;
            SICresults.push(SICcode.toString());
          } else {
            SICcount[SICcode] += 1;
          }
        });
      } else {
        //sometimes the SIC property is an empty array. Ideally, it shouldn't exist if its empty...
        //SIC code section is empty.... this is the same as it being unknown
        if (!SICresults.includes("00000")) {
          SICcount["00000"] = 1;
          SICresults.push("00000");
        } else {
          SICcount["00000"] += 1;
        }
      }
    }
    //Future proof this seciton
    if (!company.hasOwnProperty("SIC")) {
      if (!SICresults.includes("00000")) {
        SICcount["00000"] = 1;
        SICresults.push("00000");
      } else {
        SICcount["00000"] += 1;
      }
    }

    //END

    let _review = reviewsArray.includes(company["_id"])
      ? reviews[reviewsArray.indexOf(company["_id"])].ratingScore
      : 0;
    company["ratingScore"] = _review;

    //filter here, based on whether reviews is specified
    if (
      data.hasOwnProperty("reviews") &&
      typeof Number(data.reviews) === "number" &&
      Number(data.reviews) !== 0
    ) {
      if (reviewsArray.includes(company["_id"])) {
        searchResults.push(company);
      }
    } else {
      searchResults.push(company);
    }
  }

  /*
   Here we handle SEO related issues
   */
  let nearestLocation = await Locations.find(nearbyQuery).limit(1);
  let SEO = null;
  if (nearestLocation.length > 0) {
    let nearbyPlaces = await getNearbyPlaces(
      nearestLocation[0].county,
      nearestLocation[0].full_url,
      true
    );
    nearbyPlaces.counties = await Promise.all(nearbyPlaces.counties);

    let _data = {
      nearestLocation: data.hasOwnProperty("coordinates")
        ? nearestLocation
        : null,
      nearbyPlaces,
      query: data,
      SIC: sicCodes,
      companies: searchResults,
    };
    SEO = await getSEOsettings(_data, "map");
  }

  // console.log(JSON.stringify(SEO))
  // //add marker colours on output
  // let colourConverter = searchResults.map((item, index) => {
  //   let colours = [];

  //   if (typeof item !== "undefined" && ) {
  //     colours = item["SIC"].map((SICcode) => {

  //       return stc(SICcode)
  //     })

  //     delete item["SIC"]
  //     item["colours"] = colours
  //     return item;
  //   }
  //   //remove SIC field to anonymise data sources
  // })

  // //All the SIC codes from the result:
  let sicDescriptions = await SIC.find({ code: { $in: SICresults } }).limit(
    SICresults.length
  );
  let sicIndex = [...new Array(sicDescriptions.length)].map((value, index) =>
    sicDescriptions[index].code.toString()
  );
  //.limit(SICresults.length)

  // console.log("company length at searchResults: ", company.length)
  searcResults = searchResults.map((company) => {
    let colours;

    if (company.hasOwnProperty("SIC")) {
      colours = company["SIC"].map((sicCode) => {
        let descriptions = [];

        if (sicIndex.indexOf(sicCode) !== -1) {
          // descriptions = sicDescriptions[sicIndex.indexOf(sicCode)].tags.length > 0 ? sicDescriptions[sicIndex.indexOf(sicCode)].tags : [sicDescriptions[sicIndex.indexOf(sicCode)].description];
          descriptions = [
            sicDescriptions[sicIndex.indexOf(sicCode)].description,
          ];
        }
        return {
          colour: stc(sicCode.toString()),
          companies: SICcount[sicCode],
          descriptions,
        };
      });
    }

    if (!company.hasOwnProperty("SIC") || company["SIC"].length == 0) {
      colours = [
        {
          colour: stc("00000"),
          companies: SICcount["00000"],
          descriptions: ["Unknown company"],
        },
      ];
    }

    company["colours"] = colours;
    delete company["SIC"];
    return company;
  });

  let __count = 0;
  searchResults.map((comps, index) => {
    if (comps.colours.length > 0) {
      __count += 1;
    } else {
      // console.log("no length")
    }
  });

  console.log("Total records with colour: ", __count);

  // console.log("sic results: ", JSON.stringify({ code: { $in: SICresults } }))

  // let colourLabels = sicDescriptions.map((item, index) => {
  //   console.log("map index: ", index)
  //   return { colour: stc(item.code), descriptions: [...item.tags] }
  // })
  // console.log("Colours: ", colourLabels)
  // console.log(JSON.stringify({ companies: searchResults, search: SEO }))

  let _stringed = JSON.stringify({ companies: searchResults, search: SEO });
  await Cache.updateOne(
    { uri: queryIndex, page: "map" },
    { $set: { uri: queryIndex, page: "map", content: _stringed } },
    { upsert: true }
  );

  if (response.length == 0) {
    //no respoonse has been given already...
    res.json({ companies: searchResults, search: SEO });
  }
});
app.get("/api/autocomplete", async (req, res) => {
  const limit = req.query.name.length;
  let dataType = req.query.datatype;

  let result = [];

  switch (dataType) {
    case "map_services":
      let _tags = await SIC.find({
        tags: new RegExp("^" + req.query.name, "i"),
      })
        .limit(limit <= 1 ? 100 : null)
        .select("tags");
      _tags.map((tag) => {
        tag.tags.map((descriptions) => {
          let regex = new RegExp("^" + req.query.name, "i");
          if (regex.test(descriptions) == true) {
            if (!result.includes(descriptions)) {
              result.push(descriptions);
            }
          }
        });
      });
      break;

    case "places":
      result = await Locations.find(
        { name: new RegExp("^" + req.query.name, "i") }
        // {
        //   name: 1,
        //   // url: 1,
        //   full_url: 1,
        //   showCounty: 1,
        //   county: 1,
        //   _id: 0,
        // }
      )
        .limit(limit <= 1 ? 100 : null)
        .select("_id name full_url county location");

      console.log("result: ", result);
      break;

    case "marker":
      result = [
        {
          titles: ["Skip Hire Prices Per Yard", "Price search"],
          data: [
            { name: "2", value: "£G06" },
            { name: "4", value: "£300" },
            { name: "6", value: "£100" },
            { name: "8", value: "£250" },
          ],
        },
      ];
      result = [];
      break;
  }

  // console.log("query: ", req.query.name)
  // console.log("tags: ", _tags);
  res.json(result);
});
app.post("/api/getlocation", async (req, res) => {
  const limit = req.query.name.length;
  let locations = await Locations.find(
    { name: new RegExp("^" + req.query.name, "i") }
    // {
    //   name: 1,
    //   // url: 1,
    //   full_url: 1,
    //   showCounty: 1,
    //   county: 1,
    //   _id: 0,
    // }
  )
    .limit(limit <= 1 ? 100 : null)
    .select("_id name full_url showCounty county");
  res.json(locations);
});

let getDate = (days) => {
  let priceStart = new Date();
  priceStart.setDate(new Date().getDate() - days);
  priceStart.setUTCHours(0, 0, 0, 0);

  let priceEnd = new Date();
  priceEnd.setDate(new Date().getDate() - days);
  priceEnd.setUTCHours(23, 59, 59, 59);

  return {
    dateStart: priceStart.toISOString(),
    dateEnd: priceEnd.toISOString(),
  };
};

let getNearbyPlaces = async (_searchWith, currentFull_url, useCounty) => {
  let searchWith =
    useCounty == true
      ? { county: _searchWith }
      : { local_government_area: _searchWith };

  let localGov = await Locations.find(searchWith, {
    name: 1,
    postcode_sector: 1,
    full_url: 1,
    location: 1,
    county: 1,
  }).sort({ postcode_sector: useCounty == true ? 1 : -1 });

  console.log("query: ", searchWith);

  let localAreas = [];
  let _subLocalAreas = [];
  let startLocationIndex;
  await localGov.map((local, local_index) => {
    if (local.full_url == currentFull_url) {
      startLocationIndex = local_index;
    } else if (typeof startLocationIndex !== "undefined") {
      if (localAreas.length < 9) {
        let _local = { ...local._doc, index: local_index };
        // console.log("adding log: ", _local, " index: ", local_index)
        localAreas.push(_local);
      }
    }

    if (localGov.length - local_index <= 10 && _subLocalAreas.length < 9) {
      //dont add places that are nearby
      if (local.full_url !== currentFull_url) {
        _subLocalAreas.push(local);
      }
    }
  });

  //here we get 5 counties
  let _counties = await Locations.distinct("county");
  let countiesToGet = [];
  let startCountyIndex = _counties.indexOf(localGov[0].county);
  startCountyIndex =
    startCountyIndex + 5 > _counties.length
      ? _counties.length - 6
      : startCountyIndex;

  countiesToGet = _counties.slice(startCountyIndex, startCountyIndex + 6);
  countiesToGet = countiesToGet.filter((item) => {
    return item !== localGov[0].county;
  });

  let otherCounties = countiesToGet.map(async (county) => {
    let result = await Locations.find(
      { county },
      { name: 1, postcode_sector: 1, full_url: 1, location: 1, county: 1 }
    ).limit(1);
    return result[0];
  });

  let _return = {
    local:
      localAreas.length >= _subLocalAreas.length ? localAreas : _subLocalAreas,
    counties: otherCounties,
  };
  return _return;
};
app.post("/api/getprice", async (req, res) => {
  //Get current prices

  let location = await Locations.findOne({
    full_url: `${req.query.url}/${req.query.sub_url}`,
  });
  // let localGov;
  // let nearbyLocationId;

  //start find nearby places sorted by postcode. It gets the last 9 nearby places incase the last location is searched
  // which would have less than 9 results... if this ocours it uses the last 9 nearby places instead.
  let nearbyPlaces;
  if (location) {
    nearbyPlaces = (
      await getNearbyPlaces(
        location.local_government_area,
        `${req.query.url}/${req.query.sub_url}`
      )
    ).local;
  }

  let currentRecord = await Price.find(
    {
      location_id: String(location._id),
    },
    { yard: 1, name: 1, prices: 1, _id: 0 }
  ).sort({ index: 1 });

  let commonSizes = [2, 4, 6, 8, 10, 12, 14, 16];

  let _random = (min, max) => {
    return Number((min + Math.random() * (max - min)).toFixed(2));
  };
  await commonSizes.map(async (size) => {
    let price = await currentRecord.filter((price) => {
      return price.yard == size;
    });

    if (price.length == 0) {
      switch (size) {
        case 2:
          currentRecord.push({
            prices: [_random(265.6, 288.8), _random(255.6, 288.8)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 4:
          currentRecord.push({
            prices: [_random(305.6, 338.8), _random(345.6, 338.8)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 6:
          currentRecord.push({
            prices: [_random(320.6, 358.8), _random(345.6, 358.8)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 8:
          currentRecord.push({
            prices: [_random(445.6, 458.8), _random(445.6, 458.8)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 10:
          currentRecord.push({
            prices: [_random(455.6, 465.87), _random(456.6, 465.87)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 12:
          currentRecord.push({
            prices: [_random(455.6, 476.87), _random(456.6, 476.87)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 14:
          currentRecord.push({
            prices: [_random(465.6, 505.87), _random(465.6, 505.87)],
            yard: size,
            name: size + "-Yard",
          });
          break;
        case 16:
          currentRecord.push({
            prices: [_random(465.6, 525.87), _random(465.6, 525.87)],
            yard: size,
            name: size + "-Yard",
          });
          break;
      }
    }
  });
  // let _backCurrentRecords = await Price.find(
  //   {
  //     location_id: { $in: nearbyLocationId },
  //     yard: { $exists: true },
  //     prices: { $exists: true }
  //   },
  //   { yard: 1, name: 1, prices: 1, _id: 0 }
  // )

  // let added = {};

  // let backCurrentRecords = _backCurrentRecords.filter((item) => {
  //   added[item.yard] = typeof added[item.yard] == "undefined" ? 0 : added[item.yard] + 1;

  //   let max = item.prices[item.prices.length - 1]
  //   let min = item.prices[0];
  //   max = max + ((max / 100) * 20)
  //   let rand = _random(min, max);
  //   item.prices.push(rand)

  //   if(added[item.yard] == 0){
  //    // currentRecord.map()
  //    //push price if empty
  //   }

  //   return added[item.yard] == 0;
  // })

  // console.log("nearby length: ", nearbyLocationId.length)
  // console.log("locations: ", location._id)
  // console.log("Prices: ", currentRecord)
  // console.log("location_id", location)
  // let _location = location.name + ", " + location.county;
  // console.log(location.latitude);
  let _locationProperties = {
    name: location.name,
    county: location.county,
    displayName: location.name + ", " + location.county,
    postcode: location.postcode_sector,
    coordinates: {
      latitude: location.location.coordinates[1],
      longitude: location.location.coordinates[0],
      easting: location.easting,
      northing: location.northing,
      elevation: location.elevation,
    },
  };
  //
  //console.log(JSON.stringify({ currentRecord, locationProperties: _locationProperties, nearbyPlaces }))
  res.json({
    currentRecord,
    locationProperties: _locationProperties,
    nearbyPlaces,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is listening on PORT ", PORT);
});

