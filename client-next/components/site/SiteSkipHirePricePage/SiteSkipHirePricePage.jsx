import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { PageLayout } from '../../layouts';
import { PageHead } from '../../PageHead';
import { PriceTable } from '../../PriceTable';
import { PricePageBanner } from './PricePageBanner';
import { createUrlByValues } from '../../../services/api/maps';
import { config } from '../../../config';
import { PricePageNearbyList } from './PricePageNearbyList';
import { JsonStringify } from '../../../services/utils';
import { PricePageAddThis } from './PricePageAddThis';

const PricePageMap = dynamic(() => import('./PricePageMap').then((module) => module.PricePageMap), {
    ssr: false
});

const getAllSizes = (items = []) => {
    return items.reduce((result, item, index) => {
        const { name: priceName } = item || {};

        if (index === items.length - 2) {
            return `${result}${priceName}`;
        }

        if (index === items.length - 1) {
            return `${result}and ${priceName}`;
        }

        return `${result}${priceName}, `;
    }, '');
};

const getBecomeASupplierUrl = () => {
    return config.urls.blog('how-to-become-a-supplier');
};

const generateSchema = (items = [], displayName = '') => {
    const schemas = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: []
    };

    const mainEntity = items.map((item) => {
        const { id, priceMin } = item || {};

        return {
            '@type': 'Question',
            name: `How much is ${id === 8 ? `an ${id}` : `a ${id}`} yard skip in ${displayName}`,

            acceptedAnswer: {
                '@type': 'Answer',
                text: `The cheapest price for ${
                    item.yard === 8 ? `an ${id}` : `a ${id}`
                } yard skip in ${displayName} is £${priceMin}`
            }
        };
    });

    schemas.mainEntity = mainEntity;

    return JsonStringify(schemas);
};

const SiteSkipHirePricePage = (props) => {
    const { items, location = {}, nearby = [] } = props;
    const { displayName = '', postcode = '', name = '', county = '', coordinates = [] } = location;
    const router = useRouter();

    const canonical = `${config.basePath}${router.asPath}`;

    const allSizes = getAllSizes(items);

    const placeUrl = createUrlByValues({
        place: {
            county,
            coordinates
        },
        services: ['skip-hire'],
        distance: 10,
        reviews: 0
    });

    const title = `Skip Hire in ${displayName}, ${postcode} | Skip prices near me`;
    const description = `Here's a full list of ${allSizes} skip hire in ${name} ${postcode}, and a few more sizes and nearby places in ${county}`;
    const schema = generateSchema(items, displayName);

    return (
        <PageLayout>
            <PageHead title={title} description={description} canonical={canonical} schema={schema}>
                <script
                    type="text/javascript"
                    src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-609db557f0b4c950"
                    async
                />
            </PageHead>

            <div className="price-page">
                <h2 className="mb-0">Skip Hire in {displayName}</h2>

                <PriceTable items={items} className="price-page__price-table" />

                <PricePageAddThis key={canonical} url={canonical} title={title} widgetId="qeqj" />

                <h2>Hiring a skip in {displayName}: Everything you need to know</h2>

                <p className="paragraph">
                    Skip hire is the best and most popular way of disposing junk, debris and other
                    waste materials. It’s an affordable method that helps you get rid of all wastes
                    in one go, without hiring different waste disposal services for various wastes.
                    Besides, it’s applicable for all commercial and residential projects.
                </p>
                <p className="paragraph">
                    Skips are the best options for households and businesses that generate large
                    amounts of wastes. For instance, they’re highly used in construction sites,
                    farmyards, and businesses. Generally, they’re suitable for any waste generating
                    project. So, if you’re running a DIY project such as kitchen refitting, bathroom
                    remodeling, or garden cleanup, consider skip hire the best and most reliable,
                    convenient and affordable waste removal option. You can hire a skip to clear up
                    your construction site too.
                </p>
                <p className="paragraph">
                    There are numerous skip hire companies in {county} and surrounding areas,
                    working independently to meet your demands. To learn more about specific
                    companies’ skip hiring process, contact us via live chat.
                </p>

                <p className="paragraph">
                    When hiring a skip, the primary determinant of the right size is the amount of
                    waste you want to dispose of. Besides, you should also know what to put in a
                    skip and what you shouldn’t.
                </p>

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.maps(placeUrl)} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Nearby Skip Map
                        </a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3>Items not allowed in a skip</h3>
                <p className="paragraph text-bold">
                    Some waste items are considered hazardous, and most skip hire companies don’t
                    allow them in their skips. They include:
                </p>
                <ul className="list-styled list-styled--disc list-styled--columns-2">
                    <li>Paint</li>
                    <li>Chemicals</li>
                    <li>Batteries</li>
                    <li>Electronics such as TV, freezers, computers</li>
                    <li>Medical wastes</li>
                    <li>Gas cylinders</li>
                    <li>Tyres</li>
                    <li>Plasterboards</li>
                    <li>Asbestos</li>
                    <li>Every other item considered hazardous</li>
                </ul>
                <p className="paragraph">
                    Initially, plasterboards were allowed in skips until the UK law was amended
                    where they were deemed unfit for skips disposal. According to the law which was
                    amended in 2011, all plasterboards must not be mixed with other waste items. The
                    law followed the discovery of the hazardous gas that the material emits during
                    decomposition, and it can be toxic if it rots in a mixed setting. To dispose of
                    your plasterboard material, get a special bag from your local skip hire company.
                </p>

                <hr className="divider" />

                <h3>Uses of skips</h3>
                <p className="paragraph">
                    {name} residents hire skips for various reasons. For instance, some like the
                    skips’ affordability while others are attracted by their efficiency in waste
                    disposal tasks. Besides, they’re available in different sizes, and anyone can
                    hire the one that best suits their waste disposal needs.
                </p>
                <p className="paragraph">The following are some of the common uses of skips:</p>
                <ul className="list-styled list-styled--disc">
                    <li>Domestic uses</li>
                    <li>Driveway / Pave way installation</li>
                    <li>Clearance of unwanted waste</li>
                    <li>Garden cleanup</li>
                </ul>

                <ul className="card-list card-list--columns-2">
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Domestic uses
                                </h4>
                            </header>
                            <div className="card-list__body">
                                Are you renovating your house? Skip hire must be the best waste
                                disposal option for the task. Regardless of the size of the project,
                                the large amount of waste you’ll accumulate will fit in a skip, and
                                be disposed of safely without spilling. Evaluate the size of the
                                project to determine the amount of waste you’ll generate, and then
                                hire the right skip size.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Driveway / Pave way installation
                                </h4>
                            </header>
                            <div className="card-list__body">
                                Driveway installation is the most common use of skip hires. When
                                installing the new driveway, you’ll have to remove the old one,
                                generating waste in the process. You can load the waste material
                                into a skip and dump it in the designated waste disposal site.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Clearance of unwanted waste
                                </h4>
                            </header>
                            <div className="card-list__body">
                                When tenants move from a building, they leave a lot of unwanted
                                wastes such as fittings and old furniture. Hiring a skip can
                                significantly help you make the building neat, and you can use it to
                                dispose of the trash in the local garbage disposal site.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Garden cleanup
                                </h4>
                            </header>
                            <div className="card-list__body">
                                Garden cleaning is a tedious work that generates a lot of organic
                                waste such as soil, leaves and other compostable materials. If you
                                hire a skip, you can comfortably clean your garden and dispose of
                                all the garbage at a go. If you own a garden in {name}, you can
                                choose a small, medium or large skip depending on the size of your
                                clean up job.
                            </div>
                        </div>
                    </li>
                </ul>

                <h3>Nearby places in {name} for local price comparison</h3>
                <p className="paragraph">
                    You may already know that skip size influences the total cost you would have to
                    pay. Though other factors such as location, waste type, duration and whether
                    you&apos;ll need a skip hire permit or not, should also be taken into
                    consideration.
                </p>
                <PricePageMap name={name} postcode={postcode} coordinates={coordinates} />
                <PricePageNearbyList items={nearby} />

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.search()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">Price search</a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3>A step-by-step guide on hiring a skip in {name}</h3>
                <p className="paragraph">
                    When hiring a skip, there are various factors you need to consider. They
                    include:
                </p>
                <ul className="list-styled list-styled--num list-styled--columns-2">
                    <li>Skip size</li>
                    <li>Skip price</li>
                    <li>Permit council costs</li>
                    <li>Hidden charges</li>
                    <li>Taxes</li>
                    <li>Skip Hire period</li>
                    <li>Skip weight</li>
                </ul>

                <hr className="divider" />

                <h3 className="title">
                    <span className="title__num">1.</span>Skip size
                </h3>
                <p className="paragraph">
                    The first step in the skip hiring process is choosing the right skip size for
                    your waste disposal job. Skips come in various sizes, lengths, shapes and
                    requirements. Hiring a large skip for a small amount of waste increases your
                    cost while choosing the one that’s too small for your waste will make you either
                    leave some junk at your property or hire an extra skip to remove all the
                    garbage.
                </p>
                <ul className="list-styled list-styled--disc list-styled--columns-2">
                    <li>Mini skip</li>
                    <li>Builders skip</li>
                    <li>Roll of skip</li>
                    <li>Midi skip</li>
                    <li>Maxi skip</li>
                    <li>Secure skip</li>
                </ul>

                <ul className="card-list card-list--columns-2">
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">Mini skip</h4>
                            </header>
                            <div className="card-list__body">
                                <p className="paragraph">
                                    Minis skips are the smallest skips, usually, measure 2-3 yards.
                                    They’re best suitable for housing and gardening projects that
                                    generate small amounts of wastes.
                                </p>
                                <p className="paragraph text-bold">
                                    The following are some of the benefits of mini skips:
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Cheap:</span> Mini skips are
                                    excellent waste removal options for small domestic tasks like
                                    garden clean ups and bathroom or kitchen remodeling. Instead of
                                    loading wastes in your car, save the cost by hiring a mini skip
                                    that will help you dispose of the trash efficiently and
                                    cost-effectively.
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Convenience:</span> Most cities in
                                    the UK have many residential areas with limited spaces for large
                                    skips placement. Therefore, the best waste disposal option for
                                    these areas is the use of mini skips. Their small size allows
                                    them to pick the waste efficiently.
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Availability:</span> Mini skips
                                    are common across {county}. Most residents use them for small
                                    domestic jobs.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Builders skip
                                </h4>
                            </header>
                            <div className="card-list__body">
                                <p className="paragraph">
                                    Builders skip are also popular throughout {county}. They usually
                                    come in 6 cubic yards size. They’re great options for disposing
                                    of concrete items, rubble and soil in commercial projects.
                                    They’re also commonly used for the disposal of general domestic
                                    waste. The skip’s size allows it to carry about seventy bags of
                                    waste material.
                                </p>
                                <p className="paragraph text-bold">
                                    The following are some of the reasons why Builders skips are
                                    popular:
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">They’re convenient:</span> They’re
                                    excellent for large commercial projects that produce a large
                                    amount of rubble waste materials.
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Cost-effective:</span> They save
                                    you the cost of hiring trucks to and from garbage disposal
                                    sites. They also save on fuel costs.
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">They’re widely available:</span>{' '}
                                    You can find a Builder skip in any city. Many residents hire
                                    skips for homes and major office renovations.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">
                                    Roll-on / Roll-off (RoRo) skips
                                </h4>
                            </header>
                            <div className="card-list__body">
                                <p className="paragraph">
                                    They’re sized around 20-40 yards and typically used for large
                                    commercial projects. Their large size makes them unsuitable for
                                    small domestic projects. Besides, this skip can only fit on a
                                    large physical space.
                                </p>
                                <p className="paragraph text-bold">
                                    Here are some of its benefits:
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Convenient:</span> They’re fitted
                                    with doors to facilitate rolling on and off. Due to their size,
                                    they’re ideal for massive projects large amount of wastes for
                                    disposal.
                                </p>
                                <p className="paragraph">
                                    <span className="text-accent">Popularity:</span> Roll-on /
                                    Roll-off skips are common in UK cities, especially in
                                    construction sites where large amounts of rubble and building
                                    wastes are disposed of.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card mb-12">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">Midi skip</h4>
                            </header>
                            <div className="card-list__body">
                                These skips are commonly used for bathrooms and kitchen fittings.
                                They are four cubic yards sized. Besides, most people use them to
                                dispose of landscaping and domestic waste materials. Generally, Midi
                                skip can hold 45 bags of garbage.
                            </div>
                        </div>

                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">Maxi skip</h4>
                            </header>
                            <div className="card-list__body">
                                Maxi skips are more extensive than builders skips, sized 12 cubic
                                yards. Their large size demands large physical spaces, making them
                                unfit for domestic uses. They have large capacity too, making them
                                fit for sizeable bulky waste materials, especially from commercial
                                and construction sites.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <header className="card-list__header">
                                <h4 className="card-list__title price-page__title">Secure skips</h4>
                            </header>
                            <div className="card-list__body">
                                These skips are lockable, thus offer extra protection. They help to
                                ensure that no excess waste goes into the skip. They’re common
                                across the UK, and they come in different sizes and configurations.
                            </div>
                        </div>
                    </li>
                </ul>

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.maps(placeUrl)} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Nearby Skip Map
                        </a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3 className="title">
                    <span className="title__num">2.</span>Skip price
                </h3>
                <p className="paragraph text-bold">
                    Your budget will significantly determine the type and size of the skip you hire.
                    Two factors determine the price of a skip. They include:
                </p>
                <ul className="card-list card-list--columns-2">
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">Size:</span> Generally, small sized
                                skips like the Mini skip are cheaper than bigger skips. This is
                                essentially due to variations in capacities. Most skip hire
                                companies in {county} provide customers with alternatives to reduce
                                the skip hire costs. Such options include landfilling and recycling
                                waste item.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">Location:</span> Skip hire prices vary
                                based on regions. For instance, London residents pay higher prices
                                than people living in Northern Ireland and Scotland.
                            </div>
                        </div>
                    </li>
                </ul>

                <h3 className="title">
                    <span className="title__num">3.</span>Permit council costs
                </h3>
                <p className="paragraph">
                    The law requires people placing skips on public roads to obtain a permit.
                    They’ve to pay for this permit, and the permit cost varies based on locations.
                    However, if you’re hiring a skip to place on your property, you’re not required
                    to obtain the council permit. Mostly, skip hire companies obtain the permits and
                    add the costs to the customers’ final charges.
                </p>

                <hr className="divider" />

                <h3 className="title">
                    <span className="title__num">4.</span>Hidden charges
                </h3>
                <p className="paragraph">
                    When hiring a skip, you don’t incur hidden charges. However, you may incur
                    additional costs if you’re fined for putting prohibited items in the skip. So,
                    be aware of what is forbidden by the law to avoid unnecessary charges.
                </p>

                <hr className="divider" />

                <h3 className="title">
                    <span className="title__num">5.</span>Taxes
                </h3>
                <p className="paragraph">
                    Some skip hire companies don’t include the VAT (value-added tax) when quoting
                    prices. Therefore, it’s essential to ask the skip hire provider if their quote
                    consists of the VAT tax. Always evaluate the final skip hire prices before
                    settling on a skip hire service.
                </p>

                <hr className="divider" />

                <h3 className="title">
                    <span className="title__num">6.</span>Skip hire period
                </h3>
                <p className="paragraph">
                    The skip hire period is an essential factor to consider when hiring a skip. An
                    extended period attracts high costs in terms of council permit costs. Generally,
                    skip hiring costs increases with the length of the hire period.
                </p>
                <p className="paragraph">
                    In most cases, skip hire services in {county} are willing to enter into cheaper
                    and more flexible contracts and agreements for customers hiring skips for
                    unspecified periods.
                </p>

                <hr className="divider" />

                <h3 className="title">
                    <span className="title__num">7.</span>Skip weight
                </h3>
                <p className="paragraph">
                    Skip weight varies based on hire providers and their weighing rules and
                    regulations. Generally, each cubic yard is equated with one tonne. So, an 8-skip
                    will weigh 8 tonnes.
                </p>
                <p className="paragraph">
                    Heavy skips weighing from 2-8 tonnes can carry heavy waste materials like
                    rubbles and metals. However, it’s crucial to balance the weight by combing both
                    heavy and lightweight materials.
                </p>

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.search()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">Price search</a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3>How to reduce the cost of a skip hire</h3>
                <p className="paragraph">
                    The following are excellent ways of reducing the cost of a skip hire:
                </p>
                <ul className="card-list card-list--columns-2">
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">Compare different quotes:</span> Skip
                                hire charges vary based on companies. Therefore, it’s essential to
                                research the market before deciding on a service. Get quotes from
                                different firms in your region, compare them and choose the right
                                price (maybe the lowest). Also, inquire if the quotes include permit
                                costs and taxes.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">
                                    Sell, donate or recycle some of the waste items:
                                </span>{' '}
                                Donating some of your unwanted wastes can reduce the skip hire costs
                                by a significant margin. Still, you can sell or recycle the items,
                                especially the recyclable plastics. This will reduce the amount of
                                waste materials that you need to dispose of. Consult your local
                                council to get the available donating and recycling options.
                                Likewise, you can search on the internet “recycling options for
                                waste materials,” or “how to donate unwanted items.”
                            </div>
                        </div>
                    </li>
                </ul>

                <p className="paragraph">
                    Therefore, instead of dumping your bathroom fittings, old furniture, bed set and
                    other household items, you can opt to sell, donate or recycle them to reduce the
                    skip hire costs.
                </p>
                <p className="paragraph text-bold">
                    Recycling wastes has many benefits. They include:
                </p>
                <p className="paragraph">
                    <span className="text-accent">Saving energy:</span> Recycling industry related
                    material can help us save a lot of energy. Consequently, industries will save a
                    lot of money that they could have spent extracting and refining new energy
                    resources.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Environmental protection:</span> Recycling some
                    wastes can be a critical step towards saving the environment from pollution.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Reuse helps us conserve resources:</span> Reusable
                    materials can be recycled and transformed into newer products. This can save
                    manufacturers from spending money on extracting resources and damaging the
                    natural eco-system.
                </p>
                <p className="paragraph text-bold">
                    However, many people find it hard to recycle wastes despite the many benefits
                    that come with waste recycling. Some of these reasons include:
                </p>
                <p className="paragraph">
                    <span className="text-accent">Lack of recycling bins or bags:</span> While
                    people may want to enjoy the benefits of recycling waste, the whole process
                    causes a lot of inconveniences. Many people aren’t equipped with recycling bags
                    or bins; thus, they find the process tedious.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Inability to pre-plan:</span> Most people avoid
                    segregating the recyclable and non-recyclable wastes. Instead, they choose to
                    dispose of the entire luggage together. Planning and labelling items can help
                    determine the right ones for recycling.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Ignorance:</span> The modern society holds the
                    misconception that recycling waste is an unimportant and outdated practice.
                    Besides, people ignore the terrible impacts of global warming. If we can all
                    change our attitude and spread the awareness of improper disposal of waste
                    items, more people can start recycling various waste items such as plastics.
                    Recycling is an easy process, and it isn’t complicated as most people tend to
                    believe. We only need the right mindset. Apart from saving the environment, it
                    can significantly reduce your skip hire costs.
                </p>

                <ul className="card-list card-list--columns-2">
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">Book the skip in advance:</span> Most
                                people book their skip hire services at the eleventh hour, which
                                costs a lot of money. Booking yours in advance can significantly
                                lower the costs because there is always an open opportunity for
                                discounts. Besides, place all your waste items at one point to
                                fasten the removal process. By doing so, you’ll reduce the skip hire
                                period, hence reduce the cost.
                            </div>
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card">
                            <div className="card-list__body">
                                <span className="text-accent">Avoid council permits:</span>{' '}
                                Obtaining a council permit is crucial while placing a skip on a
                                public road or property. However, you can avoid the permit costs by
                                keeping it on your driveway. So, opt to keep the skip on your
                                private property such as driveway, backyard or lawn area. This will
                                eliminate the council permit costs.
                            </div>
                        </div>
                    </li>
                </ul>

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.maps(placeUrl)} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Nearby Skip Map
                        </a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3>Recycling services by {county} skip hire companies</h3>
                <p className="paragraph text-bold">
                    Most skip hire companies commit themselves to recycle nearly 80-90 per cent of
                    the recyclable waste. This is a unique practice that promotes environmentally
                    friendly waste disposal. After sorting and mounting the waste material, they
                    categorize it into recyclable and non-recyclable waste. The recyclable waste is
                    taken to recycling centers while the non-recyclable items are sent to landfills.
                </p>
                <p className="paragraph text-bold">
                    There following are some of the items commonly collected and recycled by skip
                    hires:
                </p>
                <ul className="list-styled list-styled--disc list-styled--columns-2">
                    <li>Wood</li>
                    <li>Metal</li>
                    <li>Plastic</li>
                    <li>Furniture</li>
                    <li>Soil</li>
                    <li>Organic waste</li>
                </ul>

                {/* <PricePagePlayer url="https://youtu.be/EWxjFLDoIDA" /> */}

                <h3>How long can you hire a skip?</h3>
                <p className="paragraph text-bold">
                    The skip hire period varies based on the size of the waste disposal task. Some
                    tasks are easy, thus completed quickly, while others may take two weeks. Mostly,
                    skip hire period ranges between 1 to 14 days. Companies will collect their skip
                    once you complete the project, usually within a day or two. However, it’s
                    important to note that skip hire period influences the costs too.
                </p>

                <hr className="divider" />

                <h3>Skip hires safety measures</h3>
                <p className="paragraph">
                    Once you hire a skip, you bear the burden of ensuring public protection. While
                    the skip hire service providers bear the public safety responsibilities, the
                    more significant part is carried out by the customer.
                </p>
                <p className="paragraph text-bold">
                    So, consider the following safety measures to ensure public safety as you load
                    your waste into the skip:
                </p>
                <p className="paragraph">
                    <span className="text-accent">
                        Ensure that the skip content doesn’t bulge out of the skip:
                    </span>{' '}
                    This will prevent pedestrians’ injuries, especially when you place the skip in a
                    public area. If you overload the skip, the content might overflow, harming the
                    people near the site being cleared.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Load the items carefully:</span> Start with the
                    heavy objects first, followed by the lighter ones. Place the lightest on the
                    top. This will stabilize the skip, making it firm during movements.
                </p>
                <p className="paragraph">
                    <span className="text-accent">
                        Don’t put any explosive or poisonous waste item in the skip:
                    </span>{' '}
                    To avoid penalties and fines, dispose of such items separately.
                </p>
                <p className="paragraph">
                    <span className="text-accent">
                        Ensure that no waste protrudes out of the skip:
                    </span>{' '}
                    You’re responsible for the pedestrians’ safety, especially if you’re placing the
                    skip on public property. Therefore, ensure that the skip contains all the
                    content, with none protruding out. Also, surround the skip with amber lights to
                    make it visible, especially at night.
                </p>
                <p className="paragraph">
                    <span className="text-accent">
                        Don’t place the skip in a manner that will block the way:
                    </span>{' '}
                    Generally, you shouldn’t put it near gates, on manholes, right outside driveways
                    or any other place that might block the way.
                </p>

                <PricePageBanner title="Same day skip delivery. It’s really fast!">
                    <Link href={config.urls.search()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">Price search</a>
                    </Link>
                    <Link href={getBecomeASupplierUrl()} prefetch={false}>
                        <a className="btn btn-link btn-light btn-lg banner__link">
                            Become A Supplier
                        </a>
                    </Link>
                </PricePageBanner>

                <h3>How to take full advantage of your skip hire</h3>
                <p className="paragraph text-bold">
                    Once you get the best quote and choose your skip hire service provider, your
                    time starts to count. Get started as soon as possible. In most cases, people
                    fail to utilize the skip spaces well, thus paying high costs and still leaving a
                    lot of scattered waste on their property.
                </p>
                <p className="paragraph text-bold">
                    If you want to take full advantage of your skip hire, discard the waste into the
                    skip, placing them efficiently so that it can wholly get contained. Improper
                    placement of waste will see you losing a lot of space, yet you’re paying for it.
                </p>
                <p className="paragraph text-bold">
                    When waste is thrown into a skip, it becomes hard to arrange it. Do the
                    following things to ensure an efficient, smooth and cheap waste disposal
                    process:
                </p>
                <p className="paragraph">
                    <span className="text-accent">Break down the large items:</span> If your items
                    are too heavy or large, consider breaking them into pieces. For example, boxes
                    and furniture are oddly shaped, and they can consume a lot of space which might
                    make you leave some of the waste on your yard. Break them into pieces to create
                    a space for other items.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Start with heavy items:</span> It’s advisable to
                    put the heavy items first, especially the flat ones. This helps create a space
                    for other items on the top.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Place the skip on your driveway:</span> While this
                    helps you avoid permit costs, it’s also helpful in case you forget to put some
                    wastes into the skip. It will allow you to put anything you might have
                    overlooked earlier before the skip hire company removes the skip from your
                    property.
                </p>
                <p className="paragraph text-bold">
                    By considering these things, you’ll be creating a way to enjoy the full
                    advantage of your skip hire.
                </p>

                <hr className="divider" />

                <h3>Mistakes to avoid when hiring skips</h3>
                <p className="paragraph text-bold">
                    Regardless of whether you’re hiring a skip for a domestic or commercial project,
                    you must learn the types of waste allowed in it. Many people in {name} hire
                    skips and put any waste materials in them. To make the whole process smooth and
                    enjoyable, avoid the following mistakes.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Overfilling the skip:</span> This is the most
                    common mistake people in {name} do. They overload the skip such that wastes
                    spill, some scattering on the property while others drop off on the way to
                    disposal sites. Only load what the skip can carry to avoid fines from your skip
                    hire company.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Focusing on costs:</span> Choose the skip that
                    best meets your requirements rather than the cheapest. Opt for a skip that’s
                    large enough to carry all your waste. If you choose a small skip simply because
                    it’s cheap, you might spend money on two skips, making the whole process more
                    expensive. Also, pack the material carefully and efficiently to utilize all the
                    skip spaces.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Placing the skip in the wrong place:</span>{' '}
                    Generally, it’s advisable to place the skip on your property rather than on a
                    public area. Public spaces are generally congested with traffic jams and
                    pedestrians, and the skip may block the way.
                </p>
                <p className="paragraph">
                    <span className="text-accent">
                        Placing the skip on a public space without a permit:
                    </span>{' '}
                    This is an offence punishable by law. If you wish to place your skip on a
                    specific public area, obtain a skip permit with the help of your skip hire
                    service provider.
                </p>
                <p className="paragraph">
                    <span className="text-accent">Putting prohibited items in the skip:</span> Avoid
                    putting deadly or hazardous things in the skip. If your skip hire provider finds
                    a prohibited item in your skip, they can charge you extra money to dispose of it
                    as separate waste material. Check with your local council to see the things that
                    aren’t allowed in skips. If you violate the law, you can be forced to pay a
                    hefty fine, so try to abide.
                </p>

                <ul className="card-list card-list--images-3">
                    <li className="card-list__item">
                        <div className="card-list__card-image">
                            <Image
                                src="/images/overfilled-skip.jpg"
                                alt="An overfilled Skip"
                                width={400}
                                height={266}
                                quality={85}
                            />
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card-image">
                            <Image
                                src="/images/dangerous-items.png"
                                alt="Skip containing dangerous items"
                                width={400}
                                height={266}
                                quality={85}
                            />
                        </div>
                    </li>
                    <li className="card-list__item">
                        <div className="card-list__card-image">
                            <Image
                                src="/images/overfilledskip.jpg"
                                alt="Skip with too much items"
                                width={400}
                                height={266}
                                quality={85}
                            />
                        </div>
                    </li>
                </ul>

                <h3>Why choose a skip?</h3>
                <p className="paragraph text-bold">
                    While there are many waste removal options available in {name}, skip hire
                    remains the best and most sought solution nationally. This is primarily due to
                    the smooth skip hire process. Upon completion of the project, you can call your
                    skip hire provider to pick the skip.
                </p>
                <p className="paragraph text-bold">
                    As stated earlier, skips come in different sizes, measurements and
                    configurations. Thus, you’ve got the opportunity to choose the skip that best
                    fits your project’s needs. Besides, being able to choose the right skip size
                    allows you to pay the amount that best matches the size of your job. So,
                    regardless of the type of waste you want to discard, ensure that you pick the
                    right size to make your job run efficiently.
                </p>
                <p className="paragraph text-bold">
                    {name} skip hire companies are very punctual on skip delivery and pickup. This
                    adds to the skip hire convenience over other waste disposal options. If you’re
                    looking for an efficient and reliable waste disposal solution, skip hire might
                    serve the purpose.
                </p>

                <hr className="divider" />

                <h3>Final Note</h3>
                <p className="paragraph text-bold">
                    The nature of your job doesn’t matter. What matters most is the need to save
                    your precious time and money. If you don’t remove your waste from your property,
                    it might make it inhabitable. If you choose the wrong disposal method, you’ll be
                    risking the environmental pollution and a threat to your health and your loved
                    ones. Skip hire beats all these problems.
                </p>
            </div>
        </PageLayout>
    );
};

SiteSkipHirePricePage.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string
        })
    ),
    location: PropTypes.shape({
        displayName: PropTypes.string,
        name: PropTypes.string,
        county: PropTypes.string,
        postcode: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number)
    }),
    nearby: PropTypes.array
};

export { SiteSkipHirePricePage };
