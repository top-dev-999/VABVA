import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PageLink } from '../../PageLink';
import {
    BrandIcon32Svg,
    BrandIcon40Svg,
    BrandName18Svg,
    BrandName22Svg
} from '../../../assets/svg';

const BrandInner = (props) => {
    const { large, className } = props;

    const brandIconElement = large ? <BrandIcon40Svg /> : <BrandIcon32Svg />;
    const brandNameElement = large ? (
        <BrandName22Svg className="brand__name" />
    ) : (
        <BrandName18Svg className="brand__name" />
    );

    return (
        <PageLink
            href="/"
            className={classNames('brand', className, {
                'brand--large': large
            })}
        >
            {brandIconElement}
            {brandNameElement}
        </PageLink>
    );
};

BrandInner.propTypes = {
    large: PropTypes.bool,
    className: PropTypes.string
};

export const Brand = memo(BrandInner);
