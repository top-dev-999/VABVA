import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const CompanyTagsInner = (props) => {
    const { items = [] } = props;

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <ul className="company__tags">
            {items.map((item, index) => {
                const { name, url } = item || {};
                return (
                    <li key={index} className="company__tag-item">
                        <Link href={url}>
                            <a className="company__tag-link">{name}</a>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

CompanyTagsInner.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            url: PropTypes.string
        })
    )
};

export const CompanyTags = memo(CompanyTagsInner);
