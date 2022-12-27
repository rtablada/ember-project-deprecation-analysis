# Pod Deprecation Analysis

This tool is an experiment to analyse the use of deprecated APIs in Ember Pod applications.

It uses `lint-to-the-future` and `ember-unused-components` to determine the application structure, component usage, and lint/deprecation errors.

# Installation

Clone this repo to your machine and install dependencies using `yarn`.

# Running this tool

First set the `PROJECT_PATH` environment variable to the full path of your Ember Project

```sh
export PROJECT_PATH=/user/me/sites/my-ember-app
```

If you use pods or a custom subdirectory other than `app`, set the `PODS_DIR` environment variable

```sh
export PODS_DIR=app/pods
```

Then run the analyser using `yarn start`