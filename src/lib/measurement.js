export default class BaseMeasurement {
  constructor(window, tab, survey) {
    this.window = window;
    this.tab = tab;
    this.survey = survey;
  }

  getValue() {
    return new Promise((resolve, reject) => {
      const innerResolve = val => {
        try {
          const name = this.constructor.name.charAt(0).toLowerCase() +
            this.constructor.name.slice(1);
          resolve([ name, val ]);
        } catch (err) {
          reject(err);
        }
      };
      this.measure(innerResolve);
    });
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
