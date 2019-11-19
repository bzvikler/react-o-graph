import chalk from 'chalk';
import cpx from 'cpx';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';

import { injectCode } from './code-injector';

const copy = promisify(cpx.copy);
const exec = promisify(require('child_process').exec)

async function copyFiles() {
  await copy(
    `${process.cwd()}/{,!(node_modules)/**/}*.*`,
    `${__dirname}/copied-app`,
  );

  return copy(
    `${__dirname}/copy-files/analysis-api.js`,
    `${__dirname}/copied-app/src`,
  )
}

function dependencyCheck() {
  if (!existsSync(`${__dirname}/copied-app/node_modules/`)) {
    return true;
  }

  const { dependencies: sourceDeps } = JSON.parse(readFileSync(`${process.cwd()}/package.json`));
  let destPackage = readFileSync(`${__dirname}/copied-app/package.json`);

  if (!destPackage) {
    return true;
  }

  const { dependencies: destDeps } = JSON.parse(destPackage);

  for (const dep of Object.keys(sourceDeps)) {
    if (!destDeps[dep]) {
      return true;
    }

    if (destDeps[dep] !== sourceDeps[dep]) {
      return true;
    }
  }

  return false;
}

async function installDependencies() {
  return exec(`cd ${__dirname}/copied-app && npm install && npm install uuid`);
}

export const runDirectoryService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // determine this before copying over new files
      const shouldInstallDependencies = dependencyCheck();

      console.log(`${chalk.yellow.bold('WORKING')} Copying project files...`);

      await copyFiles();

      console.log(`${chalk.blue.bold('INFO')} Copying done...`);
      console.log(`${chalk.yellow.bold('WORKING')} Injecting code...`);

      await injectCode();

      console.log(`${chalk.blue.bold('INFO')} Code injection done...`);

      if (shouldInstallDependencies) {
        console.log(`${chalk.yellow.bold('WORKING')} Installing dependencies...`);
        await installDependencies();
        console.log(`${chalk.blue.bold('INFO')} Dependency installation done...`);
      } else {
        console.log(`${chalk.blue.bold('INFO')} Skipping dependency installation...`);
      }

      resolve();
    } catch (e) {
      return reject(e);
    }
  });
}
