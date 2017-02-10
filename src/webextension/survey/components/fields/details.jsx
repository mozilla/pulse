import React, { Component } from 'react';

export default class DetailsField extends Component {
  render() {
    const { input } = this.props;
    return (
      <div className="field field--details">
        <label htmlFor={input.name} id={input.name}>Any other comments?</label>
        <textarea placeholder="Optional comments..." {...input} />
      </div>
    );
  }
}

DetailsField.propTypes = { input: React.PropTypes.object.isRequired };
