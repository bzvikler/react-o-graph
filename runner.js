import chalk from 'chalk';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { existsSync } from 'fs';

import { runDirectoryService } from './directory-service';

const exec = promisify(require('child_process').exec)

async function startServer() {
  return new Promise((resolve, reject) => {
    console.log(`${chalk.yellow.bold('WORKING')} Starting analysis server...`);

    const serverChild = spawn(
      `cd ${__dirname}/graph-ui/server && node server.js`,
      { shell: true }
    );

    serverChild.stdout.on('data', (data) => {
      const dataString = data.toString();

      if (dataString.indexOf('Server listening on port 5000!') !== -1) {
        console.log(`${chalk.blue.bold('INFO')} ${dataString.trim()}`);
        resolve();
      }
    });

    serverChild.stderr.on('data', (data) => {
      if (dataString.indexOf('WARN') === -1) {
        reject({ message: data.toString() });
      }
    });
  });
}

async function startGraphUi() {
  return new Promise((resolve, reject) => {
    console.log(`${chalk.yellow.bold('WORKING')} Starting visualization...`);

    const clientDir = `${__dirname}/graph-ui/client`;
    let uiChild;

    if (existsSync(`${clientDir}/node_modules/`)) {
      console.log(`${chalk.blue.bold('INFO')} Skipping dependency install...`);
      uiChild = spawn(
        `cd ${clientDir} && npm start`,
        { shell: true }
      );
    } else {
      console.log(`${chalk.yellow.bold('WORKING')} Installing dependencies...`);
      uiChild = spawn(
        `cd ${clientDir} && npm install --loglevel=error && npm start`,
        { shell: true }
      );
    }

    uiChild.stdout.on('data', (data) => {
      const dataString = data.toString();

      if (dataString.indexOf('Starting the development server...') !== -1) {
        console.log(`${chalk.blue.bold('INFO')} ${dataString.trim()}`);
        resolve();
      }
    });

    uiChild.stderr.on('data', (data) => {
      reject({ message: data.toString() });
    });
  });
}

async function startCopiedApp() {
  return new Promise((resolve, reject) => {
    console.log(`${chalk.yellow.bold('WORKING')} Starting your app...`);

    const uiChild = spawn(
      `cd ${__dirname}/directory-service/copied-app && yarn start`,
      { shell: true }
    );

    uiChild.stdout.on('data', (data) => {
      const dataString = data.toString();

      if (dataString.indexOf('Starting the development server...') !== -1) {
        console.log(`${chalk.blue.bold('INFO')} ${dataString.trim()}`);
        console.log(`${chalk.green.bold('READY')} App running`);
        resolve();
      }
    });

    uiChild.stderr.on('data', (data) => {
      reject({ message: data.toString() });
    });
  });
}

export async function run() {
  try {
    await startServer();
    await startGraphUi();
    await runDirectoryService();
    await startCopiedApp();
  } catch (e) {
    console.log(`${chalk.red.bold('ERROR')} ${e.message}`);
    exec(`killall node`);
    process.exit(1);
  }
}
