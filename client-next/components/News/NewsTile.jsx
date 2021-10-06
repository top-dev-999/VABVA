import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import _truncate from 'lodash/truncate';
import classNames from 'classnames';

import { ArrowRight14BrandSvg } from '../../assets/svg';

const NewsTileInner = (props) => {
    const { title = '', img = {}, description, linkHref, className, ...other } = props;

    const bodyElement = _truncate(String(description), { length: 70 });

    return (
        <section className={classNames('news__tile', className)}>
            {img?.src && (
                <div className="news__tile-img">
                    <Image src={img.src} alt={img?.alt} width={370} height={264} quality={85} />
                </div>
            )}
            {title && <h5 className="news__tile-title">{title}</h5>}
            {bodyElement && <p className="news__tile-body">{bodyElement}</p>}
            {linkHref && (
                <Link href={linkHref}>
                    <a className="link news__tile-link">
                        Read more
                        <ArrowRight14BrandSvg />
                    </a>
                </Link>
            )}
        </section>
    );
};

NewsTileInner.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    img: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
    }),
    description: PropTypes.string,
    linkHref: PropTypes.string
};

export const NewsTile = memo(NewsTileInner);
