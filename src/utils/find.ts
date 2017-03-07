'use strict';
export default function find<T>(list: Array<T>, predicate: (listItem: T) => boolean): T | void {
    if (!list || !list.length) {
        return;
    }

    const listLen = list.length;

    for (let i = 0; i < listLen; i++) {
        if (predicate(list[i])) {
            return list[i];
        }
    }
}
