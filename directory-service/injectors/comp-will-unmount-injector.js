import {
  hasWillUnmount,
  isRenderLine,
  isWillUnmountLine,
} from '../filters';
import {
  ON_UNMOUNT_STRING,
  COMPONENT_WILL_UNMOUNT_STRING,
} from './constants';

function alterComponentWillUnmount(fileContent) {
  const fileArray = fileContent.split('\n');
  const willUnmountIndex = fileArray.findIndex(line => isWillUnmountLine(line));
  const preNewLine = fileArray.slice(0, willUnmountIndex + 1); // cuts up to but NOT including end
  const postNewLine = fileArray.slice(willUnmountIndex + 1, fileArray.length);

  return [
    ...preNewLine,
    ON_UNMOUNT_STRING,
    ...postNewLine,
  ].join('\n');
}

function insertComponentWillUnmount(fileContent) {
  const fileArray = fileContent.split('\n');
  const renderIndex = fileArray.findIndex(line => isRenderLine(line));
  const preNewLine = fileArray.slice(0, renderIndex);
  const postNewLine = fileArray.slice(renderIndex, fileArray.length);

  return [
    ...preNewLine,
    COMPONENT_WILL_UNMOUNT_STRING,
    ...postNewLine,
  ].join('\n');
}

/**
 *
 * @param {string} fileContent file content as a string
 *
 * @returns {string} file string after componentWillUnmount work done
 */
export const injectComponentWillUnmount = (fileContent) => {
  if (hasWillUnmount(fileContent)) {
    return alterComponentWillUnmount(fileContent);
  }

  return insertComponentWillUnmount(fileContent);
}
