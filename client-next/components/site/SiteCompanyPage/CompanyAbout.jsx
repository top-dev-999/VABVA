import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

const CompanyAboutInner = (props) => {
    const { about, video } = props;

    if (!about && !video) {
        return null;
    }

    return (
        <section className="section">
            <header className="section__header">
                <h4 className="section__title">About</h4>
            </header>
            {about && <p className="section__content">{about}</p>}
            {video && <ReactPlayer url={video} width="100%" />}
        </section>
    );
};

CompanyAboutInner.propTypes = {
    about: PropTypes.string,
    video: PropTypes.string
};

export const CompanyAbout = memo(CompanyAboutInner);
