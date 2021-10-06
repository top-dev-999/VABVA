import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Rating, Avatar } from '../../ui';
import { Globus18Svg, Location16Svg, Phone16Svg } from '../../../assets/svg';

const CompanyInfoInner = (props) => {
    const { name = '', address, phone, website, totalReviews, rating } = props;

    const avatarLetter = String(name).charAt(0).toUpperCase();

    return (
        <div className="company__info">
            {avatarLetter && (
                <Avatar size="large" className="company__avatar">
                    {avatarLetter}
                </Avatar>
            )}

            <section className="company__details">
                <h3 className="company__name">{name}</h3>

                <ul className="company-details-list">
                    {address && (
                        <li className="company-details-list__item">
                            <span className="company-details-list__icon">
                                <Location16Svg />
                            </span>
                            <span className="company-details-list__text">{address}</span>
                        </li>
                    )}

                    {phone && (
                        <li className="company-details-list__item">
                            <span className="company-details-list__icon">
                                <Phone16Svg />
                            </span>
                            <span className="company-details-list__text">{phone}</span>
                        </li>
                    )}

                    {website && (
                        <li className="company-details-list__item">
                            <span className="company-details-list__icon">
                                <Globus18Svg />
                            </span>
                            <span className="company-details-list__text">
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noreferrer nofollow"
                                    className="company-details-list__link"
                                >
                                    Website
                                </a>
                            </span>
                        </li>
                    )}

                    <li className="company-details-list__item">
                        <div className="company-details-list__text company__stat">
                            <Rating defaultValue={rating} readOnly size="medium" />
                            <span className="company__total-reviews">({rating})</span>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
    );
};

CompanyInfoInner.propTypes = {
    name: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    rating: PropTypes.number,
    totalReviews: PropTypes.number
};

export const CompanyInfo = memo(CompanyInfoInner);
