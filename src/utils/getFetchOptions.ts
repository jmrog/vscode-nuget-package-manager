import * as url from 'url';
import * as HttpsProxyAgent from 'https-proxy-agent';
import { WorkspaceConfiguration } from 'vscode';

import { RESPONSE_TIMEOUT } from '../constants';

// Cache a few things since this stuff will rarely change, and there's no need to recreate an agent
// if no change has occurred, etc.
let lastProxy = '';
let lastProxyStrictSSL: boolean;
let lastHttpsProxyAgent: any;

export default function getFetchOptions(configuration: WorkspaceConfiguration) {
    const proxy: string = configuration.get('proxy') || process.env.https_proxy || process.env.http_proxy;
    const proxyAuthorization: string | null = configuration.get('proxyAuthorization');
    const proxyStrictSSL: boolean = configuration.get('proxyStrictSSL');
    const fetchOptions: /* TODO */ any = { timeout: RESPONSE_TIMEOUT };

    if (!proxy) {
        lastProxy = '';
        return fetchOptions; // no proxy, so ignore everything but timeout
    }

    if (proxy === lastProxy && proxyStrictSSL === lastProxyStrictSSL) {
        // no need for a new agent if these settings are the same
        fetchOptions.agent = lastHttpsProxyAgent;
    }
    else {
        const parsedProxy = url.parse(proxy);
        const useStrictSSL = !!proxyStrictSSL; // coerce to boolean just in case

        fetchOptions.agent = new HttpsProxyAgent({
            ...parsedProxy,
            secureEndpoint: useStrictSSL,
            rejectUnauthorized: useStrictSSL
        });

        lastHttpsProxyAgent = fetchOptions.agent;
        lastProxyStrictSSL = proxyStrictSSL;
        lastProxy = proxy;
    }

    if (proxyAuthorization) {
        fetchOptions.headers = {
            'Proxy-Authorization': proxyAuthorization
        };
    }

    return fetchOptions;
}
