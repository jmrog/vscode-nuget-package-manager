import * as expect from 'expect';
import { dedupeArray } from '../../src/utils';

export default function runDedupeArrayTests() {
    const numbersTest1 = [1, 1, 1, 1, 1, 1];
    const numbersTest2 = [1, 3, 2, 3, 4];
    const stringsTest1 = ['lol', 'lol', 'lol'];
    const stringsTest2 = ['lol', 'wut', 'hi'];
    const mixedTest = [1, 'lol', 2, 'lol', 2, 'wut'];
    const numbersTest1Len = numbersTest1.length;
    const stringsTest2Len = stringsTest2.length;
    const mixedTestLen = mixedTest.length;

    describe('dedupeArray', function() {
        it('should dedupe arrays using `toString` representations', function () {
            expect(dedupeArray(numbersTest1)).toEqual([1]);
            expect(dedupeArray(numbersTest2)).toEqual([1, 3, 2, 4]);
            expect(dedupeArray(stringsTest1)).toEqual(['lol']);
            expect(dedupeArray(stringsTest2)).toEqual(['lol', 'wut', 'hi']);
            expect(dedupeArray(mixedTest)).toEqual([1, 'lol', 2, 'wut']);
        });

        it('should not modify the original array', function () {
            expect(numbersTest1.length).toBe(numbersTest1Len);
            expect(stringsTest2.length).toBe(stringsTest2Len);
            expect(mixedTest.length).toBe(mixedTestLen);
        });
    });
}
