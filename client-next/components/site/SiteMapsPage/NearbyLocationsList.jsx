import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '../../ui/List';
import { Circle8Svg } from '../../../assets/svg';
import { useSiteMapsPage } from './SiteMapsPageContext';

const parsePathname = (url = '') => {
    if (url) {
        return String(url).replace(/^(?:.+)(\/maps)/, '$1');
    }

    return '';
};

const NearbyLocationsListInner = (props) => {
    const { cities = [], towns = [] } = props;
    const { isSSR } = useSiteMapsPage();

    const shouldDisplayCities = cities.length > 0;
    const shouldDisplayTowns = towns.length > 0;

    return (
        <List className="maps-page__nearby-location" autoHeight={false}>
            {shouldDisplayTowns &&
                towns.map((item, index) => {
                    const { name = '', url } = item;
                    const href = parsePathname(url);

                    return (
                        <React.Fragment key={`town-${index}`}>
                            {index === 0 && <ListSubheader sticky>Nearby towns</ListSubheader>}
                            <Link href={href} passHref prefetch={false} shallow={!isSSR}>
                                <ListItem link>
                                    <ListItemIcon>
                                        <Circle8Svg />
                                    </ListItemIcon>
                                    <ListItemText flex>{name}</ListItemText>
                                </ListItem>
                            </Link>
                        </React.Fragment>
                    );
                })}

            {shouldDisplayCities &&
                cities.map((item, index) => {
                    const { name = '', url = '' } = item;
                    const href = parsePathname(url);

                    return (
                        <React.Fragment key={`city-${index}`}>
                            {index === 0 && <ListSubheader sticky>Other locations</ListSubheader>}
                            <Link href={href} as={href} passHref prefetch={false} shallow={!isSSR}>
                                <ListItem link>
                                    <ListItemIcon>
                                        <Circle8Svg />
                                    </ListItemIcon>
                                    <ListItemText flex>{name}</ListItemText>
                                </ListItem>
                            </Link>
                        </React.Fragment>
                    );
                })}
        </List>
    );
};

NearbyLocationsListInner.propTypes = {
    cities: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string
        })
    ),
    towns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string
        })
    )
};

export const NearbyLocationsList = memo(NearbyLocationsListInner);
