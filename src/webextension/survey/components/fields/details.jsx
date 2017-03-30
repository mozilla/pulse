import classNames from 'classnames';
import React, { Component } from 'react';

export default class DetailsField extends Component {
  renderError(error) {
    if (error) {
      return <div className="field--error-message">{error}</div>;
    }
    return null;
  }

  getClassNames() {
    const { meta: { error } } = this.props;
    return classNames('field', 'field--details', { 'field--error': !!error });
  }

  render() {
    const { input, meta: { error } } = this.props;
    return (
      <div className={this.getClassNames()}>
        <label className="step" htmlFor={input.name}>3.</label>
        <label htmlFor={input.name} id={input.name}>Any other comments?</label>
        <textarea placeholder="Optional comments..." {...input} />
        {this.renderError(error)}
      </div>
    );
  }
}

DetailsField.propTypes = {
  input: React.PropTypes.object.isRequired,
  meta: React.PropTypes.shape({
    error: React.PropTypes.string
  })
};
