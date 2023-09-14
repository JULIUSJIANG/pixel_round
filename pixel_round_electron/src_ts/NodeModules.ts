const react = require (`../node_modules/react/index.js`);
const reactDomClient = require (`../node_modules/react-dom/client.js`);
const antd = require (`../node_modules/antd/dist/antd.js`);
const electron = require (`electron`);
const fs = require (`fs`);
const path = require (`path`);

const NodeModules = {
    react,
    reactDomClient,
    antd,
    fs,
    path,
    electron
};

export default NodeModules;