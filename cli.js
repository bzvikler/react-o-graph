#!/usr/bin/env node
require = require('esm')(module /*, options*/);
const runner = require('./runner');

runner.run();
