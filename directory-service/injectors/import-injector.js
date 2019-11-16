/**
 *
 * @param {string} fileContent file content as a string
 *
 * @returns {string} file string after componentDidUpdate work done
 */
export const injectImport = (fileContent, dirPath) => {
  const fileArray = fileContent.split('\n');

  return [
    `import AnalysisApi from '${dirPath}/copied-app/src/analysis-api.js';`,
    ...fileArray,
  ].join('\n');
}
