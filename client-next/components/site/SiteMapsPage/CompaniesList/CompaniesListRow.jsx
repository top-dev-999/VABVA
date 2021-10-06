import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import _truncate from 'lodash/truncate';
import { areEqual } from 'react-window';

import { CompaniesListItem } from './CompaniesListItem';

const MARGIN_BOTTOM = 10;

const CompaniesListRowInner = (props) => {
    const { data = {}, index, style } = props;
    const { items = [], selectedId, onSelect } = data;
    const item = items[index] || {};

    const handleClick = (ev) => {
        if (onSelect) {
            onSelect(ev, item);
        }
    };

    const itemStyle = {
        ...style,
        height: style.height - MARGIN_BOTTOM,
        top: style.top + MARGIN_BOTTOM
    };

    return (
        <CompaniesListItem
            {...item}
            style={itemStyle}
            selected={item?.id === selectedId}
            onClick={handleClick}
        />
    );
};

CompaniesListRowInner.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string
            })
        ),
        selected: PropTypes.bool,
        onSelect: PropTypes.func
    }),
    index: PropTypes.number,
    style: PropTypes.object
};

export const CompaniesListRow = memo(CompaniesListRowInner, areEqual);
