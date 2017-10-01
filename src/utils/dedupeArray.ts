// NOTE: naively dedupes using `toString`, so be careful.
export default function dedupeArray<T>(array: Array<T>): Array<T> {
    const seenValuesMap = {};
    return array.filter((item) => (
        !seenValuesMap[item.toString()] && (seenValuesMap[item.toString()] = true)
    ));
}
