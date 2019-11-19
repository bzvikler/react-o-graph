const PARAMS = '{ id: this.id, name: ROG_COMPONENT_NAME, props: this.props, state: this.state }';
export const ON_MOUNT_STRING = `this.id = uuidv1(); \nAnalysisApi.onMount(${PARAMS});`;
export const COMPONENT_DID_MOUNT_STRING = `componentDidMount() { ${ON_MOUNT_STRING} }\n`;
export const ON_UNMOUNT_STRING = `AnalysisApi.onUnmount(${PARAMS});`;
export const COMPONENT_WILL_UNMOUNT_STRING = `componentWillUnmount() { ${ON_UNMOUNT_STRING} }\n`;
export const ON_UPDATE_STRING = `AnalysisApi.onUpdate(${PARAMS});`;
export const COMPONENT_DID_UPDATE_STRING = `componentDidUpdate() { ${ON_UPDATE_STRING} }\n`;
