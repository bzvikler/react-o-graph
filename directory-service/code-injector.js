import readdirp from 'readdirp';
import fs from 'fs';
import { promisify } from 'util';

import {
  isComponent,
  isJsOrJsx,
} from './filters';
import {
  injectImport,
  injectComponentDidUpdate,
  injectComponentDidMount,
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
    .filter(file => isJsOrJsx(file.basename))
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
    newFile = injectComponentDidUpdate(newFile);
    newFile = injectComponentDidMount(newFile);

    return writeFile(`${__dirname}/copied-app/${file.path}`, newFile);
  });

  await Promise.all(fileWrites);
}
