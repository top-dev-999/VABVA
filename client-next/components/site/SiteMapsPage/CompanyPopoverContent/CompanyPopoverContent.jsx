import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Cross14Svg } from '../../../../assets/svg';
import { Rating } from '../../../ui/Rating';
import { List, ListItem, ListItemIcon, ListItemText } from '../../../ui/List';
import { IconButton } from '../../../ui/IconButton';
import { config } from '../../../../config';

const CompanyPopoverContentInner = (props) => {
    const { data, onClose } = props;

    const handleClose = useCallback(
        (ev) => {
            if (onClose) {
                onClose(ev);
            }
        },
        [onClose]
    );

    const { name, address, rating, totalReviews, pathnameQuery, colours = [] } = data || {};
    const shouldDisplayTags = colours.length > 0;

    return (
        <div className="company-popover-content company">
            <IconButton plain className="company-popover-content__close-btn" onClick={handleClose}>
                <Cross14Svg />
            </IconButton>
            <h5 className="company__name">{name}</h5>
            <div className="company__stat">
                <Rating defaultValue={rating} readOnly size="small" />
                <span className="company__total-reviews">({rating})</span>
            </div>
            <div className="company__address">{address}</div>
            {pathnameQuery && (
                <a
                    target="_blank"
                    href={config.urls.areas(pathnameQuery)}
                    rel="noopener noreferrer"
                    className="link company__review-link"
                >
                    Review
                </a>
            )}
            <List className="company__tags">
                {shouldDisplayTags &&
                    colours.map((item, index) => {
                        const { colour, companies, description } = item || {};

                        if (!description) {
                            return null;
                        }

                        return (
                            <ListItem key={index} className="company__tag">
                                <ListItemIcon>
                                    <div
                                        className="company__tag-colour"
                                        style={{ background: colour }}
                                    />
                                </ListItemIcon>
                                <ListItemText flex>{description}</ListItemText>
                                <ListItemText className="company__tag-total">
                                    {companies}
                                </ListItemText>
                            </ListItem>
                        );
                    })}
            </List>
        </div>
    );
};

CompanyPopoverContentInner.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        address: PropTypes.string,
        pathnameQuery: PropTypes.string,
        rating: PropTypes.number,
        totalReviews: PropTypes.number,
        colours: PropTypes.arrayOf(
            PropTypes.shape({
                colour: PropTypes.string,
                companies: PropTypes.number,
                description: PropTypes.string
            })
        )
    }),
    onClose: PropTypes.func
};

export const CompanyPopoverContent = memo(CompanyPopoverContentInner);
