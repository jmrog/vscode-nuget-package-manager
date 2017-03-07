'use strict';
const emptyString = '';

export default function getQueryString(qsDefinition: QueryStringDefinition): string {
    return Object.keys(qsDefinition).reduce((qs, nextKey, index) => {
        return index === 0 ? `${nextKey}=${qsDefinition[nextKey]}` :
            `${qs}&${nextKey}=${qsDefinition[nextKey]}`;
    }, emptyString);
}
