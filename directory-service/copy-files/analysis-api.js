/**
 * Makes network call to graph-ui server with the given react component details
 *
 * @param {Object} node of shape { id: string, name: string, props: Object, state: Object }
 *
 * @returns {void}
 */
const onUpdate = (node) => {
  // TODO: network calls
  var url = "http://localhost:5000/updateNode";
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      node,
    }),
  });


  console.log('ON UPDATE', node);
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
  var url = "http://localhost:5000/addNode";
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      node,
    }),
  });
  console.log('ON MOUNT', node);
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
  var url = "http://localhost:5000/removeNode";
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      node,
    }),
  });

  console.log('ON UNMOUNT', node);
}

export default {
  onUpdate,
  onMount,
  onUnmount,
};
