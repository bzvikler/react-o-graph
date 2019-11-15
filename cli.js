#!/usr/bin/env node
require = require('esm')(module /*, options*/);
const directoryService = require('./directory-service');

directoryService.run();
