import React, { memo } from 'react';
import PropTypes from 'prop-types';
import formatDate from 'date-fns/format';

import { Avatar, Rating } from '../ui';

const ReviewInner = (props) => {
    const { id, user = '', rating, date, content = '' } = props;

    const avatarLetter = String(user).charAt(0).toUpperCase();

    return (
        <section className="review">
            <header className="review__header">
                {avatarLetter && <Avatar className="review__avatar">{avatarLetter}</Avatar>}

                <div className="review__title-box">
                    <h5 className="review__title">
                        <span className="review__user">{user}</span>
                        {date && (
                            <span className="review__date">{formatDate(date, 'dd MMMM yyyy')}</span>
                        )}
                    </h5>
                    <Rating
                        readOnly
                        size="small"
                        defaultValue={rating}
                        className="review__rating"
                    />
                </div>
            </header>
            <div className="review__content">{content}</div>
        </section>
    );
};

ReviewInner.propTypes = {
    id: PropTypes.string,
    user: PropTypes.string,
    rating: PropTypes.number,
    date: PropTypes.object,
    content: PropTypes.string
};

export const Review = memo(ReviewInner);
