# Contributing

To help speed up the review process please ensure the following:

* All tests are passing locally with ``npm test``.
* If adding a new feature you also add documentation.

## Getting Started

appyx-comm requires [node](https://nodejs.org/en) to be installed on your system.

## Testing

Test are created using vite. To run them you must first install the dependencies and then run:

```shell-session
$ npm install
$ npm test
```

## Documentation

appyx-comm uses [Sphinx](https://www.sphinx-doc.org/en/master/) for building documentation, and all documentation is
stored in the `docs/` directory at the root of the repository.

To make changes to the documentation you must first initialize the workspace with poetry (inside docs folder):

```shell-session
$ poetry install
```

After making changes, build the documentation and open the resulting HTML
in your browser to make sure your changes have rendered correctly:

```shell-session
$ poetry run make html
$ poetry run python -m webbrowser "file://$PWD/html/index.html"
```