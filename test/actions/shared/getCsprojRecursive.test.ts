import * as expect from 'expect';
import * as path from 'path';
import { getCsprojRecursive } from '../../../src/actions/shared';

const mocksPath = path.join(__dirname, '..', '..', 'mocks');

// TODO: This test reads from disk, which kinda sucks. Could make `getCsprojRecursive` injectable to fix.
describe('getCsprojRecursive', function () {
    it('should return an array of 3 unique .csproj files', function (done) {
        getCsprojRecursive(mocksPath)
            .then((result: Array<string>) => {
                expect(new Set(result).size).toBe(3);
                done();
            });
    });
});
