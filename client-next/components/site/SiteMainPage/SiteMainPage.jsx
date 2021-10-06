import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Button } from '../../ui/Button';
import { PageHead } from '../../PageHead';
import { PageButton } from '../../PageButton';
import { Brand, Container } from '../../layouts';
import { Footer } from '../../layouts/Footer';
import { MainMenuLinks } from '../../layouts/MainMenuLinks';
import { MainMenuButtons } from '../../layouts/MainMenuButtons';
import { HeaderExpandMenuButton } from '../../layouts/Header/HeaderExpandMenuButton';
import { SocialNetList } from '../../layouts/SocialNet/SocialNetLilst';
import { ArrowRight14Svg } from '../../../assets/svg';
import { config } from '../../../config';

import { SocialCollage } from './SocialCollage';
import { IssuesCollage } from './IssuesCollage';

const NewsSection = dynamic(() => import('./NewsSection').then((module) => module.NewsSection), {
    ssr: false
});

const SiteMainPage = (props) => {
    return (
        <div className="page main-page">
            <header className="main-page__header">
                <div className="main-page__header-bg-wrap">
                    <Image
                        src="/images/main-header-bg-image.jpg"
                        alt="Main"
                        priority
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={85}
                    />
                </div>

                <nav className="navbar main-page__navbar">
                    <Container className="navbar__layout">
                        <Brand />
                        <MainMenuLinks className="navbar__links" />
                        <MainMenuButtons className="navbar__buttons" />
                        <HeaderExpandMenuButton className="navbar__expanded-menu-btn" />
                    </Container>
                </nav>

                <Container className="main-page__banner-layout">
                    <div className="main-page__banner">
                        <h3 className="main-page__banner-title">VABVA | Fuelling innovation</h3>
                        <div className="main-page__banner-desc">
                            Explorer the biggest open map of companies that handle waste thoughout
                            the UK
                        </div>
                        <Link href={config.urls.maps()} passHref>
                            <Button
                                link
                                variant="secondary"
                                size="lg"
                                iconRight={<ArrowRight14Svg />}
                                className="main-page__banner-btn"
                            >
                                Explore map
                            </Button>
                        </Link>
                    </div>
                </Container>
            </header>

            <main className="main-page__body">
                <Container>
                    {/* SEO Params */}

                    <PageHead
                        ignoreBaseTitle
                        title="VABVA | Fuelling innovation"
                        description="Explorer the biggest open map of companies that handle waste thoughout the UK"
                    />

                    {/* OneSignal init */}

                    <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script>
                    <script src="/scripts/one-signal.js" async />

                    {/* Waste Explore Section */}

                    <section className="landing-slide landing-slide--offset-right main-page__landing-slide">
                        <div className="landing-slide__picture">
                            <div className="gradient-border-box">
                                <Image
                                    src="/images/maps-screen-v2.jpg"
                                    alt="Waste Explore Screenshot"
                                    width={580}
                                    height={294}
                                    quality={85}
                                />
                            </div>
                        </div>
                        <header className="landing-slide__header">
                            <h6 className="main-page__subtitle">Waste Explore</h6>
                            <h4 className="main-page__title">Waste handlers</h4>
                            <div className="landing-slide__desc">
                                Find suppliers, use for R&D, and visual analysis of waste management
                                in the UK. Be Better Informed.
                            </div>

                            <Link href={config.urls.maps()} passHref>
                                <Button
                                    link
                                    variant="secondary"
                                    size="lg"
                                    iconRight={<ArrowRight14Svg />}
                                    className="landing-slide__action"
                                >
                                    Explore map
                                </Button>
                            </Link>
                        </header>
                    </section>

                    {/* Social Section */}

                    <section className="landing-slide main-page__landing-slide">
                        <header className="landing-slide__header">
                            <h6 className="main-page__subtitle">Social</h6>
                            <h4 className="main-page__title">Be the first to see it</h4>
                            <ul className="landing-slide__features-list">
                                <li>Watch</li>
                                <li>Learn</li>
                                <li>Discover</li>
                            </ul>
                            <div className="landing-slide__desc">
                                The latest environmental and waste management breakthroughs and
                                breakdowns. Does the future still look bright? We’ve got a lot of
                                answers on our social channels. Let&apos;s kick it!
                            </div>

                            <SocialNetList className="landing-slide__action" size="large" />
                        </header>
                        <div className="landing-slide__picture">
                            <SocialCollage />
                        </div>
                    </section>

                    {/* Why VABVA? Section */}

                    <section className="landing-slide landing-slide--offset-right main-page__landing-slide">
                        <div className="landing-slide__picture">
                            {/* <IssuesCollage /> */}
                            <Image
                                src="/images/why-vabva-collage.png"
                                alt="Why VABVA"
                                width={567}
                                height={420}
                                quality={85}
                            />
                        </div>

                        <header className="landing-slide__header">
                            <h6 className="main-page__subtitle">Why VABVA?</h6>
                            <h4 className="main-page__title">Solving Environmental issues</h4>
                            <ul className="landing-slide__features-list landing-slide__features-list--large">
                                <li>Better solutions</li>
                                <li>Faster rollouts of innovation</li>
                                <li>Clearer way to raise awareness</li>
                            </ul>
                            <div className="landing-slide__desc">
                                <p>
                                    But we can’t do anything, without each of us agreeing to change.
                                </p>
                                <p>Why not do it together?</p>
                                <p>Join us on Social Media.</p>
                            </div>

                            <Link href={config.urls.events()} passHref>
                                <Button
                                    link
                                    variant="secondary"
                                    size="lg"
                                    iconRight={<ArrowRight14Svg />}
                                    className="landing-slide__action"
                                >
                                    New Events
                                </Button>
                            </Link>
                        </header>
                    </section>
                </Container>

                {/* News */}

                <NewsSection />

                {/* Skip price search Section */}

                <section className="filled-section main-page__filled-section filled-section--secondary">
                    <Container>
                        <section className="landing-slide main-page__landing-slide">
                            <header className="landing-slide__header">
                                <h6 className="main-page__subtitle">Skip price search</h6>
                                <h4 className="main-page__title">Skip hire price search</h4>

                                <div className="landing-slide__desc">
                                    Make use our skip hire price database with over 400,000 quotes
                                    to find the cheapest prices in your location. Make more informed
                                    choices.
                                </div>

                                <Link href={config.urls.search()} passHref>
                                    <Button
                                        link
                                        variant="secondary"
                                        size="lg"
                                        iconRight={<ArrowRight14Svg />}
                                        className="landing-slide__action"
                                    >
                                        Search now
                                    </Button>
                                </Link>
                            </header>
                            <div className="landing-slide__picture">
                                <div className="gradient-border-box">
                                    <Image
                                        src="/images/search-screen-v2.png"
                                        alt="Skip price search Screenshot"
                                        width={600}
                                        height={294}
                                        quality={100}
                                        unoptimized
                                    />
                                </div>
                            </div>
                        </section>
                    </Container>
                </section>
            </main>
            <Footer className="main-page__footer" />
        </div>
    );
};

export { SiteMainPage };
