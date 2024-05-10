export function GetProperty(state, params, node)
{
    return state.local.components[params[0]]?.data[node.parameters.target];
}

export function GetAttribute(state, params, node)
{
    return state.local.components[params[0]]?.properties[node.parameters.target];
}

export function GetLastItem(state, params, node)
{
    if (Array.isArray(params[0]) && params[0].length > 0) {
        return params[0][params[0].length - 1];
    }
    return undefined;
}

export function Contains(state, params, node)
{
    if (Array.isArray(params[0]) && params[0].length > 0) {
        return params[0].includes(node.parameters.value);
    }
    return undefined;
}

export function Comparison(state, params, node)
{
    const [left, right] = params;
        switch (node.parameters.comparator) {
            case '=':
                return left === right;
            case '!=':
                return left !== right;
            case '>':
                return left > right;
            case '<':
                return left < right;
            case '>=':
                return left >= right;
            case '<=':
                return left <= right;
            default:
                console.warn('Unhandled comparator', node.parameters.comparator)
                return false;
        }
}

export function Combination(state, params, node)
{
    const [left, right] = params;
        switch (node.parameters.combinator) {
            case 'OR':
                return left || right;
            case 'AND':
                return left && right;
            default:
                console.warn('Unhandled combinator', node.parameters.comparator)
                return false;
        }
}

export function UnderDevelopment(state, params, node)
{
    return state.local.components[params[0]]?.properties[node.parameters.name];
}