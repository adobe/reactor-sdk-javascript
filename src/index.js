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

import fetch from 'node-fetch';

import bodyIsJson from './body-is-json';
import reactorHeaders from './reactor-headers';
import createReviseBody from './create-revise-body';

import * as adapters from './adapters';
import * as auditEvents from './audit-events';
import * as builds from './builds';
import * as callbacks from './callbacks';
import * as companies from './companies';
import * as dataElements from './data-elements';
import * as environments from './environments';
import * as extensionPackages from './extension-packages';
import * as extensions from './extensions';
import * as heartbeat from './heartbeat';
import * as libraries from './libraries';
import * as profiles from './profiles';
import * as properties from './properties';
import * as ruleComponents from './rule-components';
import * as rules from './rules';

const defaultReactorOptions = {
  reactorUrl: 'https://reactor.adobe.io',
  enableLogging: false
};

function removeTrailingSlash(str) {
  return str.endsWith('/') ? str.slice(0, -1) : str;
}

export { reactorHeaders, createReviseBody };
export default class Reactor {
  constructor(accessToken, userOptions = {}) {
    const options = Object.assign({}, defaultReactorOptions, userOptions);
    this.baseUrl = removeTrailingSlash(options.reactorUrl);
    this.enableLogging = options.enableLogging;
    this.headers = reactorHeaders(accessToken);
    this.createReviseBody = createReviseBody;
    if (this.enableLogging) console.info(`Using Reactor at ${this.baseUrl}`);
  }

  async requestAndLog(url, requestInfo, requestData) {
    // requestData is requestInfo.body as JavaScript objects (not JSON)
    const response = await fetch(url.toString(), requestInfo);
    const responseData = bodyIsJson(response) ? await response.json() : null;

    const status = `${response.status} ${response.statusText}`;
    const source = `${requestInfo.method} ${url.toString()}`;
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

  async request(method, url, requestData = null) {
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: this.headers,
      body: requestBodyJson
    };
    return await this.requestAndLog(url, requestInfo, requestData);
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
    .map(x => x.detail)
    .filter(x => typeof x !== 'undefined')
    .map(x => `'${x}'`)
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
  adapters,
  auditEvents,
  builds,
  callbacks,
  companies,
  dataElements,
  environments,
  extensionPackages,
  extensions,
  heartbeat,
  libraries,
  profiles,
  properties,
  ruleComponents,
  rules
);
