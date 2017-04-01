import * as expect from 'expect';
import { truncateProjFilePath } from '../../../src/actions/shared';

export default function runTruncateProjFilePathTests() {
    describe('truncateProjFilePath', function () {
        it('should substitute [root] for workspace root path', function () {
            const rootPath = '/some/very/long/path';
            expect(truncateProjFilePath('/some/very/long/path/here/whatever.csproj', rootPath)).toBe('{root}/here/whatever.csproj');
        });

        it('should throw if no workspace root is passed', function () {
            expect(() => truncateProjFilePath('/some/path', undefined)).toThrow();
        });
    });
}
