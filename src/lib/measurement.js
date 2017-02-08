import self from 'sdk/self';
import { viewFor } from 'sdk/view/core';

import Logger from '../lib/log';

export default class BaseMeasurement {
  constructor(tab, window, survey) {
    this.tab = tab;
    this.window = viewFor(tab.window);
    this.survey = survey;
    this.name = this.constructor.name.charAt(0).toLowerCase() +
      this.constructor.name.slice(1);
    this.logger = new Logger(
      `sdk.measurement.${this.constructor.name.toLowerCase()}`,
      this.window.console
    );
  }

  getValue() {
    return new Promise((resolve, reject) => {
      this.measure(val => {
        try {
          if (typeof val === 'object' && this.name.hasOwnProperty(val)) {
            resolve([ this.name, val[this.name] ]);
          } else {
            resolve([ this.name, val ]);
          }
        } catch(err) {
          reject(err);
        }
      });
    });
  }

  // A helper method to attach a content script of a given name to the tab from
  // which the report was invoked and resolve the paylod with which it responds.
  //
  // Assumptions:
  // - The content script's file is in src/data/`name`.js
  // - The message that the content script passes is called `name`
  //
  // To use, simply call this in the subclass' measure method:
  // this.contentScript('name', resolve);
  contentScript(name, resolve) {
    const worker = this.tab.attach({
      contentScriptFile: [ self.data.url(`${name}.js`) ]
    });
    worker.port.on(name, payload => resolve(payload));
  }

  // A method designed to be overriden by subclasses. Should resolve to the
  // value of the measurement, which will be added to the payload paired with
  // the name of the constructor.
  //
  // In lieu of a rejection, should throw an error.
  measure(resolve) {
    resolve('Unimplemented measure method.');
  }
}
