// var config = require('./config.json');

// module.exports = function() {
//   var greet = document.createElement('div');
//   greet.textContent = config.greetText;
//   return greet;
// };

// react
import React, { Component } from 'react'
import config from './config.json';
import styles from './Greeter.less';

class Greeter extends Component{
  render() {
    return (
      <div className={styles.greeter}> 
        {config.greetText}
      </div>
    );
  }
}

export default Greeter