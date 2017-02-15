import React, { Component } from 'react';
import { connect } from 'react-redux';
import Uri from 'urijs';
import uuid from 'uuid';

import { sendMessage } from '../../lib/util';
import Survey from './survey.jsx';

class App extends Component {
  // Generate and cache initial form values.
  getInitialValues() {
    // If we've already calculated this, just return them.
    if (this.initialValues) {
      return this.initialValues;
    }

    // Ensure that optional fields are included in the payload, even if empty.
    const defaultValues = { details: '' };

    // Generate a UUID, then send to the host SDK add-on so that it can
    // associate a future submission with the correct tab and window.
    defaultValues.id = uuid();
    window.surveyId = defaultValues.id;
    sendMessage('loaded', { id: defaultValues.id, type: 'user' });

    // Get `sentiment` and `type` from the querystring.
    const qs = new Uri(window.location.search).search(true);
    // Merge the default values and those from the querystring. Then ensure
    // that types are correct, store them, and return them.
    const initialValues = this.initialValues = Object.assign(
      {},
      defaultValues,
      qs
    );
    if ('sentiment' in initialValues) {
      initialValues.sentiment = parseInt(initialValues.sentiment, 10);
    }
    return initialValues;
  }

  handleSubmit(values) {
    window.submitted = true;
    sendMessage('submitted', values);
  }

  render() {
    return (
      <Survey
        initialValues={this.getInitialValues()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(state => state)(App);
