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

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import Reactor from '../../lib/node/index.js';

const accessToken = 'No real token needed here because Launch calls are mocked';
const orgId = 'AB123456789abcdefghi@adobe.com';
const reactorUrl = 'https://reactor.sample.com';
const reqheaders = Reactor.prototype.reactorHeaders(accessToken);
const customHeaders = { 'x-gw-ims-org-id': orgId };

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function expectRequest(method, path, body) {
  let normalizedBody;
  if (body != null) {
    normalizedBody = !Object.prototype.hasOwnProperty.call(body, 'data')
      ? { data: body }
      : body;
  }

  // msw expects the matchers to not have the query params.
  const [cleanPath] = path.split('?');
  const fullUrl = `${reactorUrl}${cleanPath}`;

  // Register an MSW handler for this expected call
  server.use(
    http[method.toLowerCase()](fullUrl, async ({ request }) => {
      if (normalizedBody != null) {
        const json = await request.json().catch(() => ({}));
        expect(json).toEqual(normalizedBody);
      }

      return HttpResponse.json({ ok: true }, { status: 200 });
    })
  );
}

const reactor = new Reactor(accessToken, {
  reactorUrl,
  customHeaders: { 'x-gw-ims-org-id': orgId }
});

jasmine.getEnv().reactorContext = {
  reactorUrl,
  accessToken,
  reqheaders: { ...reqheaders, ...customHeaders },
  reactor,
  expectRequest
};
