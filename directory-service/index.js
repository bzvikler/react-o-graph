import chalk from 'chalk';
import cpx from 'cpx';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';

import { injectCode } from './code-injector';

const copy = promisify(cpx.copy);
const exec = promisify(require('child_process').exec)

async function copyFiles() {
  await copy(
    `${process.cwd()}/**`,
    `${__dirname}/copied-app`,
  );

  return copy(
    `${__dirname}/copy-files/analysis-api.js`,
    `${__dirname}/copied-app/src`,
  )
}

function shouldInstallDependencies() {
  if (!existsSync(`${__dirname}/copied-app/node_modules/`)) {
    return true;
  }

  const { dependencies: sourceDeps } = JSON.parse(readFileSync(`${process.cwd()}/package.json`));
  let destPackage = readFileSync(`${__dirname}/copied-app/package.json`);

  if (!destPackage) {
    return true;
  }

  const { dependencies: destDeps } = JSON.parse(destPackage);

  Object.keys(sourceDeps).forEach((dep) => {
    if (!destDeps[dep]) {
      return true;
    }

    if (destDeps[dep] !== sourceDeps[dep]) {
      return true;
    }
  });

  return false;
}

async function installDependencies() {
  console.log(shouldInstallDependencies());
  const { stdout, stderr } = await exec(
    `cd ${__dirname}/copied-app && npm install`
  );
}

export const runDirectoryService = () => {
  return new Promise(async (resolve, reject) => {
    console.log(`${chalk.yellow.bold('WORKING')} Copying project files...`);

    try {
      await copyFiles();
      console.log(`${chalk.blue.bold('INFO')} Copying done...`);
    } catch (e) {
      return reject(e);
    }

    console.log(`${chalk.yellow.bold('WORKING')} Injecting code...`);

    try {
      await injectCode();
      console.log(`${chalk.blue.bold('INFO')} Code injection done...`);
    } catch (e) {
      return reject(e);
    }

    // TODO: fix this it isn't working...
    if (shouldInstallDependencies()) {
      console.log(`${chalk.yellow.bold('WORKING')} Installing dependencies...`);

      try {
        await installDependencies();
        console.log(`${chalk.blue.bold('INFO')} Dependency installation done...`);
      } catch (e) {
        return reject(e);
      }
    } else {
      console.log(`${chalk.blue.bold('INFO')} Skipping dependency installation...`);
    }

    resolve();
  });
}
