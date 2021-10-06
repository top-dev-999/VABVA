import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import _kebabCase from 'lodash/kebabCase';

import { useControlled, useMediaQuery, useMountedRef } from '../../ui/utils';
import { PageHead } from '../../PageHead';
import { getMapCompanies, parseMapsUrlOptions } from '../../../services/api/maps';
import { MapsPageAsideLeft } from './MapsPageAsideLeft';
import { MapsPageAsideRight } from './MapsPageAsideRight';
import { MapsPageSSRAsideCompaniesList } from './MapsPageSSR/MapsPageSSRAsideCompaniesList';
import { SiteMapsPageContextValues } from './SiteMapsPageContext';

const CompaniesMap = dynamic(() => import('./CompaniesMap').then((module) => module.CompaniesMap), {
    ssr: false
});

const SiteMapsPage = (props) => {
    const { seo: seoProp, nearby: nearbyProp, companies: companiesProp, isSSR = false } = props;

    const [companies, setCompanies] = useControlled(companiesProp, []);
    const [nearby, setNearby] = useControlled(nearbyProp, {});
    const [seo, setSeo] = useControlled(seoProp, {});

    const [loading, setLoading] = useState(false);
    const [openLeftAside, setOpenLeftAside] = useState(!!isSSR);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [mapOffset, setMapOffset] = useState(null);

    const { query: routerQuery } = useRouter();
    const isTablet = useMediaQuery('(max-width: 1200px)');
    const isMobile = useMediaQuery('(max-width: 576px)');
    const isMountedRef = useMountedRef();
    const leftAsideRef = useRef(null);

    const handleCompanySelect = useCallback((data) => {
        setSelectedCompany(data);
    }, []);

    const handleCompanySelectFromLeftAside = useCallback(
        (data) => {
            handleCompanySelect(data);

            if (isMobile) {
                setOpenLeftAside(false);
            }
        },
        [isMobile, handleCompanySelect]
    );

    const handleToggleLeftAside = useCallback(() => {
        setOpenLeftAside((prevState) => !prevState);
    }, []);

    const filters = useMemo(() => {
        return parseMapsUrlOptions(routerQuery?.options);
    }, [routerQuery]);

    const fetchCompanies = useCallback(
        async (customFilters = null) => {
            setLoading(true);

            try {
                const result = await getMapCompanies(customFilters || filters);

                if (result?.companies) {
                    setCompanies(result?.companies);
                }

                if (result?.nearby) {
                    setNearby(result?.nearby);
                }

                if (result?.seo) {
                    setSeo(result?.seo);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        },
        [filters, isMountedRef, setCompanies, setNearby, setSeo]
    );

    useEffect(() => {
        if (isSSR) {
            return undefined;
        }

        // Trying to get user location when options is empty
        if (!routerQuery?.options && window.navigator) {
            const geolocation = window.navigator.geolocation;

            geolocation.getCurrentPosition(
                // When is allowed
                ({ coords }) => {
                    const geoFilters = parseMapsUrlOptions();

                    geoFilters.coordinates = {
                        lat: coords.latitude,
                        long: coords.longitude
                    };

                    fetchCompanies(geoFilters);
                },
                // When is rejected
                () => {
                    fetchCompanies();
                }
            );
        } else {
            fetchCompanies();
        }

        return undefined;
    }, [fetchCompanies, routerQuery, isSSR]);

    useEffect(() => {
        if (loading && isMountedRef.current) {
            setSelectedCompany(null);
            setOpenLeftAside(false);

            return () => {
                setOpenLeftAside(true);
            };
        }
        return undefined;
    }, [loading, openLeftAside, isMountedRef]);

    useEffect(() => {
        if (leftAsideRef.current) {
            const { width } = leftAsideRef.current.getBoundingClientRect();

            if (openLeftAside && width && isTablet && !isMobile) {
                const offsetX = width / -2;

                setMapOffset({
                    x: offsetX
                });
            } else {
                setMapOffset(null);
            }
        }
    }, [openLeftAside, isTablet, isMobile]);

    // Render

    const searchFormValues = useMemo(() => {
        return {
            company: filters?.company,
            services: filters?.services,
            distance: filters?.distance?.value,
            reviews: filters?.reviews,
            area: seo?.area,
            county: filters?.county,
            coordinates: filters?.coordinates
        };
    }, [seo, filters]);

    const contextValues = useMemo(() => {
        return {
            searchFormValues,
            isSSR,
            isTablet
        };
    }, [searchFormValues, isSSR, isTablet]);

    const shouldDisplayAsideClientList = !isSSR && !isTablet && !loading;
    const mapOffsetX = mapOffset?.x || 0;

    return (
        <React.Fragment>
            <PageHead
                title={seo?.title}
                description={seo?.description}
                canonical={seo?.canonical}
            />
            <SiteMapsPageContextValues.Provider value={contextValues}>
                <div className="maps-page">
                    <CompaniesMap
                        loading={loading}
                        companies={companies}
                        center={filters?.coordinates}
                        offsetX={mapOffsetX}
                        selectedCompany={selectedCompany}
                        disableAutoFitBounds={isSSR}
                        onCompanySelect={handleCompanySelect}
                    />

                    <MapsPageAsideLeft
                        ref={leftAsideRef}
                        open={openLeftAside}
                        loading={loading}
                        nearby={nearby}
                        companies={companies}
                        selectedCompanyId={selectedCompany?.id}
                        activePanel={isSSR ? 'nearby' : null}
                        onCompanySelect={handleCompanySelectFromLeftAside}
                        onToggle={handleToggleLeftAside}
                    />

                    <MapsPageAsideRight
                        open={shouldDisplayAsideClientList}
                        companies={companies}
                        selectedCompanyId={selectedCompany?.id}
                        onCompanySelect={handleCompanySelect}
                    />
                    <MapsPageSSRAsideCompaniesList open={isSSR} data={companies} />
                </div>
            </SiteMapsPageContextValues.Provider>
        </React.Fragment>
    );
};

SiteMapsPage.propTypes = {
    isSSR: PropTypes.bool,
    companies: PropTypes.array,
    seo: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        canonical: PropTypes.string
    }),
    nearby: PropTypes.shape({
        towns: PropTypes.array,
        cities: PropTypes.array
    })
};

export { SiteMapsPage };
