import React, { useContext } from 'react';

export const ListItemContext = React.createContext({});

export const useListItem = () => useContext(ListItemContext);
