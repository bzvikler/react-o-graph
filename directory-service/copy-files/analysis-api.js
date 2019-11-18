const onUpdate = () => {
  // TODO: network calls
  console.log('ON UPDATE');
};

const onMount = () => {
  console.log('ON MOUNT');
  fetch('http://localhost:5000/addRandomNode');
};

export default {
  onUpdate,
  onMount,
};
