import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PriceTable = (props) => {
    const { items = [], className } = props;

    const isEmpty = items.length === 0;

    if (isEmpty) {
        return null;
    }

    return (
        <div className={classNames('price-table', className)}>
            {items.map((item) => {
                const { id, name, priceMin, priceAvg, priceMax } = item;

                return (
                    <div key={id} className="price-table__row">
                        <div className="price-table__col price-table__col--name">{name}</div>
                        <div className="price-table__col price-table__col--price">
                            <span className="price-table__label">Cheapest Price</span>
                            <span className="price-table__value">
                                {priceMin ? `£${priceMin}` : '-'}
                            </span>
                        </div>
                        <div className="price-table__col price-table__col--price">
                            <span className="price-table__label">Average Cost</span>
                            <span className="price-table__value">
                                {priceAvg ? `£${priceAvg}` : '-'}
                            </span>
                        </div>
                        <div className="price-table__col price-table__col--price">
                            <span className="price-table__label">Maximum Cost</span>
                            <span className="price-table__value">
                                {priceMax ? `£${priceMax}` : '-'}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

PriceTable.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            priceMin: PropTypes.string,
            priceAvg: PropTypes.string,
            priceMax: PropTypes.string
        })
    ),
    className: PropTypes.string
};

export { PriceTable };
