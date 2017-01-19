export default class Logger {
  constructor(prefix, console) {
    this.console = console;
    this.prefix = `[pulse.${prefix}]`;

    ['info', 'log', 'warn', 'error'].forEach(method => {
      this[method] = function() {
        this.console[method].apply(this.console[method], [this.prefix, ...arguments]);
      };
      this[method] = this[method].bind(this);
    });
  }
}
