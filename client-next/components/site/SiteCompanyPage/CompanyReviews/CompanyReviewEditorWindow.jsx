import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import * as Yup from 'yup';

import {
    Alert,
    Window,
    WindowActions,
    WindowBody,
    WindowHeader,
    WindowLoadingMask,
    Button
} from '../../../ui';
import { useMountedRef } from '../../../ui/utils';
import { Form, FormRow, InputField, RatingField } from '../../../ui/FormikForm';
import { postCompanyReview } from '../../../../services/api';
import { validTextPattern } from '../../../../services/utils';

const initialValues = { rating: '', name: '', email: '', review: '' };

const validatationSchema = Yup.object({
    rating: Yup.number()
        .required('This field is required!')
        .min(0.5, 'Rating must be greater than or equal to 0.5'),
    name: Yup.string()
        .required('This field is required!')
        .matches(validTextPattern, 'Invalid format!'),
    email: Yup.string().required('This field is required!').email('Invalid email address!'),
    review: Yup.string()
        .required('This field is required!')
        .min(5, 'At least ${min} charecters long required!')
        .matches(validTextPattern, 'Invalid format!')
});

const CompanyReviewEditorWindowInner = (props) => {
    const { companyId, open, children, onClose, onSubmitted, ...other } = props;
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const fkRef = useRef(null);
    const isMountedRef = useMountedRef();

    const handleClose = useCallback(() => {
        if (submitting) {
            return;
        }

        if (onClose) {
            onClose();
        }
    }, [submitting, onClose]);

    const handlePostButtonClick = useCallback(() => {
        if (fkRef.current && fkRef.current.handleSubmit) {
            fkRef.current.handleSubmit();
        }
    }, []);

    const handleSubmit = useCallback(
        async (values) => {
            setSubmitting(true);

            try {
                const response = await postCompanyReview(companyId, values);

                if (isMountedRef.current) {
                    if (response?.success && onSubmitted) {
                        onSubmitted();
                    } else {
                        setError(true);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (isMountedRef.current) {
                    setSubmitting(false);
                }
            }
        },
        [companyId, isMountedRef, onSubmitted]
    );

    useEffect(() => {
        if (open) {
            // Reset error
            setError(false);

            // Reset form
            if (fkRef.current && fkRef.current?.handleReset) {
                fkRef.current.handleReset();
            }
        }
    }, [open]);

    return (
        <Window
            {...other}
            open={open}
            maxWidth={540}
            onClose={handleClose}
            onEscapeKeyDown={handleClose}
            disableFocusBounding={false}
            disableRestoreFocus
        >
            <WindowLoadingMask open={submitting} secondary />
            <WindowHeader title="Leave a review" onClose={handleClose} />
            <WindowBody>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validatationSchema}
                    onSubmit={handleSubmit}
                    innerRef={fkRef}
                >
                    <Form>
                        {error && (
                            <FormRow>
                                <Alert type="error">
                                    Can&#39;t save the review!
                                    <br />
                                    Probable you enter the data in invalid format.
                                </Alert>
                            </FormRow>
                        )}
                        <FormRow>
                            <RatingField
                                name="rating"
                                label="Click to rate"
                                labelAlign="left"
                                labelTextAlign="left"
                                labelWidth={120}
                                required
                            />
                        </FormRow>
                        <FormRow>
                            <Row noGutters>
                                <Col sm>
                                    <InputField
                                        name="name"
                                        label="Name"
                                        labelAlign="top"
                                        placeholder="Name"
                                        required
                                        fullWidth
                                    />
                                </Col>
                                <Col sm className="ml-sm-9 mt-sm-0 mt-12">
                                    <InputField
                                        name="email"
                                        label="Email"
                                        labelAlign="top"
                                        placeholder="Email"
                                        required
                                        fullWidth
                                    />
                                </Col>
                            </Row>
                        </FormRow>
                        <FormRow>
                            <InputField
                                type="textarea"
                                name="review"
                                label="Review"
                                labelAlign="top"
                                placeholder="Write your review"
                                inputProps={{ style: { height: 120 } }}
                                required
                                fullWidth
                            />
                        </FormRow>
                    </Form>
                </Formik>
            </WindowBody>
            <WindowActions>
                <Button variant="transparent" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="secondary"
                    className="ml-auto"
                    width={160}
                    onClick={handlePostButtonClick}
                >
                    Post Review
                </Button>
            </WindowActions>
        </Window>
    );
};

CompanyReviewEditorWindowInner.propTypes = {
    companyId: PropTypes.string.isRequired,
    open: PropTypes.bool,
    children: PropTypes.node,
    onClose: PropTypes.func,
    onSubmitted: PropTypes.func
};

export const CompanyReviewEditorWindow = memo(CompanyReviewEditorWindowInner);
