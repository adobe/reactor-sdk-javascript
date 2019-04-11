# JavaScript Reactor SDK

A Library for accessing the Adobe Experience Platform
[Launch API][Launch API doc].

# &#x26a0; Alpha State
**These APIs are currently in an** *‘alpha’* **state and are likely to change
over time. Please do not use them in a production setting!**

This is an early release. We wanted to make this code available to the community
quickly in order to elicit criticism and contributions. The style of the API is
intended to be comfortable to JavaScript developers. But that "comfortable
style" was determined by a small group of people, so Your Mileage May Vary. We
welcome your feedback.

## The SDK and the API

The Adobe Experience Platform Launch API is a RESTful
[`{json:api}`](https://jsonapi.org/)-compliant service.

Each Launch endpoint has a corresponding function in this library.  For example,
the ["Fetch a Profile"][FetchProfile doc] endpoint is accessed via the
[`fetchProfile()`][FetchProfile impl] SDK function.

Since the correspondence between API endpoints and SDK functions is one-to-one,
the [Launch API documentation][ListCompanies doc] is the primary source of
semantic information.

(In addition to the live API documentation, the source code of that
documentation is also available. It's open-sourced at
[`reactor-developer-docs`][Launch API doc repo].  For example, the source code
of the ["Fetch a Profile"][FetchProfile doc] documentation is at
[profiles/fetch.md][FetchProfile doc src].)


[Launch API doc]: https://developer.adobelaunch.com/api/ 'Adobe Experience Platform Launch API'
[Launch API doc repo]: https://github.com/Adobe-Marketing-Cloud/reactor-developer-docs 'Launch API documentation repository'
[FetchProfile doc]: https://developer.adobelaunch.com/api/reference/1.0/profiles/fetch/ 'Fetch a Profile'
[FetchProfile impl]: https://github.com/Adobe-Marketing-Cloud/reactor-sdk-javascript/blob/033db2e59a619141b9508feae50bbe39d5660fa5/lib/profiles.js#L13 'fetchProfile'
[FetchProfile doc src]: https://github.com/Adobe-Marketing-Cloud/reactor-developer-docs/blob/master/api/reference/1.0/profiles/fetch.md 'Fetch a Profile'
[ListCompanies doc]: https://developer.adobelaunch.com/api/reference/1.0/companies/list/ 'List Companies'

Every SDK function [has an integration test](./blob/master/test/integration) that
demonstrates its correctness. (Well, correct for at least *one* use).  These
tests also provide you working examples for every library function.
[This isn't quite true yet.  We're almost there, but a few remain to be
implemented.]

For a complete and self-contained example program, see
[examples.test.js](./test/integration/examples.test.js), which is included in
the integration tests. It's a JavaScript implementation of the [Reactor
Postman]( https://github.com/Adobe-Marketing-Cloud/reactor-postman) query set.

## Setup

(An NPM package is forthcoming. For now, `git clone`.)
```bash
$ git clone git@github.com:Adobe-Marketing-Cloud/reactor-sdk-javascript.git
$ cd reactor-sdk-javascript
$ npm install                 # install the NPM dependencies
$ npm run build               # build the Reactor SDK library
```

Run unit tests in Node.js:
```bash
$ npm run unit-tests          # run the tests in test/unit/**
```

The integration tests violate the CORS policy, because they run in a page loaded
with `file:` yet access `https://launch.adobe.com:9011` for the tests. For
these tests to work, you'll have to disable your browser's web security. (For
Google Chrome on macOS, you can do this by shutting down the browser and then
restarting it from the commandline via `open -a "Google Chrome" --args
--disable-web-security --user-data-dir`.)

The integration tests also require a provisioned Company and current access
token. Get those data into environment variables using the instructions below
(_Determining Your Company ID_ and _Determining Your Access Token_).

Once that's all set up, run the integration tests:
```bash
$ export ACCESS_TOKEN=${REACTOR_API_TOKEN}
$ export COMPANY_ID=${REACTOR_TEST_COMPANY_ID}
$ export REACTOR_URL=https://reactor.adobe.io
$ npm run integration-tests   # run the tests in test/integration/**
$ # Currently known to pass in MacOS Chrome Version 72.0.3626.121.
```

**Don't forget to restart Chrome _with its normal security_ once the
integration tests are done.**

While developing the Reactor SDK, these are handy for auto-building when you
change the source code:

```bash
# re-run {lint, prettier, build} when src/**/*.js changes
$ npm run src-watch

# re-run {lint, prettier, build, and test} when {dist,test/unit}/**/*.js changes
$ npm run unit-watch

# re-run {lint, prettier, build, and test} when {dist,test/integration}/**/*.js changes
$ npm run integration-watch

# re-run {lint, prettier, build, and test} when {src,test}/**/*.js changes
$ npm run all-watch
```

## Determining Your Company ID
* Log in to `https://launch.adobe.com/companies`
* While looking at your Properties page, the address bar will show a URL like
  `https://launch.adobe.com/companies/CO81f8cb0aca3a4ab8927ee1798c0d4f8a/properties`.
* Your Company ID is the 'CO' followed by 32 hexadecimal digits (i.e., from "CO"
  up to the following slash). Copy that company ID to an environment variable:
    - $ `export COMPANY_ID=CO81f8cb0aca3a4ab8927ee1798c0d4f8a`

## Determining your Access Token in Google Chrome
* Log in to `https://launch.adobe.com/companies`
* Open the developer console
* Execute `copy(userData.imsAccessToken)`
* The access token is now in your system clipboard. Paste it into an
  environment variable definition:
    - $ `export ACCESS_TOKEN='<paste>'`

## Future Work

* Implement integration tests for the handful of functions not yet covered.
* Include a section here on library function naming conventions.
* Publish as an NPM package, then update this README.
* Find or implement a JavaScript library for handling JWT token generation. The
  current mechanism requires you to generate an access token yourself. Such
  tokens time out after while, forcing you to generate a new one.
* Describe how query parameters are passed in this SDK.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](https://github.com/Adobe-Marketing-Cloud/reactor-sdk-javascript/blob/master/CONTRIBUTING.md)
for more information.
