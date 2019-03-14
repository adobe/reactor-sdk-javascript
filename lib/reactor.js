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

import bodyIsJson from './bodyIsJson';
import reactorHeaders from './reactorHeaders';
import createReviseBody from './createReviseBody';

import * as adapters from './adapters';
import * as auditEvents from './auditEvents';
import * as builds from './builds';
import * as callbacks from './callbacks';
import * as companies from './companies';
import * as dataElements from './dataElements';
import * as environments from './environments';
import * as extensionPackages from './extensionPackages';
import * as extensions from './extensions';
import * as heartbeat from './heartbeat';
import * as libraries from './libraries';
import * as profiles from './profiles';
import * as properties from './properties';
import * as ruleComponents from './ruleComponents';
import * as rules from './rules';

class NullLogger {
  fatal() {}
  error() {}
  warn() {}
  info() {}
  debug() {}
  trace() {}
}

export default class Reactor {
  constructor(accessToken, options = {}) {
    const url = options.reactorUrl || 'https://reactor.adobe.io';
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    this.headers = reactorHeaders(accessToken);
    this.logger = options.logger || new NullLogger();
    this.createReviseBody = createReviseBody;
  }

  async request(method, url, requestData = null) {
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: this.headers,
      body: requestBodyJson
    };

    const response = await fetch(url.toString(), requestInfo);
    const responseData = bodyIsJson(response) ? await response.json() : null;

    const status = `${response.status} ${response.statusText}`;
    const source = `${method} ${url.toString()}`;
    if (!response.ok) {
      this.logger.warn(status, '<-', source, response);
    } else {
      this.logger.debug(status, '<-', source);
    }
    this.logger.trace(
      'request headers =',
      requestInfo.headers,
      ', request body =',
      requestData,
      '; response headers =',
      response.headers,
      ', response body =',
      responseData
    );
    if (!response.ok) {
      throw new FetchError(
        method,
        url,
        requestInfo.headers,
        requestData,
        response,
        responseData
      );
    }
    return responseData;
  }

  async sendMultipartFile(method, url, fileObject) {
    const requestBodyJson = requestData && JSON.stringify(requestData);
    const requestInfo = {
      method: method,
      headers: Object.assign({}, this.headers, {
        'Content-Type': 'multipart/form-data'
      }),
      body: fileObject
    };
    this.logger.debug(method, url.toString());
    this.logger.trace('request headers:', requestInfo.headers);
    this.logger.trace('request body:', fileObject);

    const response = await fetch(url.toString(), requestInfo);
    const responseData = bodyIsJson(response) ? await response.json() : null;

    const status = `${response.status} ${response.statusText}`;
    const source = `${method} ${url.toString()}`;
    if (responseData && !response.ok) {
      this.logger.warn(status, '<-', source, response);
      throw new FetchError(
        method,
        url,
        requestInfo.headers,
        requestData,
        response,
        responseData
      );
    } else {
      this.logger.debug(status, '<-', source);
    }
    this.logger.trace('response headers:', response.headers);
    this.logger.trace('response body:', responseData);
    return responseData;
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

class FetchError extends Error {
  constructor(
    method,
    url,
    requestHeaders,
    requestData,
    response,
    responseBody
  ) {
    const status = `${response.status} "${response.statusText}"`;

    const errorList = responseBody.errors || [];
    const details = [response, ...errorList]
      .map(x => x.detail)
      .filter(x => typeof x !== 'undefined')
      .map(x => `'${x}'`)
      .join('; also, ');
    const detail = details !== '' ? ` (${details})` : '';
    const whence = ` on ${method} ${url}`;
    super(status + detail + whence);
    if (Error.captureStackTrace) Error.captureStackTrace(this, FetchError);
    this.status = response.status;
    this.statusText = response.statusText;
    this.fetchDetails = {
      method: method,
      url: url,
      requestHeaders: requestHeaders,
      requestBody: requestData,
      response: response,
      responseBody: responseBody
    };
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
