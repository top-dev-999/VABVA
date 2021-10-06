import { createCtx } from '../../ui/utils';

export const SiteMapsPageContextValues = createCtx();
export const SiteMapsPageContextActions = createCtx();

export const useSiteMapsPage = SiteMapsPageContextValues.useContext;
export const useSiteMapsPageActions = SiteMapsPageContextActions.useContext;
