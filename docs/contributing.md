# Contributing

In order to contribute please ensure the following:

* All tests are passing locally with ``npm test``.
* If adding a new feature you also add documentation.

## Getting Started

appyx-comm requires [node](https://nodejs.org/en) to be installed on your system.

## Running tests

Test are created using [vitest](https://vitest.dev/). To run them you must first install the dependencies and then run:

```bash
$ npm install
$ npm test
```

## Testing package locally

To test the package locally you can use the following command:

```bash
$ npm link
```

You can also test a branch of the package by using the following command (replace `branch-name` with the name of the branch):

```bash
$ npm install "https://github.com/eryxcoop/appyx-comm.git#branch-name" --save
```

## Documentation

appyx-comm uses [sphinx](https://www.sphinx-doc.org/en/master/) for building documentation, and all documentation is
stored in the `docs/` directory at the root of the repository.

To make changes to the documentation you must first initialize the workspace with poetry (inside docs folder):

```bash
$ poetry install
```

After making changes, build the documentation and open the resulting HTML
in your browser to make sure your changes have rendered correctly:

```bash
$ poetry run make html
$ poetry run python -m webbrowser "file://$PWD/html/index.html"
```

## Publishing

Before publishing a new release, ensure that the version number in `package.json` is correct.

### Automatic release

A release can be created automatically by creating a release in github.
name of the release must follow the pattern `@eryxcoop/appyx-comm-X.Y.Z` where `X.Y.Z` is the version
number. The release will be created automatically by the CI/CD pipeline.

Please clarify changes in the release description.

### Manual release

If release creation fails to publish new version, you can create it manually. First ensure your NPM_TOKEN is set
by running the following command:

```bash
$ npm config set //registry.npmjs.org/:_authToken={$NPM_TOKEN}
```

Then you are ready to publish the release:

```bash
$ npm publish
```

Now your release is available on NPM.