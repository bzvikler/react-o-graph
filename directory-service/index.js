import chalk from 'chalk';
import cpx from 'cpx';
import { promisify } from 'util';

import { injectCode } from './code-injector';

const copy = promisify(cpx.copy);
const exec = promisify(require('child_process').exec)

async function copyFiles() {
  try {
    await copy(
      '/Users/benzvikler/Desktop/watcher-test/**',
      `${__dirname}/copied-app`,
    );

    return copy(
      `${__dirname}/copy-files/analysis-api.js`,
      `${__dirname}/copied-app/src`,
    )
  } catch (err) {
    console.log(`${chalk.red.bold('ERROR')} ${err.message}`);
  }
}

async function installDependencies() {
  try {
    const { stdout, stderr } = await exec(
      `cd ${__dirname}/copied-app && npm install`
    );
  } catch (err) {
    console.error(err);
  };
}

async function startApp() {
  try {
    const { stdout, stderr } = await exec(
      `cd ${__dirname}/copied-app && yarn start`
    );
  } catch (err) {
    console.error(err);
  };
}

export const run = async () => {
  console.log(`${chalk.yellow.bold('WORKING')} Copying project files...`);

  try {
    await copyFiles();
  } catch (e) {
    console.log(e);
  }

  console.log(`${chalk.yellow.bold('WORKING')} Injecting code...`);

  try {
    await injectCode();
  } catch (e) {
    console.log(e);
  }

  // TODO: add something to not install deps once installed already
  console.log(`${chalk.yellow.bold('WORKING')} Installing dependencies...`);

  try {
    await installDependencies();
  } catch (e) {
    console.log(e);
  }

  console.log(`${chalk.green.bold('READY')} Running app...`);

  try {
    await startApp();
  } catch (e) {
    console.log(e);
  }
}
