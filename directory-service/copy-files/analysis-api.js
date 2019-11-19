/**
 * Makes network call to graph-ui server with the given react component details
 *
 * @param {Object} node of shape { id: string, name: string, props: Object, state: Object }
 *
 * @returns {void}
 */
const onUpdate = (node) => {
  // TODO: network calls
  console.log('ON UPDATE');
};

/**
 * Makes network call to graph-ui server with the given react component details
 *
 * @param {Object} node of shape { id: string, name: string, props: Object, state: Object }
 *
 * @returns {void}
 */
const onMount = (node) => {
  // TODO: network calls
  console.log('ON MOUNT');
};

/**
 * Makes network call to graph-ui server with the given react component details
 *
 * @param {Object} node of shape { id: string, name: string, props: Object, state: Object }
 *
 * @returns {void}
 */
const onUnmount = (node) => {
  // TODO: network calls
  console.log('ON UNMOUNT');
}

export default {
  onUpdate,
  onMount,
  onUnmount,
};
