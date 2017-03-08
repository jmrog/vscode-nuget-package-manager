'use strict';
import { emptyString } from '../constants';

export default function getQueryString(qsDefinition: QueryStringDefinition): string {
    return Object.keys(qsDefinition).reduce((qs: string, nextKey: string, index: number) => {
        return index === 0 ? `${nextKey}=${qsDefinition[nextKey]}` :
            `${qs}&${nextKey}=${qsDefinition[nextKey]}`;
    }, emptyString);
}
