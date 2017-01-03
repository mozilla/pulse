function Logger(prefix, console) {
  this.console = console;
  this.prefix = `[pulse.${prefix}]`;
}

['info', 'log', 'warn', 'error'].forEach(method => {
  Logger.prototype[method] = function() {
    this.console[method].apply(this.console, [this.prefix, ...arguments]);
  };
});


exports.Logger = Logger;
