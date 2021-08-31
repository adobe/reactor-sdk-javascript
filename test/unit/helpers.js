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

import nock from 'nock';
import Reactor from '../../lib/node/index';

function getEnv(varName, defaultValue) {
  return process.env[varName] || defaultValue;
}

const accessToken = 'No real token needed here because Launch calls are mocked';
const orgId = 'AB123456789abcdefghi@adobe.com';
const reactorUrl = 'https://reactor.sample.com';
const reqheaders = Reactor.prototype.reactorHeaders(accessToken);
const customHeaders = { 'x-gw-ims-org-id': orgId };

function expectRequest(method, path, body) {
  const initializedNock = nock(reactorUrl, {
    reqheaders: reqheaders
  });
  const args = [path];
  if (body != null) {
    body = !body.hasOwnProperty('data') ? { data: body } : body;
    args.push(body);
  }
  initializedNock[method.toLowerCase()].apply(initializedNock, args).reply(200);
}

var reactor = new Reactor(accessToken, {
  reactorUrl: reactorUrl,
  customHeaders: { 'x-gw-ims-org-id': orgId }
});
jasmine.getEnv().reactorContext = {
  reactorUrl: reactorUrl,
  accessToken: accessToken,
  reqheaders: { ...reqheaders, ...customHeaders },
  reactor: reactor,
  expectRequest: expectRequest
};
