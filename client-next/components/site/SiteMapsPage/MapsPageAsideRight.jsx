import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CompaniesList } from './CompaniesList';

const MapsPageAsideRight = (props) => {
    const { open, companies, onCompanySelect, selectedCompanyId } = props;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (open) {
            setMounted(true);

            return () => {
                setMounted(false);
            };
        }
        return undefined;
    }, [open]);

    if (!open || companies.length === 0) {
        return null;
    }

    return (
        <aside className="maps-page__aside maps-page__aside--right">
            {mounted && (
                <CompaniesList
                    data={companies}
                    selectedId={selectedCompanyId}
                    onSelect={onCompanySelect}
                />
            )}
        </aside>
    );
};

MapsPageAsideRight.propTypes = {
    open: PropTypes.bool,
    companies: PropTypes.array,
    selectedCompanyId: PropTypes.string,
    onCompanySelect: PropTypes.func
};

export { MapsPageAsideRight };
