import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import Thanks from './thanks.jsx';
import DetailsField from './fields/details.jsx';
import SentimentField from './fields/sentiment.jsx';
import ReasonField from './fields/reason.jsx';

const required = value => value ? undefined : 'Required';

class Survey extends Component {
  parseSentiment(val) {
    return parseInt(val, 10);
  }

  // This is a horrible anti-pattern in React. Unfortunately, we need to force
  // the body to have a specific height in order to grow it to the size of the
  // absolutely-position panel with the remaining fields.
  addtl(show) {
    document.body.classList[show ? 'add' : 'remove']('addtl--show');
  }

  renderButton() {
    const { submitting, valid } = this.props;
    return (
      <button type="submit" disabled={!valid || submitting}>
        {submitting & 'Submitting...' || 'Submit'}
      </button>
    );
  }

  renderScreen() {
    return <div className="addtl--screen" onClick={() => this.addtl(false)} />;
  }

  renderForm() {
    const { handleSubmit, initialValues: { sitename } } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="sentiment"
          component={SentimentField}
          validate={[ required ]}
          parse={this.parseSentiment}
          sitename={sitename}
          onChange={() => this.addtl(true)}
        />
        <div className="addtl">
          <div className="addtl--fields">
            <Field
              name="reason"
              component={ReasonField}
              validate={[ required ]}
            />
            <Field name="details" component={DetailsField} />
            {this.renderButton()}
          </div>
          {this.renderScreen()}
        </div>
      </form>
    );
  }

  render() {
    const { submitSucceeded } = this.props;
    if (submitSucceeded) {
      this.addtl(false);
      return <Thanks subheader="Thank you!" />;
    }
    return this.renderForm();
  }
}

Survey.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  pristine: React.PropTypes.bool.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  submitSucceeded: React.PropTypes.bool.isRequired,
  valid: React.PropTypes.bool.isRequired,
  initialValues: React.PropTypes.shape({
    sitename: React.PropTypes.string.isRequired
  }).isRequired
};

export default reduxForm({ form: 'survey' })(Survey);
