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
import reactorHeaders from '../../../lib/reactorHeaders';
import jsLogger from 'js-logger';
import Reactor from '../../../lib/reactor';

function getEnv(varName, defaultValue) {
  return process.env[varName] || defaultValue;
}

const accessToken = 'Dummy-Access-Token';
const reactorUrl = 'https://reactor.sample.com';
const reqheaders = reactorHeaders(accessToken);
const loggerLevel = getEnv('JASMINE_DEBUG_LEVEL', 'error');

jsLogger.useDefaults();
const logger = jsLogger.get('ReactorSDK');
const jsLoggerLevels = {
  error: jsLogger.ERROR,
  info: jsLogger.INFO,
  debug: jsLogger.DEBUG,
  trace: jsLogger.TRACE
};
logger.setLevel(jsLoggerLevels[loggerLevel]);

function expectRequest(method, path, body) {
  const initializedNock = nock(reactorUrl, {
    reqheaders: reqheaders
  });
  const args = [path];
  if (typeof body !== 'undefined') {
    body = typeof body.data === 'undefined' ? { data: body } : body;
    args.push(body);
  }
  initializedNock[method.toLowerCase()].apply(initializedNock, args).reply(200);
}

jasmine.getEnv().reactorContext = {
  reactorUrl: reactorUrl,
  accessToken: accessToken,
  reqheaders: reqheaders,
  reactor: new Reactor(accessToken, {
    reactorUrl: reactorUrl,
    logger: logger
  }),
  expectRequest: expectRequest
};
