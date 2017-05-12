const { toString } = Object.prototype;

export default function isPlainObject(candidate: any): boolean {
    return toString.call(candidate) === '[object Object]';
}
