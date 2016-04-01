This script is intended to show you what npm and bower modules you 
are actually using in your project in case your package.json and
bower.json files are off. 

# list-deps

> This was written to generate a file containing a list of installed
npm and bower modules for a project. If your package.json or
bower.json files become inaccurate you can run this to generate a file
containing list of installed dependencies.

[![NPM Version][npm-image]][npm-url]
[![Linux Build][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

## Install

```bash
npm -g list-deps
```

## Usage

```bash
list-deps
```

## TODO
Currently a setTimeout is being used to delay the writing of the file
in an effort to make sure the file operations are finished first. My
eventual plan is to write this asynchronously.

## License

[MIT](http://vjpr.mit-license.org)