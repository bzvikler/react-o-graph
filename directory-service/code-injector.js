import readdirp from 'readdirp';
import fs from 'fs';
import { promisify } from 'util';

import {
  isComponent,
  isJsOrJsx,
  isTsOrTsx,
} from './filters';
import {
  injectImport,
  injectName,
  injectComponentDidUpdate,
  injectComponentDidMount,
  injectComponentWillUnmount,
} from './injectors';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function prepareFiles() {
  let metaFiles = await readdirp.promise(
    `${__dirname}/copied-app`,
    {
      fileFilter: ['!*.json', '!*.test.*'],
      directoryFilter: ['!.git', '!*modules']
    }
  );
  let pendingFileReads = metaFiles
    .filter(file => isJsOrJsx(file.basename) || isTsOrTsx(file.basename))
    .map(file =>
      readFile(`${__dirname}/copied-app/${file.path}`, 'utf8')
        .then(content => ({
          content,
          ...file,
        }))
    );
  let fileReads = await Promise.all(pendingFileReads);
  return fileReads
    .filter(file => isComponent(file.content));
}

export async function injectCode() {
  const files = await prepareFiles();

  const fileWrites = files.map(file => {
    let newFile = injectImport(file.content, __dirname);
    newFile = injectName(newFile);
    newFile = injectComponentDidMount(newFile);
    newFile = injectComponentDidUpdate(newFile);
    newFile = injectComponentWillUnmount(newFile);

    return writeFile(`${__dirname}/copied-app/${file.path}`, newFile);
  });

  await Promise.all(fileWrites);
}
