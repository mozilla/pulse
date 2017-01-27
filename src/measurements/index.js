const measurements = [];

export default survey => {
  return new Promise((resolve, reject) => {
    Promise
      .all(
        measurements.map(Measure => new Measure(null, null, survey).getValue())
      )
      .then(data => resolve(new Map([ ...survey, ...data ])))
      .catch(err => reject(err));
  });
};
