export function fetchUrl(params)
{
    let {url, body, headers, method } = params;
    let result = {};

    if(headers) result.headers = JSON.parse(headers)
    if(method) result.method = method;
    if(body) result.body = body;

    return fetch(url, result)
    .then(response => response.json())
}