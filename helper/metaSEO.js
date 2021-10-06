exports.getSEOsettings = async (data, type) => {
    /* nearestLocation,
      nearbyPlaces,
      data,
      SIC: sicCodes,
      companies: searchResults
    */
    // data.companies = [];
    let result;
    let metaTitle = "";
    let metaDescription = "";

    switch (type) {
        case "map":
            let prefixAndMeta = getPrefixAndServices(data);

            metaTitle = metaDescription = `${data.companies.length > 1 ? data.companies.length + " " : ""}${prefixAndMeta.prefix.trim().length !== 0 ? prefixAndMeta.prefix.trim() : "Waste Management & Construction"}`
            let metaNear = ""

            if (data.nearestLocation !== null) {
                metaNear = `${data.nearestLocation[0].name}, ${data.nearestLocation[0].county}, ${data.nearestLocation[0].postcode_sector}`
                metaTitle = `Discover ${metaTitle} in ${metaNear}` //replace Near with in // was Companies in ....
            } else {
                metaTitle = `Discover ${metaTitle} All Over The UK` //was Companies All Ov....
            }
            metaDescription = `Explore our Interactive GIS Map of ${metaDescription} Companies ${data.query.hasOwnProperty("reviews") && typeof Number(data.query.reviews) === "number" ? Number(data.query.reviews) > 0 ? `With more than ${data.query.reviews} Reviews, ` : `With Any Reviews ` : ""}${data.query.hasOwnProperty("distance") && typeof Number(data.query.distance.value) == "number" ? data.nearestLocation !== null ? `Within ${data.query.distance.value} Miles of` : "All Over The UK" : "Near"} ${metaNear}`

            // console.log("nearest loc: ", data.nearestLocation)
            let canonicalLinks = getCanonicalLink(data, prefixAndMeta);

            return {
                meta: metaTitle,
                description: metaDescription,
                canonicalURL: canonicalLinks.canonicalURL,
                area: data.nearestLocation !== null ? `${data.nearestLocation[0].name}, ${data.nearestLocation[0].county}` : "",
                nearby: canonicalLinks.nearby
            }

            //canonical URL
            break;

        //case company_review
    }


    //return data
}

let removeForwardSlash = (item) => {
    let regex_foward_slash = new RegExp(/\//ig, "i")
    let regex_multi_spaces = new RegExp(/\s\s+/g, "i")

    let string_s = item.replace(regex_foward_slash, "");
    string_s = string_s.replace(regex_multi_spaces, " ");
    return string_s;
}
let getCanonicalLink = (data, prefixAndMeta) => {
    ///maps/place/Greater+Manchester/@50.0900,-0.04904/services/Hello!BYe!Hello!Good/company/companyNameStartsHere/distance/3-miles/reviews/3

    //the url is structured lat long ([1], [0]) - its meant to be long, lat, but this is how the front-end uses it. needs to be fixed.

    let services = prefixAndMeta.services.length > 0 ? prefixAndMeta.services.join("!").toLowerCase() : [];

    let companyName = data.query.hasOwnProperty("company") && data.query.company.length > 0 ? data.query.company : null;
    let distance = data.query.hasOwnProperty("distance") && typeof Number(data.query.distance.value) == "number" ? data.query.distance.value <= 50 ? data.query.distance.value : 50 : null;
    let reviews = data.query.hasOwnProperty("reviews") && typeof Number(data.query.reviews) === "number" ? data.query.reviews <= 5 ? data.query.reviews : 5 : null;
    let canonicalURL = "";

    if (data.nearestLocation !== null) {
        let _placeCounty = removeForwardSlash(data.nearestLocation[0].county).split(" ").join("+").toLowerCase();
        canonicalURL = `https://vabva.com/maps/place/${_placeCounty}/@${data.nearestLocation[0].location.coordinates[1]},${data.nearestLocation[0].location.coordinates[0]}/`
    } else {
        canonicalURL = "https://vabva.com/maps/";
    }
    let queryURL = `${services.length > 0 ? "services/" + services + "/" : ""}${companyName !== null ? "company/" + companyName + "/" : ""}${distance !== null ? "distance/" + distance + "-miles" + "/" : ""}${reviews !== null ? "reviews/" + reviews : ""}`;
    canonicalURL += queryURL.toLowerCase();
    //make queryURL lower case too
    queryURL = queryURL.toLowerCase();

    let childrenLocal = data.nearbyPlaces.local.map((_place) => {
        let _placeCounty = removeForwardSlash(_place.county).split(" ").join("+").toLowerCase();
        return {
            name: `${_place.name}, ${_place.postcode_sector}`,
            url: `https://vabva.com/maps/place/${_placeCounty}/@${_place.location.coordinates[1]},${_place.location.coordinates[0]}/${queryURL}`
        }
    })
    let childrenCity = data.nearbyPlaces.counties.map((_place) => {
        let _placeCounty = removeForwardSlash(_place.county).split(" ").join("+").toLowerCase();
        return {
            name: `${_place.name}, ${_place.county}`,
            url: `https://vabva.com/maps/place/${_placeCounty}/@${_place.location.coordinates[1]},${_place.location.coordinates[0]}/${queryURL}`
        }
    })


    return { canonicalURL, nearby: { towns: childrenLocal, cities: childrenCity } };
}
let getPrefixAndServices = (data) => {
    let prefix = "";
    let tags = [];

    if (data.SIC == undefined) {
        return {
            prefix,
            services: tags
        }
    }

    let sicTagArr = [...new Array(data.SIC.length)].map((value, index) => data.SIC[index].tags);
    if (data.query.hasOwnProperty("services")) {
        data.query.services.map((service, index) => {
            let _tag = service.split("-").join(" ");
            let regex = new RegExp(_tag, "i");

            if (regex.test(sicTagArr) == true) {
                tags.push(_tag.split(" ").join("-"));
                //tag can be added.
                if(data.query.services.length - 1 == 0){
                    //only one service
                    prefix = _tag.capitalize();
                }
                if (index == data.query.services.length - 1 && data.query.services.length - 1 != 0) {
                    //last word. We add And at the end;
                    prefix += " and " + _tag.capitalize()
                    // console.log("length: ", data.query.services.length - 1)
                }
                if (index == data.query.services.length - 2) {
                    //before last word
                    prefix += _tag.capitalize()
                }
                if (index < data.query.services.length - 2) {
                    //any word
                    prefix += _tag.capitalize() + ", "
                }
            }
        })
    }

    return {
        prefix,
        services: tags
    }

}

//capitalise words
String.prototype.capitalize = function () {
    let arr = this.trim().split(" ");
    let _string = ""

    arr.map((word, index) => {
        _string += word.charAt(0).toUpperCase() + word.slice(1)
        if (index !== arr.length - 1) {
            _string += " ";
        }
    })

    return _string
}

