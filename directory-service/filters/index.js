export const isComponent = fileString => fileString.indexOf('import React') !== -1;
export const isRenderLine = line => line.indexOf('render()') !== -1;
export const isJsOrJsx = fileName => fileName.indexOf('.js') !== -1;
