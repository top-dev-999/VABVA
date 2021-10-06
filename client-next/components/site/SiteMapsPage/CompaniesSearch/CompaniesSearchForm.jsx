import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import _kebabCase from 'lodash/kebabCase';
import _startCase from 'lodash/startCase';

import { Scrollbar } from '../../../ui/Scrollbar';
import { Form, FormRow, InputField, RatingField } from '../../../ui/FormikForm';
import { Button } from '../../../ui/Button';
import { CompaniesSearchAreaSelectField } from './CompaniesSearchAreaSelectField';
import { CompaniesSearchTagsSelectField } from './CompaniesSearchTagsSelectField';
import { CompaniesSearchDistanceSlider } from './CompaniesSearchDistanceSlider';
import { useSiteMapsPage } from '../SiteMapsPageContext';
import { createUrlByValues } from '../../../../services/api/maps';
import { config } from '../../../../config';

const defaultInitialValues = {
    company: '',
    services: null,
    place: null,
    distance: 10,
    reviews: 0
};

const CompaniesSearchForm = (props) => {
    const { onNearbyClick, onSubmit } = props;

    const { searchFormValues, isTablet } = useSiteMapsPage();
    const router = useRouter();
    const formikRef = useRef(null);
    const prevPathnameRef = useRef(null);

    const initialValues = useMemo(() => {
        const {
            company = '',
            services = null,
            distance = 10,
            reviews = 0,
            area = '',
            coordinates = {}
        } = searchFormValues || {};

        const placeId = _kebabCase(area) || '';
        const placeCoordinates = [coordinates?.lat, coordinates?.long];
        const [placeName, placeCounty] = String(area)
            .split(',')
            .map((item) => _startCase(item));

        return {
            ...defaultInitialValues,
            company,
            services,
            distance,
            reviews,
            place: {
                id: placeId,
                name: placeName,
                county: placeCounty,
                coordinates: placeCoordinates
            }
        };
    }, [searchFormValues]);

    const handleNearbyClick = useCallback(
        (ev) => {
            if (onNearbyClick) {
                onNearbyClick(ev);
            }
        },
        [onNearbyClick]
    );

    const handleSearchClick = useCallback(() => {
        if (formikRef.current) {
            formikRef.current.handleSubmit();
        }
    }, []);

    const handleSubmit = useCallback(
        (values) => {
            const pathname = createUrlByValues(values);

            if (pathname !== prevPathnameRef.current) {
                const url = config.urls.maps(pathname);

                router.push(url, null, {
                    shallow: true
                });
            }

            if (onSubmit) {
                onSubmit();
            }
        },
        [router, onSubmit]
    );

    useEffect(() => {
        if (formikRef.current) {
            prevPathnameRef.current = createUrlByValues(formikRef.current.values);
        }
    }, [searchFormValues]);

    return (
        <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validateOnMount={false}
            validateOnChange={false}
            enableReinitialize
            innerRef={formikRef}
            onSubmit={handleSubmit}
        >
            {(fProp) => {
                return (
                    <Form className="maps-page__search-form">
                        <div className="maps-page__search-form-body">
                            <Scrollbar autoHeight={false} enableHorizontalTrack={false}>
                                <FormRow>
                                    <InputField
                                        name="company"
                                        label="Company"
                                        labelAlign="top"
                                        placeholder="Enter company name"
                                        fullWidth
                                    />
                                </FormRow>
                                <FormRow>
                                    <CompaniesSearchTagsSelectField />
                                </FormRow>
                                <FormRow>
                                    <CompaniesSearchAreaSelectField
                                        onNearbyClick={handleNearbyClick}
                                    />
                                </FormRow>
                                <FormRow>
                                    <CompaniesSearchDistanceSlider />
                                </FormRow>
                                <FormRow>
                                    <RatingField
                                        name="reviews"
                                        label="Review"
                                        labelAlign="top"
                                        size="large"
                                        fullWidth
                                    />
                                </FormRow>
                            </Scrollbar>
                        </div>
                        <div className="maps-page__search-actions">
                            <Button
                                variant="light"
                                className="maps-page__search-btn"
                                disabled={!fProp.dirty && !isTablet}
                                onClick={handleSearchClick}
                            >
                                Show Results
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

CompaniesSearchForm.propTypes = {
    onNearbyClick: PropTypes.func,
    onSubmit: PropTypes.func
};

export { CompaniesSearchForm };
