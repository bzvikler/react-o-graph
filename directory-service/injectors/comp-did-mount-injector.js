import {
  hasDidMount,
  isDidMountLine,
  isRenderLine,
} from '../filters';

const ON_MOUNT_STRING = 'AnalysisApi.onMount();';
const COMPONENT_DID_MOUNT_STRING = `componentDidMount() { ${ON_MOUNT_STRING} }\n`;

function alterComponentDidMount(fileContent) {
  const fileArray = fileContent.split('\n');
  const didMountIndex = fileArray.findIndex(line => isDidMountLine(line));
  const preNewLine = fileArray.slice(0, didMountIndex + 1); // cuts up to but NOT including end
  const postNewLine = fileArray.slice(didMountIndex + 1, fileArray.length);

  return [
    ...preNewLine,
    ON_MOUNT_STRING,
    ...postNewLine,
  ].join('\n');
}

function insertComponentDidMount(fileContent) {
  const fileArray = fileContent.split('\n');
  const renderIndex = fileArray.findIndex(line => isRenderLine(line));
  const preNewLine = fileArray.slice(0, renderIndex);
  const postNewLine = fileArray.slice(renderIndex, fileArray.length);

  return [
    ...preNewLine,
    COMPONENT_DID_MOUNT_STRING,
    ...postNewLine,
  ].join('\n');
}

/**
 *
 * @param {string} fileContent file content as a string
 *
 * @returns {string} file string after componentDidMount work done
 */
export const injectComponentDidMount = (fileContent) => {
  if (hasDidMount(fileContent)) {
    return alterComponentDidMount(fileContent);
  }

  return insertComponentDidMount(fileContent);
}
