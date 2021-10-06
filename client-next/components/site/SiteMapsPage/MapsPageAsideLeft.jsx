import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

import { useControlled } from '../../ui/utils';
import { CircularProgress, IconButton } from '../../ui';
import { Cross14Svg, Menu18Svg } from '../../../assets/svg';
import { MapsPagePanel } from './MapsPagePanel';
import { NearbyLocationsList } from './NearbyLocationsList';
import { CompaniesList } from './CompaniesList';
import { useSiteMapsPage } from './SiteMapsPageContext';

const CompaniesSearchForm = dynamic(
    () => import('./CompaniesSearch').then((module) => module.CompaniesSearchForm),
    {
        ssr: false
    }
);

const ACTIVE_PANELS_FLOW_MOBILE_DEFAULT = ['search', 'companies', 'nearby'];
const ACTIVE_PANELS_FLOW_DESKTOP_DEFAULT = ['search', 'nearby'];

const MapsPageAsideLeftInner = React.forwardRef(function MapsPageAsideLeftInner(
    props,
    forwardedRef
) {
    const {
        open: openProp,
        loading,
        nearby,
        companies,
        selectedCompanyId,
        onCompanySelect,
        activePanel: activePanelProp,
        onToggle
    } = props;

    const { isTablet } = useSiteMapsPage();
    const [open, setOpen] = useControlled(openProp, true);
    const [activePanel, setActivePanel] = useControlled(activePanelProp, null);
    const [currentFlow, setCurrentFlow] = useState(() => {
        return isTablet ? ACTIVE_PANELS_FLOW_MOBILE_DEFAULT : ACTIVE_PANELS_FLOW_DESKTOP_DEFAULT;
    });

    const initActivePanel = useCallback(() => {
        setActivePanel(currentFlow[currentFlow.length - 1]);
    }, [currentFlow, setActivePanel]);

    const handleBack = useCallback(() => {
        const currentPanelIndex = currentFlow.indexOf(activePanel);
        const nextPanel = currentFlow[currentPanelIndex - 1];

        if (nextPanel) {
            setActivePanel(nextPanel);
        }
    }, [currentFlow, activePanel, setActivePanel]);

    const handleToggleOpen = useCallback(() => {
        if (loading) {
            return;
        }

        if (onToggle) {
            onToggle();
        }

        setOpen((prevState) => !prevState);
    }, [setOpen, loading, onToggle]);

    // Default initialization
    useEffect(() => {
        if (open && !activePanel) {
            initActivePanel();
        }
    }, [initActivePanel, open, activePanel]);

    // When screen size change
    useEffect(() => {
        if (isTablet) {
            return () => {
                setCurrentFlow(['search']);
                setActivePanel('search');
            };
        }

        return undefined;
    }, [isTablet, setActivePanel]);

    // Render

    const renderNearbyLoacationPanel = useMemo(() => {
        const labelText =
            currentFlow.indexOf('companies') !== -1 ? 'Back to Companies' : 'Back to Search';

        return (
            <MapsPagePanel title={labelText} onClose={handleBack}>
                <NearbyLocationsList towns={nearby?.towns} cities={nearby?.cities} />
            </MapsPagePanel>
        );
    }, [currentFlow, nearby, handleBack]);

    const renderCompaniesListPanel = useMemo(() => {
        if (!isTablet) {
            return null;
        }
        return (
            <MapsPagePanel
                title="Back to Search"
                className="maps-page__companies-aside-panel"
                onClose={handleBack}
            >
                <CompaniesList
                    data={companies}
                    selectedId={selectedCompanyId}
                    onSelect={onCompanySelect}
                    rowHeight={160}
                />
            </MapsPagePanel>
        );
    }, [isTablet, companies, selectedCompanyId, onCompanySelect, handleBack]);

    const renderSearchForm = useMemo(() => {
        const handleNearbyClick = () => {
            setCurrentFlow(['search', 'nearby']);
            setActivePanel('nearby');
        };

        const handleSubmitForm = () => {
            if (isTablet) {
                setCurrentFlow(['search', 'companies']);
                setActivePanel('companies');
            }
        };

        return (
            <MapsPagePanel className="maps-page__search">
                <CompaniesSearchForm
                    onNearbyClick={handleNearbyClick}
                    onSubmit={handleSubmitForm}
                />
            </MapsPagePanel>
        );
    }, [setActivePanel, isTablet]);

    const getActivePanel = () => {
        switch (activePanel) {
            case 'nearby':
                return renderNearbyLoacationPanel;
            case 'companies':
                return renderCompaniesListPanel;
            case 'search':
                return renderSearchForm;
            default:
                return null;
        }
    };

    let menuBtnContent = <Menu18Svg />;

    if (loading) {
        menuBtnContent = <CircularProgress size="small" />;
    } else if (open) {
        menuBtnContent = <Cross14Svg />;
    }

    return (
        <React.Fragment>
            <div
                className={classNames('maps-page__menu-btn', {
                    'maps-page__menu-btn--collapsed': !open || loading
                })}
            >
                <IconButton onClick={handleToggleOpen}>{menuBtnContent}</IconButton>
            </div>
            <aside
                className={classNames('maps-page__aside', {
                    'maps-page__aside--hidden': !open
                })}
                ref={forwardedRef}
            >
                {getActivePanel()}
            </aside>
        </React.Fragment>
    );
});

MapsPageAsideLeftInner.propTypes = {
    open: PropTypes.bool,
    loading: PropTypes.bool,
    nearby: PropTypes.shape({
        cities: PropTypes.array,
        towns: PropTypes.array
    }),
    companies: PropTypes.array,
    selectedCompanyId: PropTypes.string,
    activePanel: PropTypes.oneOf(['nearby', undefined]),
    onCompanySelect: PropTypes.func,
    onToggle: PropTypes.func
};

export const MapsPageAsideLeft = memo(MapsPageAsideLeftInner);
