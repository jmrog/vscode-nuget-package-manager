import * as expect from 'expect';
import { WorkspaceConfiguration } from 'vscode';
import { getFetchOptions } from '../../src/utils';
import { RESPONSE_TIMEOUT } from '../../src/constants';

function getConfig(options): Partial<WorkspaceConfiguration> {
    return {
        get: (key) => options[key]
    };
}

export default function runGetFetchOptionsTests() {
    describe('getFetchOptions', function () {
        it('should return a new object with only a timeout when no proxy is set', function () {
            let workspaceConfig = <WorkspaceConfiguration>getConfig({});
            const timeoutObject = { timeout: RESPONSE_TIMEOUT };
            const firstResult = getFetchOptions(workspaceConfig);

            expect(firstResult).toEqual(timeoutObject);

            workspaceConfig = <WorkspaceConfiguration>getConfig({ proxyStrictSSL: true });
            const secondResult = getFetchOptions(workspaceConfig);
            expect(secondResult).toEqual(timeoutObject);
            expect(firstResult).toNotBe(secondResult);
        });

        it('should return a new fetchOptions object whenever proxy is set', function () {
            const options = {
                proxy: 'http://localhost:8080'
            };
            let workspaceConfig = <WorkspaceConfiguration>getConfig(options);
            const resultOne = getFetchOptions(workspaceConfig);
            
            expect(Object.keys(resultOne).length).toBe(2);
            expect(resultOne.agent).toBeTruthy();
            expect(resultOne.timeout).toBe(RESPONSE_TIMEOUT);

            workspaceConfig = <WorkspaceConfiguration>getConfig({
                proxy: 'http://localhost:8080',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            });
            const resultTwo = getFetchOptions(workspaceConfig);
            expect(Object.keys(resultTwo).length).toBe(3);
            expect(resultTwo.agent).toBeTruthy();
            expect(resultTwo.timeout).toBe(RESPONSE_TIMEOUT);
            expect(resultTwo.headers).toEqual({ 'Proxy-Authorization': 'Basic YA09AHLAKehtO9Het3' });
            expect(resultTwo).toNotBe(resultOne);

            const newOptions = getFetchOptions(workspaceConfig);
            expect(newOptions).toEqual(resultTwo);
            expect(newOptions).toNotBe(resultTwo);
        });

        it('should re-use agents if the same proxy and proxyStrictSSL values are set', function () {
            const proxy = 'http://lol.wut';
            const workspaceConfig = <WorkspaceConfiguration>getConfig({ proxy });
            const { agent } = getFetchOptions(workspaceConfig);

            expect(getFetchOptions(workspaceConfig).agent).toBe(agent);
            expect(getFetchOptions(<WorkspaceConfiguration>getConfig({
                proxy,
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            })).agent).toBe(agent);
            expect(getFetchOptions(<WorkspaceConfiguration>getConfig({ proxy: 'https://something.else' })).agent).toNotBe(agent);
            expect(getFetchOptions(<WorkspaceConfiguration>getConfig({
                proxy,
                proxyStrictSSL: true
            })).agent).toNotBe(agent);
            expect(getFetchOptions(<WorkspaceConfiguration>getConfig({
                proxy,
                proxyStrictSSL: undefined
            })).agent).toBe(getFetchOptions(workspaceConfig).agent);
        });

        // Ensure that cached values don't interfere with correct operation:
        it('should continue to return correct values when a proxy was once set and no longer is', function () {
            let options = {
                proxy: 'http://www.google.com',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            };
            let workspaceConfig = <WorkspaceConfiguration>getConfig(options);
            let result = getFetchOptions(workspaceConfig);

            expect(Object.keys(result).length).toBe(3);
            expect(result.agent).toBeTruthy();
            expect(result.timeout).toBe(RESPONSE_TIMEOUT);
            expect(result.headers).toEqual({ 'Proxy-Authorization': options.proxyAuthorization });

            workspaceConfig = <WorkspaceConfiguration>getConfig({});
            expect(getFetchOptions(workspaceConfig)).toEqual({ timeout: RESPONSE_TIMEOUT });

            options = {
                proxy: 'http://www.google.com',
                proxyAuthorization: 'Basic YA09AHLAKehtO9Het3' // this isn't real, so no need to freak out
            };
            workspaceConfig = <WorkspaceConfiguration>getConfig(options);
            result = getFetchOptions(workspaceConfig);

            expect(Object.keys(result).length).toBe(3);
            expect(result.agent).toBeTruthy();
            expect(result.timeout).toBe(RESPONSE_TIMEOUT);
            expect(result.headers).toEqual({ 'Proxy-Authorization': options.proxyAuthorization });
        });

        it('should fall back to process.env.https_proxy, then to process.env.http_proxy', function () {
            const workspaceConfig = <WorkspaceConfiguration>getConfig({});
            const timeoutObject = { timeout: RESPONSE_TIMEOUT };
            let result = getFetchOptions(workspaceConfig);
            expect(result).toEqual(timeoutObject);

            const oldHttpProxy = process.env.http_proxy;
            process.env.http_proxy = 'http://oh.hai';
            result = getFetchOptions(workspaceConfig);
            expect(result.agent).toBeTruthy();
            expect(result.agent.proxy.hostname).toBe('oh.hai');

            const oldHttpsProxy = process.env.https_proxy;
            process.env.https_proxy = 'http://lol.wut';
            result = getFetchOptions(workspaceConfig);
            expect(result.agent).toBeTruthy();
            expect(result.agent.proxy.hostname).toBe('lol.wut');

            process.env.http_proxy = oldHttpProxy;
            process.env.https_proxy = oldHttpsProxy;
        });
    });
}
