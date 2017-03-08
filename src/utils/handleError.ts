'use strict';

export default function handleError(err: any, displayMessage: string, reject: Function): void {
    console.error(err);
    reject(displayMessage);
}
