import * as expect from 'expect';
import { truncateCsprojPath } from '../../../src/actions/shared';

export default function runTruncateCsprojPathTests() {
    describe('truncateCsprojPath', function () {
        it('should substitute [root] for workspace root path', function () {
            const rootPath = '/some/very/long/path';
            expect(truncateCsprojPath('/some/very/long/path/here/whatever.csproj', rootPath)).toBe('{root}/here/whatever.csproj');
        });

        it('should throw if no workspace root is passed', function () {
            expect(() => truncateCsprojPath('/some/path', undefined)).toThrow();
        });
    });
}
