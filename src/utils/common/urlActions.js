export function addParamToUrl(key, value) {
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    urlObj.searchParams.set(key, value);
    return urlObj.toString();
}

export function getParamsFromUrl() {
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);
    const params = {};
    urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

export function removeParamsFromUrlExceptProjectId() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    
    const projectId = url.searchParams.get('projectId');
    url.search = '';

    if(projectId) {
        url.searchParams.set('projectId', projectId);
    }
    
    window.history.replaceState({}, '', url.toString());
}