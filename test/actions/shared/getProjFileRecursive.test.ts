import * as expect from 'expect';
import * as path from 'path';
import { getProjFileRecursive } from '../../../src/actions/shared';

const mocksPath = path.join(__dirname, '..', '..', 'mocks');
const csprojMatcher = /\.csproj$/;
const fsprojMatcher = /\.fsproj$/;

// TODO: This test reads from disk, which kinda sucks. Could make `getProjFileRecursive` injectable to fix.
describe('getProjFileRecursive', function () {
    it('should return an array of 4 unique .csproj/.fsproj files', function (done) {
        getProjFileRecursive(mocksPath)
            .then((result: Array<string>) => {
                expect(new Set(result).size).toBe(4);
                expect(new Set(result.filter((filename) => csprojMatcher.test(filename))).size).toBe(3);
                expect(new Set(result.filter((filename) => fsprojMatcher.test(filename))).size).toBe(1);
                done();
            });
    });
});
