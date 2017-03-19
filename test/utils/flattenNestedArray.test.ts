import * as expect from 'expect';
import { flattenNestedArray } from '../../src/utils';

export default function runFlattenNestedArrayTests() {
    describe('flattenNestedArray', function () {
        it('should handle already-flat arrays', function () {
            expect(flattenNestedArray(['a', 2, null, undefined, true])).toEqual(['a', 2, null, undefined, true]);
        });

        it('should handle empty arrays', function () {
            expect(flattenNestedArray([])).toEqual([]);
        });

        it('should handle nested arrays', function () {
            const shallow = [1, 'a', 3, ['b', 5], ['c'], 1, [0]];
            const deep = [1, ['a', [3, 'b', [5]], 'c'], [1], 0];
            const flattened = [1, 'a', 3, 'b', 5, 'c', 1, 0];

            expect(flattenNestedArray(shallow)).toEqual(flattened);
            expect(flattenNestedArray(deep)).toEqual(flattened);
        });
    });
}
