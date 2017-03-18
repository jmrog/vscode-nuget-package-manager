'use strict';

const toString = Object.prototype.toString;

export default function isPlainObject(candidate: any): boolean {
    return toString.call(candidate) === '[object Object]';
}
