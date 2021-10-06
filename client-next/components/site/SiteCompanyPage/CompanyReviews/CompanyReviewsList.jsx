import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Review } from '../../../Review/Review';
import { Scrollbar } from '../../../ui';

const CompanyReviewsListInner = (props) => {
    const { items, companyName = '', onOpenEditorWindow } = props;

    const handleLeaveRiveiwLinkClick = (ev) => {
        if (onOpenEditorWindow) {
            onOpenEditorWindow(ev);
        }
    };

    const shouldDisplayList = items && items.length > 0;

    const emptyListElement = (
        <div className="empty-list">
            Be the first to{' '}
            <button className="empty-list__link" onClick={handleLeaveRiveiwLinkClick}>
                leave a review
            </button>{' '}
            {companyName ? `for ${companyName}!` : '.'}
        </div>
    );

    if (!shouldDisplayList) {
        return emptyListElement;
    }

    return (
        <div className="reviews-list company-reviews__list">
            <Scrollbar autoHide>
                {items.map((item, index) => {
                    return <Review key={item?.id || index} {...item} />;
                })}
            </Scrollbar>
        </div>
    );
};

CompanyReviewsListInner.propTypes = {
    companyName: PropTypes.string,
    items: PropTypes.array,
    onOpenEditorWindow: PropTypes.func
};

export const CompanyReviewsList = memo(CompanyReviewsListInner);
