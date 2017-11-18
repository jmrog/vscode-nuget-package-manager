import * as expect from 'expect';
import { isHeadlessXML } from '../../src/utils';

export default function runIsHeadlessXMLTests() {
    describe('isHeadlessXML', function () {
        it('should return false only if the candidate string starts with \'<?xml \'', function () {
            expect(isHeadlessXML('')).toBe(true);
            expect(isHeadlessXML('some <?xml ')).toBe(true);
            expect(isHeadlessXML('       <?xml version="1.0" encoding="UTF-8" standalone="no" ?>')).toBe(true);
            expect(isHeadlessXML('<?xml')).toBe(true);
            expect(isHeadlessXML('<? xml')).toBe(true);
            expect(isHeadlessXML('<?xml ')).toBe(false); // this is ok; the utility assumes it's being given something "XML-like enough"
            expect(isHeadlessXML('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>')).toBe(false);
        });
    });
}
