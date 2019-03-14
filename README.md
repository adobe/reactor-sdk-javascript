# JavaScript Reactor SDK

A Library for accessing the Adobe Experience Platform
[Launch API][Launch API doc].

# &#x26a0; Alpha State &#x26a0;
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

Every SDK function [has an integration test](./blob/master/test/intg) that
demonstrates its correctness. (Well, correct for at least *one* use).  These
tests also provide you working examples for every library function.  [Actually,
over here in reality, the claim that *all* functions have integration tests is
not actually exactly, well, you know... **true**. &lt;sigh&gt; Let's call that
claim "***aspirational***"? `:-)` &lt;/sigh&gt; We're almost there, but a few
remain to be implemented -- hopefully, soon.]

For a complete and self-contained example program, see
[examples.js](./blob/master/test/intg/examples.test.js), which is included in
the integration tests. It's a JavaScript implementation of the [Reactor
Postman]( https://github.com/Adobe-Marketing-Cloud/reactor-postman) query set.

## Setup

(An NPM package is forthcoming. For now, `git clone`.)
```bash
$ git clone git@github.com:Adobe-Marketing-Cloud/reactor-sdk-javascript.git
$ cd reactor-sdk-javascript
$ npm install           # install the NPM dependencies
```

Run the unit tests in Node.js:
```bash
$ npm run test          # run the unit tests in test/spec/**
```

Run the integration tests in your default browser. You'll need access to a
provisioned Company in a functioning Launch service. Describe your setup through
environment variables before running the tests:

```bash
$ export ACCESS_TOKEN=${REACTOR_API_TOKEN}
$ export COMPANY_ID=${REACTOR_TEST_COMPANY_ID}
$ export REACTOR_URL=https://launch.adobe.com:9011
$ # TODO: figure out a reasonable REACTOR_URL for non-Adobe-internal testers
$ npm run integration   # run the integration tests in test/intg/**
$ # Currently known to pass in MacOS Chrome Version 72.0.3626.121.
```

While developing, these are handy for auto-building your changes:

```bash
# re-run {lint, prettier, build, and test} when {lib,test/spec}/**/*.js changes
$ npm run watch

# re-run {lint, prettier, build, and test} when {lib,test/intg}/**/*.js changes
$ npm run integration:watch  # same, but for {lib,test/intg}/**/*.js
```

## Future Work

* Implement integration tests for the handful of functions not yet covered.
* Figure out a reasonable `REACTOR_URL` for non-Adobe-internal testers.
* Include a section here on library function naming conventions.
* Include a section here giving instructions on how to get an `ACCESS_TOKEN`.
* Publish as an NPM package, then update this README.
* Find or implement a JavaScript library for handling JWT token generation. The
  current mechanism requires you to generate an access token yourself. Such
  tokens time out after while, forcing you to generate a new one.
* Describe how query parameters are passed in this SDK.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](https://github.com/Adobe-Marketing-Cloud/reactor-sdk-javascript/blob/master/CONTRIBUTING.md)
for more information.
