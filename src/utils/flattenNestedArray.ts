// NOTE: Does not handle (or check for) circular structures.
export default function flattenNestedArray(array) {
    return array.reduce((flattened, item) => flattened.concat(Array.isArray(item) ? flattenNestedArray(item) : item), []);
}
