import * as expect from 'expect';
import { getFetchOptions } from '../../src/utils';
import { RESPONSE_TIMEOUT } from '../../src/constants';

export default function runGetFetchOptionsTests() {
    describe('getFetchOptions', function () {
        it('should return a new object with only a timeout when no proxy is set', function () {
            let config: any = {};
            const timeoutObject = { timeout: RESPONSE_TIMEOUT };
            const firstResult = getFetchOptions(config);

            expect(firstResult).toEqual(timeoutObject);

            config.proxyStrictSSL = true;
            const secondResult = getFetchOptions(config);
            expect(secondResult).toEqual(timeoutObject);
            expect(firstResult).toNotBe(secondResult);

            config = null;
            expect(getFetchOptions(config)).toEqual(timeoutObject);
            config = undefined;
            expect(getFetchOptions(config)).toEqual(timeoutObject);
            expect(getFetchOptions()).toEqual(timeoutObject);
        });

        it('should return a new fetchOptions object whenever proxy is set', function () {
            const config: any = {
                proxy: 'http://localhost:8080'
            };
            const resultOne = getFetchOptions(config);
            
            expect(Object.keys(resultOne).length).toBe(2);
            expect(resultOne.agent).toBeTruthy();
            expect(resultOne.timeout).toBe(RESPONSE_TIMEOUT);

            config.proxyAuthorization = 'Basic YA09AHLAKehtO9Het3'; // this isn't real, so no need to freak out
            const resultTwo = getFetchOptions(config);
            expect(Object.keys(resultTwo).length).toBe(3);
            expect(resultTwo.agent).toBeTruthy();
            expect(resultTwo.timeout).toBe(RESPONSE_TIMEOUT);
            expect(resultTwo.headers).toEqual({ 'Proxy-Authorization': config.proxyAuthorization });
            expect(resultTwo).toNotBe(resultOne);

            expect(getFetchOptions(config)).toEqual(resultTwo);
            expect(getFetchOptions(config)).toNotBe(resultTwo);
        });

        it('should re-use agents if the same proxy and proxyStrictSSL values are set', function () {
            const config: any = {
                proxy: 'http://lol.wut'
            };
            const { agent } = getFetchOptions(config);

            expect(getFetchOptions(config).agent).toBe(agent);
            expect(getFetchOptions({
                proxy: 'http://lol.wut',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            }).agent).toBe(agent);
            expect(getFetchOptions({ proxy: 'https://something.else' }).agent).toNotBe(agent);
            expect(getFetchOptions({
                proxy: 'http://lol.wut',
                proxyStrictSSL: true
            }).agent).toNotBe(agent);
            expect(getFetchOptions({
                proxy: 'http://lol.wut',
                proxyStrictSSL: undefined
            }).agent).toBe(getFetchOptions(config).agent);
        });

        // Ensure that cached values don't interfere with correct operation:
        it('should continue to return correct values when a proxy was once set and no longer is', function () {
            let config: any = {
                proxy: 'http://www.google.com',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            };
            let result = getFetchOptions(config);

            expect(Object.keys(result).length).toBe(3);
            expect(result.agent).toBeTruthy();
            expect(result.timeout).toBe(RESPONSE_TIMEOUT);
            expect(result.headers).toEqual({ 'Proxy-Authorization': config.proxyAuthorization });

            config = {};
            expect(getFetchOptions(config)).toEqual({ timeout: RESPONSE_TIMEOUT });

            config = {
                proxy: 'http://www.google.com',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            };
            result = getFetchOptions(config);

            expect(Object.keys(result).length).toBe(3);
            expect(result.agent).toBeTruthy();
            expect(result.timeout).toBe(RESPONSE_TIMEOUT);
            expect(result.headers).toEqual({ 'Proxy-Authorization': config.proxyAuthorization });
        });
    });
}
