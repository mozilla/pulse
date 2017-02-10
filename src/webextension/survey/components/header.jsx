import React, { Component } from 'react';

export default class Header extends Component {
  renderSubheader() {
    const { subheader } = this.props;
    if (subheader) {
      return <h2>{subheader}</h2>;
    }
    return null;
  }

  render() {
    return (
      <header>
        <h1>Firefox Pulse</h1>
        {this.renderSubheader()}
      </header>
    );
  }
}

Header.propTypes = { subheader: React.PropTypes.string };
