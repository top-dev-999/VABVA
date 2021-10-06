import React, { memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { MapMarkerSvg } from '../../../../assets/svg';
import { Popover } from '../../../ui/Popover';
import { CompaniesMapBalloon } from './CompaniesMapBalloon';
import { CompanyPopoverContent } from '../CompanyPopoverContent';

const CompaniesMapBalloonButtonInner = (props) => {
    const { data = {}, selected, onSelect } = props;
    const { id, colours: coloursProp = [] } = data;
    const containerRef = useRef(null);

    const handleClick = (ev) => {
        if (onSelect) {
            onSelect(ev, data);
        }
    };

    const handleClosePopover = useCallback(
        (ev) => {
            if (onSelect) {
                onSelect(ev, null);
            }
        },
        [onSelect]
    );

    const colors = coloursProp.map((color) => {
        return color?.colour;
    });

    return (
        <div ref={containerRef}>
            <OverlayTrigger
                show={selected}
                placement="top"
                trigger="click"
                popperConfig={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 40]
                            }
                        }
                    ]
                }}
                container={containerRef}
                overlay={
                    <Popover>
                        <CompanyPopoverContent data={data} onClose={handleClosePopover} />
                    </Popover>
                }
            >
                <button type="button" className="map__balloon-btn" onClick={handleClick}>
                    <CompaniesMapBalloon
                        selected={selected}
                        color1={colors[0]}
                        color2={colors[1]}
                    />
                </button>
            </OverlayTrigger>
        </div>
    );
};

CompaniesMapBalloonButtonInner.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        colours: PropTypes.arrayOf(
            PropTypes.shape({
                colour: PropTypes.string
            })
        )
    }),
    selected: PropTypes.bool,
    onSelect: PropTypes.func
};

export const CompaniesMapBalloonButton = memo(CompaniesMapBalloonButtonInner);
