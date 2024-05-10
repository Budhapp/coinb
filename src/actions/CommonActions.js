import { addParamToUrl, removeParamsFromUrlExceptProjectId } from './../utils/common/urlActions';

export function navigateToPage(target, componentId) {
    return (dispatch, getState) => {
        const state = getState();

        const { composite_key } = state.project.definition.components[componentId];
        const navigation = state.local.pages[`page_${composite_key[0]}`].navigation;

        removeParamsFromUrlExceptProjectId();
        const updatedUrl = addParamToUrl('page', target);
        history.pushState({}, '', updatedUrl);

        navigation.navigate(target);
    };
}