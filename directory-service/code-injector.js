// injects calls to API in each component file
// TODO: make functions to test if lifecycle methods already exist
// move strings to be inserted into nice places
// inject the AnalysisAPI
// inject the imports needed to access it
// fix installing all the time node_modules
// get it to say "DONE" after running yarn start
import readdirp from 'readdirp';
import fs from 'fs';
import { promisify } from 'util';

import {
  isComponent,
  isRenderLine,
  isJsOrJsx,
} from './filters';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function injectCode() {
  let metaFiles = await readdirp.promise(
    `${__dirname}/copied-app`,
    {
      fileFilter: '!*.json',
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
  fileReads = fileReads
    .filter(file => isComponent(file.content));

  const componentDidUpdateString = `componentDidUpdate() { AnalysisAPI.onUpdate(); }`;

  const fileWrites = fileReads.map(file => {
    const fileArray = file.content.split('\n');
    const renderIndex = fileArray.findIndex(line => isRenderLine(line));
    const preNewLine = fileArray.slice(0, renderIndex - 1);
    const postNewLine = fileArray.slice(renderIndex, fileArray.length - 1);
    const newFile = [
      ...preNewLine,
      componentDidUpdateString,
      ...postNewLine,
    ].join('\n');

    return writeFile(`${__dirname}/copied-app/${file.path}`, newFile);
  });

  await Promise.all(fileWrites);
}
