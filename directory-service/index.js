import chalk from 'chalk';
import cpx from 'cpx';
import { promisify } from 'util';

import { injectCode } from './code-injector';

const copy = promisify(cpx.copy);
const exec = promisify(require('child_process').exec)

async function copyFiles() {
  return copy(
    '/Users/benzvikler/Desktop/watcher-test/**',
    `${__dirname}/copied-app`,
  );
}

async function installDependencies() {
  try {
    const { stdout, stderr } = await exec(
      `cd ${__dirname}/copied-app && npm install`
    );
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);
  } catch (err) {
    console.error(err);
  };
}

async function startApp() {
  try {
    const { stdout, stderr } = await exec(
      `cd ${__dirname}/copied-app && yarn start`
    );
    // console.log('stdout:', stdout);
    // console.log('stderr:', stderr);
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

  /* for node modules
  console.log(`${chalk.yellow.bold('WORKING')} Installing dependencies...`);

  try {
    await installDependencies();
  } catch (e) {
    console.log(e);
  }
  */

  /* for starting app
  console.log(`${chalk.yellow.bold('WORKING')} Starting app...`);

  try {
    await startApp();
  } catch (e) {
    console.log(e);
  }
  */

  console.log('%s Project ready', chalk.green.bold('DONE'));
}
