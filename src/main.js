//main.js 
// const greeter = require('./Greeter.js');
// document.querySelector("#root").appendChild(greeter());

// ES6
import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter';

import './main.css';//使用require导入css文件

render(<Greeter />, document.getElementById('root'));