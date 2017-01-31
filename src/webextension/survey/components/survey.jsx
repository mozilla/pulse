import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import DetailsField from './fields/details.jsx';
import SentimentField from './fields/sentiment.jsx';
import ReasonField from './fields/reason.jsx';

const required = value => value ? undefined : 'Required';

class Survey extends Component {
  parseSentiment(val) {
    return parseInt(val, 10);
  }

  renderButton() {
    const { submitting, valid } = this.props;
    return (
      <button type="submit" disabled={!valid || submitting}>
        {submitting & 'Submitting...' || 'Submit'}
      </button>
    );
  }

  renderForm() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="sentiment"
          component={SentimentField}
          validate={[ required ]}
          parse={this.parseSentiment}
        />
        <Field name="reason" component={ReasonField} validate={[ required ]} />
        <Field name="details" component={DetailsField} />
        {this.renderButton()}
      </form>
    );
  }

  renderThanks() {
    return <p>Thanks for filling out the survey!</p>;
  }

  render() {
    const { submitSucceeded } = this.props;
    if (submitSucceeded) {
      return this.renderThanks();
    }
    return this.renderForm();
  }
}

Survey.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitSucceeded: React.PropTypes.bool.isRequired,
  valid: React.PropTypes.bool.isRequired
};

export default reduxForm({ form: 'survey' })(Survey);
