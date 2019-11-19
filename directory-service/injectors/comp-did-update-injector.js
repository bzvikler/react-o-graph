import {
  hasDidUpdate,
  isRenderLine,
  isDidUpdateLine,
} from '../filters';
import {
  ON_UPDATE_STRING,
  COMPONENT_DID_UPDATE_STRING,
} from './constants';

function alterComponentDidUpdate(fileContent) {
  const fileArray = fileContent.split('\n');
  const didUpdateIndex = fileArray.findIndex(line => isDidUpdateLine(line));
  const preNewLine = fileArray.slice(0, didUpdateIndex + 1); // cuts up to but NOT including end
  const postNewLine = fileArray.slice(didUpdateIndex + 1, fileArray.length);

  return [
    ...preNewLine,
    ON_UPDATE_STRING,
    ...postNewLine,
  ].join('\n');
}

function insertComponentDidUpdate(fileContent) {
  const fileArray = fileContent.split('\n');
  const renderIndex = fileArray.findIndex(line => isRenderLine(line));
  const preNewLine = fileArray.slice(0, renderIndex);
  const postNewLine = fileArray.slice(renderIndex, fileArray.length);

  return [
    ...preNewLine,
    COMPONENT_DID_UPDATE_STRING,
    ...postNewLine,
  ].join('\n');
}

/**
 *
 * @param {string} fileContent file content as a string
 *
 * @returns {string} file string after componentDidUpdate work done
 */
export const injectComponentDidUpdate = (fileContent) => {
  if (hasDidUpdate(fileContent)) {
    return alterComponentDidUpdate(fileContent);
  }

  return insertComponentDidUpdate(fileContent);
}
