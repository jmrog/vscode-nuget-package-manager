import * as expect from 'expect';
import { getProjFileExtension } from '../../src/utils';

export default function runGetProjFileExtensionTests() {
    describe('getProjFileExtension', function () {
        it('should match ending .csproj and .fsproj but otherwise return undefined', function () {
            expect(getProjFileExtension('test.csproj')).toBe('csproj');
            expect(getProjFileExtension('test.fsproj')).toBe('fsproj');
            expect(getProjFileExtension('test.ext')).toBe(undefined);
            expect(getProjFileExtension('contains.csproj.gif')).toBe(undefined);
            expect(getProjFileExtension('contains.fsproj.gif')).toBe(undefined);
            expect(getProjFileExtension('/file/with/path/whatever.csproj')).toBe('csproj');
            expect(getProjFileExtension('/file/with/path/whatever.fsproj')).toBe('fsproj');
            expect(getProjFileExtension('/file/with/path/whatever.ext')).toBe(undefined);
            expect(getProjFileExtension('/file/with/path.csproj/whatever.ext')).toBe(undefined);
            expect(getProjFileExtension('/file/with/path.fsproj/whatever.ext')).toBe(undefined);
        });
    });
}