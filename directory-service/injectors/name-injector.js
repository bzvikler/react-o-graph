import { isComponentDecLine } from '../filters';

/**
 *
 * @param {string} fileContent file content as a string
 *
 * @returns {string} file string after name work done
 */
export const injectName = (fileContent) => {
  const fileArray = fileContent.split('\n');
  const componentDecIndex = fileArray.findIndex(isComponentDecLine);
  const decArray = fileArray[componentDecIndex].split(' ');
  const componentName = decArray[decArray.findIndex((word) => word === 'class') + 1];

  const preNewLine = fileArray.slice(0, componentDecIndex);
  const postNewLine = fileArray.slice(componentDecIndex, fileArray.length);

  return [
    ...preNewLine,
    `const ROG_COMPONENT_NAME = '${componentName}';\n`,
    ...postNewLine,
  ].join('\n');
}
