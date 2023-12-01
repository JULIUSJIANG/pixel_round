// const react = require (`../node_modules/react/index.js`);
// const reactDomClient = require (`../node_modules/react-dom/client.js`);
// const antd = require (`../node_modules/antd/dist/antd.js`);

import React from 'react';
import {Button, Input, InputNumber, ColorPicker, Slider, message, Popconfirm, Upload} from 'antd';
import {createRoot} from 'react-dom/client';

const NodeModules = {
    react: React,
    reactDomClient: {createRoot},
    antd: {Button, Input, InputNumber, ColorPicker, Slider, message, Popconfirm, Upload}
};

export default NodeModules;