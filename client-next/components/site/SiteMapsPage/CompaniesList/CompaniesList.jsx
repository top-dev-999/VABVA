import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import classNames from 'classnames';

import { Scrollbar } from '../../../ui';
import { useControlled } from '../../../ui/utils';
import { CompaniesListRow } from './CompaniesListRow';

const CompaniesListInner = (props) => {
    const {
        data = [],
        title = 'Companies',
        className,
        selectedId: selectedIdProp = '',
        rowHeight = 140,
        onSelect,
        ...other
    } = props;

    const [selectedId, setSelectedId] = useControlled(selectedIdProp);
    const listRef = useRef(null);
    const scrollbarRef = useRef(null);

    const handleScroll = useCallback((ev) => {
        const target = ev.target;

        if (target && listRef.current) {
            listRef.current.scrollTo(target.scrollTop);
        }
    }, []);

    const handleSelect = useCallback(
        (ev, item) => {
            if (onSelect) {
                onSelect(item);
            } else {
                setSelectedId(item?.id);
            }
        },
        [setSelectedId, onSelect]
    );

    // Render

    const isEmpty = data.length === 0;

    const itemData = useMemo(
        () => ({
            items: data,
            selectedId,
            onSelect: handleSelect
        }),
        [data, selectedId, handleSelect]
    );

    if (isEmpty) {
        return <p className="list-empty">No companies found.</p>;
    }

    return (
        <div {...other} className={classNames('companies-list', className)}>
            <header className="companies-list__header">
                <h5 className="companies-list__title">{title}</h5>
            </header>
            <div className="companies-list__body">
                <AutoSizer disableWidth style={{ height: '100%' }}>
                    {({ height }) => {
                        return (
                            <Scrollbar ref={scrollbarRef} onScroll={handleScroll}>
                                <FixedSizeList
                                    height={height}
                                    width="100%"
                                    itemSize={rowHeight}
                                    itemCount={data.length}
                                    itemData={itemData}
                                    ref={listRef}
                                    style={{ overflow: 'initial' }}
                                >
                                    {CompaniesListRow}
                                </FixedSizeList>
                            </Scrollbar>
                        );
                    }}
                </AutoSizer>
            </div>
        </div>
    );
};

CompaniesListInner.propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    className: PropTypes.string,
    rowHeight: PropTypes.number,
    selectedId: PropTypes.string,
    onSelect: PropTypes.func
};

export const CompaniesList = memo(CompaniesListInner);
