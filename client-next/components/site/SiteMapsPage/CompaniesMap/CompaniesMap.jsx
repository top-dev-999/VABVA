import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useSupercluster from 'use-supercluster';

import { GoogleMap, GoogleMapMarker } from '../../../GoogleMap';
import { config } from '../../../../config';

import { CompaniesMapCluster } from './CompaniesMapCluster';
import { CompaniesMapBalloonButton } from './CompaniesMapBalloonButton';

/**
    Resources 
    
    Clustering: 
    - https://www.leighhalliday.com/google-maps-clustering
    - https://github.com/leighhalliday/use-supercluster
    
    Google Map: 
     - https://developers.google.com/maps/documentation/javascript/reference/map
     - https://salman-w.blogspot.com/2011/03/zoom-to-fit-all-markers-on-google-map.html
 */

const parseCompany = (company) => {
    return {
        type: 'Feature',
        properties: { cluster: false, ...company },
        geometry: {
            type: 'Point',
            coordinates: [company.geo.lng, company.geo.lat]
        }
    };
};

const CompaniesMap = (props) => {
    const {
        companies: companiesProp,
        center,
        loading,
        offsetX = 0,
        offsetY = 0,
        disableAutoFitBounds = false,
        selectedCompany,
        onCompanySelect
    } = props;

    const [points, setPoints] = useState([]);
    const [zoom, setZoom] = useState(config.googleMap.defaultZoom);
    const [bounds, setBounds] = useState([]);

    const [map, setMap] = useState(null);
    const mapsRef = useRef(null);
    const mapLatLngBoundsRef = useRef(null);
    const hadMarkerClickRecently = useRef(false);

    const { clusters, supercluster } = useSupercluster({
        points,
        bounds,
        zoom,
        options: { radius: 75, maxZoom: 16 }
    });

    // Handlers

    const handleMapLoaded = useCallback((mapProp, maps) => {
        mapsRef.current = maps;
        setMap(mapProp);
    }, []);

    const handleMapChange = useCallback(({ zoom: zoomProp, bounds: boundProp, ...other }) => {
        setZoom(zoomProp);
        setBounds([boundProp.nw.lng, boundProp.se.lat, boundProp.se.lng, boundProp.nw.lat]);
    }, []);

    const handleClusterClick = useCallback(
        (ev, params = {}) => {
            const { id, latitude, longitude } = params;

            if (!id) {
                return;
            }

            const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(id), 20);

            if (map) {
                map.setZoom(expansionZoom);
                map.panTo({ lat: latitude, lng: longitude });
            }
        },
        [supercluster, map]
    );

    const handleCompanySelect = useCallback(
        (ev, data) => {
            hadMarkerClickRecently.current = true;

            if (onCompanySelect) {
                onCompanySelect(data);
            }
        },
        [onCompanySelect]
    );

    const pointsLength = useMemo(() => {
        return points.length;
    }, [points]);

    const items = useMemo(() => {
        return clusters.map((cluster) => {
            const { geometry, properties, id } = cluster;
            const [longitude, latitude] = geometry.coordinates;

            if (properties?.cluster) {
                // Add a cluster location to the map bounds
                if (mapLatLngBoundsRef.current && mapsRef.current) {
                    const clusterLoc = new mapsRef.current.LatLng(latitude, longitude);
                    mapLatLngBoundsRef.current.extend(clusterLoc);
                }

                return (
                    <GoogleMapMarker key={id} lat={latitude} lng={longitude}>
                        <CompaniesMapCluster
                            id={id}
                            latitude={latitude}
                            longitude={longitude}
                            pointCount={properties?.point_count}
                            pointsLength={pointsLength}
                            onClick={handleClusterClick}
                        />
                    </GoogleMapMarker>
                );
            }

            const { id: companyId, geo = {} } = cluster.properties;

            // Add a company location to the map bounds
            if (mapLatLngBoundsRef.current && mapsRef.current) {
                const markerLoc = new mapsRef.current.LatLng(geo?.lat, geo?.lng);
                mapLatLngBoundsRef.current.extend(markerLoc);
            }

            return (
                <GoogleMapMarker key={companyId} lat={geo?.lat} lng={geo?.lng}>
                    <CompaniesMapBalloonButton
                        data={cluster.properties}
                        selected={selectedCompany?.id === companyId}
                        onSelect={handleCompanySelect}
                    />
                </GoogleMapMarker>
            );
        });
    }, [clusters, pointsLength, selectedCompany, handleClusterClick, handleCompanySelect]);

    const companies = useMemo(() => {
        return !loading ? companiesProp : [];
    }, [loading, companiesProp]);

    // Effects

    useEffect(() => {
        setTimeout(() => {
            setPoints(() => companies.map(parseCompany));
        }, 0);

        if (map && mapsRef.current && companies.length > 0) {
            mapLatLngBoundsRef.current = new mapsRef.current.LatLngBounds();
        }
    }, [companies, map]);

    // Update the map zoom according to the markers positions
    useEffect(() => {
        if (map && mapLatLngBoundsRef.current && !disableAutoFitBounds) {
            if (items.length > 1) {
                map.fitBounds(mapLatLngBoundsRef.current);
                map.panToBounds(mapLatLngBoundsRef.current);

                mapLatLngBoundsRef.current = null;
            } else if (points.length > 0 && items.length === 0) {
                map.setZoom(11);
            }
        }
    }, [items, points, map, zoom, disableAutoFitBounds]);

    useEffect(() => {
        const lat = selectedCompany?.geo?.lat;
        const lng = selectedCompany?.geo?.lng;

        if (map && lat && lng && !hadMarkerClickRecently.current) {
            map.setZoom(17);
            map.panTo({ lat, lng });
            map.panBy(offsetX, -150);
        }

        hadMarkerClickRecently.current = false;
    }, [selectedCompany, map, offsetX]);

    // Render

    let mapCenter = null;

    if (center?.lat && center?.long) {
        mapCenter = [center.lat, center.long];
    }

    return (
        <GoogleMap
            className="map"
            center={mapCenter}
            options={{
                disableDefaultUI: true,
                clickableIcons: false
            }}
            onMapLoaded={handleMapLoaded}
            onChange={handleMapChange}
        >
            {items}
        </GoogleMap>
    );
};

CompaniesMap.propTypes = {
    loading: PropTypes.bool,
    companies: PropTypes.array,
    center: PropTypes.shape({
        lat: PropTypes.number,
        long: PropTypes.number
    }),
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    disableAutoFitBounds: PropTypes.bool,
    selectedCompany: PropTypes.shape({
        id: PropTypes.string.isRequired,
        geo: PropTypes.shape({
            lat: PropTypes.number,
            logn: PropTypes.number
        })
    }),
    onCompanySelect: PropTypes.func
};

export { CompaniesMap };
