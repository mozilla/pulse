import React, { Component } from 'react';

export default class SentimentField extends Component {
  render() {
    const { input } = this.props;
    return (
      <div className="field">
        <label htmlFor={input.name}>
          How would you rate your experience on sitename?
        </label>
        <select {...input}>
          <option />
          {
            [ 1, 2, 3, 4, 5 ].map(val => (
              <option key={val} value={val}>{val}</option>
            ))
          }
        </select>
        {input.touched && input.error && <span>{input.error}</span>}
      </div>
    );
  }
}

SentimentField.propTypes = { input: React.PropTypes.object.isRequired };
