import React, { Component } from 'react';

import Header from './header.jsx';

export default class Thanks extends Component {
  render() {
    return (
      <div className="thanks">
        <Header subheader="Thank you!" />
        <p>Thanks for filling out the survey!</p>
        <p>
          This information will be used to help us make Firefox faster.{' '}
          <a
            href="https://testpilot.firefox.com/experiments/pulse"
            target="_blank"
          >
            Learn more
          </a>
        </p>
      </div>
    );
  }
}
