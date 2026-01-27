/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { version } from './version.js';
import * as hosts from './hosts.js';
import * as auditEvents from './audit-events.js';
import * as builds from './builds.js';
import * as callbacks from './callbacks.js';
import * as companies from './companies.js';
import * as dataElements from './data-elements.js';
import * as environments from './environments.js';
import * as extensionPackages from './extension-packages.js';
import * as extensions from './extensions.js';
import * as heartbeat from './heartbeat.js';
import * as libraries from './libraries.js';
import * as profiles from './profiles.js';
import * as properties from './properties.js';
import * as ruleComponents from './rule-components.js';
import * as rules from './rules.js';

const defaultReactorOptions = {
  reactorUrl: 'https://reactor.adobe.io',
  enableLogging: false
};

function removeTrailingSlash(str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

function bodyIsJson(httpResponse) {
  const jsonContentType = 'application/vnd.api+json';
  const thisContentType = httpResponse.headers.get('content-type');
  return thisContentType && thisContentType.includes(jsonContentType);
}

export default class Reactor {
  constructor(accessToken, userOptions = {}) {
    const options = {
      ...defaultReactorOptions,
      ...userOptions
    };
    this.baseUrl = removeTrailingSlash(options.reactorUrl);
    this.enableLogging = options.enableLogging;
    this.customHeaders = options.customHeaders || {};

    this.headers = {
      ...this.reactorHeaders(accessToken),
      ...this.customHeaders
    };
    if (this.enableLogging) console.info(`Using Reactor at ${this.baseUrl}`);
  }

  reactorHeaders(accessToken) {
    return {
      Accept: 'application/vnd.api+json;revision=1',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${accessToken}`,
      'X-Api-Key': 'Activation-DTM',
      'User-Agent': `adobe/reactor-sdk/javascript/${version}`
    };
  }

  createReviseBody(resourceType, resourceId) {
    return {
      data: {
        id: resourceId,
        attributes: {},
        type: resourceType,
        meta: {
          action: 'revise'
        }
      }
    };
  }

  async requestAndLog(url, requestInfo, requestData) {
    // requestData is requestInfo.body as JavaScript objects (not JSON)
    const response = await fetch(url.toString(), requestInfo);
    const responseData = bodyIsJson(response) ? await response.json() : null;

    const traceData = {
      // convenient human-readable summaries
      status: `${response.status} ${response.statusText}`, // eg '404 not found'
      source: `${requestInfo.method} ${url.toString()}`, // eg 'GET http://x.io/'
      // raw capture of all request and response data
      url: url,
      request: requestInfo,
      response: response,
      // non-JSON versions (i.e., as objects) of request and response bodies
      requestBody: requestData || {},
      responseBody: responseData || {}
    };
    const summary = `${traceData.status} <- ${traceData.source}`;
    if (!response.ok) {
      if (this.enableLogging) console.info('[Reactor SDK]', summary, traceData);
      throw new FetchError(traceData);
    }
    if (this.enableLogging) console.debug('[Reactor SDK]', summary, traceData);
    return responseData;
  }

  async request(method, url, requestData = null, retryCount = 0) {
    const maxRetries = 3;
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: this.headers,
      body: requestBodyJson
    };

    try {
      return await this.requestAndLog(url, requestInfo, requestData);
    } catch (error) {
      // Retry on 429 (Too Many Requests) with respect to retry-after header
      if (
        error instanceof FetchError &&
        error.status === 429 &&
        retryCount < maxRetries
      ) {
        // Get retry-after header (in seconds)
        const retryAfter = error.traceData.response.headers.get('retry-after');
        const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : 5;
        // Add 1 second buffer as requested
        const waitSeconds = retryAfterSeconds + 1;
        const waitMs = waitSeconds * 1000;

        console.info(
          `[Blacksmith API] --------------- The API has asked us to wait ${waitSeconds} seconds before making calls again. ---------------`
        );

        await new Promise((resolve) => setTimeout(resolve, waitMs));
        return await this.request(method, url, requestData, retryCount + 1);
      }
      throw error;
    }
  }

  async sendMultipartFile(method, url, fileObject) {
    const multipart = { 'Content-Type': 'multipart/form-data' };
    const requestInfo = {
      method: method,
      headers: Object.assign({}, this.headers, multipart),
      body: fileObject
    };
    return await this.requestAndLog(url, requestInfo, fileObject);
  }

  get(path, queryParams = {}) {
    const url = new URL(this.baseUrl + path);
    Object.entries(queryParams).forEach(([key, val]) =>
      url.searchParams.append(key, val)
    );
    return this.request('GET', url);
  }

  post(path, data) {
    return this.request('POST', this.baseUrl + path, data);
  }

  patch(path, data) {
    return this.request('PATCH', this.baseUrl + path, data);
  }

  delete(path, data) {
    return this.request('DELETE', this.baseUrl + path, data);
  }
}

function extractErrorDetails(traceData) {
  const errorList = traceData.responseBody.errors || [];
  const details = [traceData.response, ...errorList]
    .map((x) => x.detail)
    .filter((x) => typeof x !== 'undefined')
    .map((x) => `'${x}'`)
    .join('; also, ');
  return details !== '' ? ` (${details})` : '';
}

class FetchError extends Error {
  constructor(traceData) {
    const status = traceData.status;
    const details = extractErrorDetails(traceData);
    const whence = ` on ${traceData.source}`;
    super(status + details + whence);

    if (Error.captureStackTrace) Error.captureStackTrace(this, FetchError);

    this.status = traceData.response.status;
    this.statusText = traceData.response.statusText;
    this.traceData = traceData;
  }
}

Object.assign(
  Reactor.prototype,
  auditEvents,
  builds,
  callbacks,
  companies,
  dataElements,
  environments,
  extensionPackages,
  extensions,
  heartbeat,
  hosts,
  libraries,
  profiles,
  properties,
  ruleComponents,
  rules
);

// Add version property to the prototype
Reactor.prototype.version = version;

if (typeof window !== 'undefined') {
  window.Reactor = Reactor;
}
