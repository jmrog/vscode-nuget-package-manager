import * as expect from 'expect';
import { handleSearchResponse } from '../../../src/actions/add-methods';

export default function runHandleSearchResponseTests() {
    describe('handleSearchResponse', function () {
        it('should return a rejected promise if response.ok is falsey', function (done) {
            handleSearchResponse(<Response>{ ok: false }).catch(() => {
                expect(true).toBeTruthy()
                done();
            });
        });

        it('should call response.json if response.ok is truthy', function (done) {
            handleSearchResponse(
                <Response>{
                    ok: true,
                    json: () => {
                        expect(true).toBeTruthy();
                        done();
                    }
                }
            );
        });
    });
}
