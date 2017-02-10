import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import classNames from 'classnames';

export const REASONS = [
  { min: 4, value: 'fast', name: 'It is fast' },
  { max: 4, value: 'slow', name: 'It is slow' },
  { min: 4, value: 'works', name: 'It works well' },
  { max: 4, value: 'broken', name: 'It is broken' },
  { min: 4, value: 'like', name: 'I like it' },
  { max: 4, value: 'dislike', name: 'I do not like it' },
  { value: 'other', name: 'Other' }
];

class Reason extends Component {
  shouldRender() {
    const { max, min, sentiment } = this.props;
    return min && sentiment >= min ||
      max && sentiment <= max ||
      (!sentiment || !max && !min);
  }

  render() {
    if (this.shouldRender()) {
      const { name, value } = this.props;
      return <option value={value}>{name}</option>;
    }
    return null;
  }
}

Reason.propTypes = {
  max: React.PropTypes.number,
  min: React.PropTypes.number,
  name: React.PropTypes.string.isRequired,
  sentiment: React.PropTypes.number,
  value: React.PropTypes.string.isRequired
};

class ReasonField extends Component {
  renderSelect() {
    const { input, sentiment } = this.props;
    return (
      <select {...input}>
        <option>Select one...</option>
        {
          REASONS.map(reason => (
            <Reason sentiment={sentiment} key={reason.value} {...reason} />
          ))
        }
      </select>
    );
  }

  renderClassnames() {
    return classNames('field', 'field--details');
  }

  render() {
    const { input: { name } } = this.props;
    return (
      <div className="field field--reason">
        <label htmlFor={name}>This page is:</label>
        {this.renderSelect()}
      </div>
    );
  }
}

ReasonField.propTypes = {
  input: React.PropTypes.object.isRequired,
  sentiment: React.PropTypes.number
};

// Connect this component to receive the current `sentiment` value as a prop,
// allowing reasons to be selectively shown or hidden based on it.
const selector = formValueSelector('survey');
export default connect(state => ({ sentiment: selector(state, 'sentiment') }))(
  ReasonField
);
