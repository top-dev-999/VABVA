import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { Button } from '../../../ui';
import { useMountedRef } from '../../../ui/utils';
import { CompanyReviewsList } from './CompanyReviewsList';
import { getCompanyReviews } from '../../../../services/api';
import { CompanyReviewEditorWindow } from './CompanyReviewEditorWindow';
import { CompanyReviewSuccessWindow } from './CompanyReviewSuccessWindow';
import { CompanyReviewSuccessVerifyWindow } from './CompanyReviewSuccessVerifyWindow';

const CompanyReviewsInner = (props) => {
    const { companyId, companyName, totalReviews = 0 } = props;
    const [items, setItems] = useState([]);
    const [openConfirmWindow, setOpenConfirmWindow] = useState(false);
    const [openSuccessVerifyWindow, setOpenSuccessVerifyWindow] = useState(false);
    const [openEditorWindow, setOpenEditorWindow] = useState(false);
    const [loading, setLoading] = useState(true);
    const useMoundedRef = useMountedRef();
    const router = useRouter();

    // Handlers

    const handleCloseConfirmWindow = useCallback(() => {
        setOpenConfirmWindow(false);
    }, []);

    const handleCloseSuccessVerifyWindow = useCallback(() => {
        setOpenSuccessVerifyWindow(false);
    }, []);

    const handleCloseEditorWindow = useCallback(() => {
        setOpenEditorWindow(false);
    }, []);

    const handleOpenEditorWindow = useCallback(() => {
        setOpenEditorWindow(true);
    }, []);

    const handleSubmittedEditorWindow = useCallback(() => {
        setOpenEditorWindow(false);
        setOpenConfirmWindow(true);
    }, []);

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const result = await getCompanyReviews(companyId);

            if (useMoundedRef.current) {
                setItems(result);
            }
        } catch (e) {
            console.error(e?.message);
        } finally {
            if (useMoundedRef.current) {
                setLoading(false);
            }
        }
    }, [companyId, useMoundedRef]);

    // Effects

    useEffect(() => {
        if (router.query?.successfullyVerified) {
            setOpenSuccessVerifyWindow(true);

            // Remove query param `successfullyVerified=true` from pathname
            router.replace({
                pathname: router.pathname,
                query: { urls: router.query.urls }
            });
        }
    }, [router]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Render

    const totals = items.length || totalReviews;

    return (
        <React.Fragment>
            <CompanyReviewEditorWindow
                open={openEditorWindow}
                centered
                companyId={companyId}
                onClose={handleCloseEditorWindow}
                onSubmitted={handleSubmittedEditorWindow}
            />

            <CompanyReviewSuccessWindow
                open={openConfirmWindow}
                onClose={handleCloseConfirmWindow}
            />

            <CompanyReviewSuccessVerifyWindow
                open={openSuccessVerifyWindow}
                onClose={handleCloseSuccessVerifyWindow}
            />

            {!loading && (
                <section className="section company-reviews">
                    <header className="section__header company-reviews__header">
                        <h4 className="section__title">Reviews ({totals})</h4>
                        <Button
                            variant="outline-secondary"
                            className="ml-auto"
                            onClick={handleOpenEditorWindow}
                        >
                            Leave a review
                        </Button>
                    </header>

                    <CompanyReviewsList
                        items={items}
                        companyName={companyName}
                        onOpenEditorWindow={handleOpenEditorWindow}
                    />
                </section>
            )}
        </React.Fragment>
    );
};

CompanyReviewsInner.propTypes = {
    companyId: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    totalReviews: PropTypes.number
};

export const CompanyReviews = memo(CompanyReviewsInner);
