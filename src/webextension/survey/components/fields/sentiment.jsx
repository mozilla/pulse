import React, { Component } from 'react';

export class StarRating extends Component {}

export default class SentimentField extends Component {
  handleChange(evt) {
    this.props.input.onChange(evt);
  }

  renderInput(n) {
    const { input } = this.props;
    return (
      <input
        name={input.name}
        type="radio"
        id={`sentiment-${n}`}
        value={n}
        checked={input.value === n}
        onChange={input.onChange}
      />
    );
  }

  renderLabel(n) {
    return <label htmlFor={`sentiment-${n}`}>{n}</label>;
  }

  // This is a bit ugly; it's done this way to ensure that each <label> and
  // <input> element are siblings, which lets us manage all of the star logic
  // with CSS alone.
  renderStars() {
    return (
      <div className="field--star">
        {this.renderInput(5)}
        {this.renderLabel(5)}
        {this.renderInput(4)}
        {this.renderLabel(4)}
        {this.renderInput(3)}
        {this.renderLabel(3)}
        {this.renderInput(2)}
        {this.renderLabel(2)}
        {this.renderInput(1)}
        {this.renderLabel(1)}
      </div>
    );
  }

  getSitename() {
    const { sitename } = this.props;
    if (sitename.length > 25) {
      return `${sitename.slice(0, 20)}...`;
    }
    return sitename;
  }

  render() {
    const { input } = this.props;
    return (
      <div className="field field--sentiment">
        <label className="step">1.</label>
        <label>
          How would you rate your experience on {this.getSitename()}?
        </label>
        {this.renderStars()}
        {input.touched && input.error && <span>{input.error}</span>}
      </div>
    );
  }
}

SentimentField.propTypes = {
  input: React.PropTypes.object.isRequired,
  sitename: React.PropTypes.string.isRequired
};
