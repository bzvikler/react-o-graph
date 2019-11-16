export const isComponent = fileString => (
  fileString.indexOf('import React') !== -1 && fileString.indexOf('Component') !== -1
);
export const isRenderLine = line => line.indexOf('render()') !== -1;
export const isJsOrJsx = fileName => fileName.indexOf('.js') !== -1;
export const hasDidMount = fileString => fileString.indexOf('componentDidMount') !== -1;
export const isDidMountLine = line => line.indexOf('componentDidMount(') !== -1;
export const hasDidUpdate = fileString => fileString.indexOf('componentDidUpdate') !== -1;
export const isDidUpdateLine = line => line.indexOf('componentDidUpdate(') !== -1;
