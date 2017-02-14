if (typeof window.pulse === 'undefined') {
  window.pulse = {};
}

// Whenever the window receives the pulse-get-pagemonitor event, respond with
// the full window.pulse object in a pulse-send-pagemonitor event.
window.addEventListener(
  'pulse-get-pagemonitor',
  () => {
    var sendEvent = document.createEvent('CustomEvent');
    sendEvent.initCustomEvent(
      'pulse-send-pagemonitor',
      true,
      true,
      window.pulse
    );
    document.documentElement.dispatchEvent(sendEvent);
  },
  false
);

// Utilities for working with timers.
const now = () => new Date().getTime();
const elapsed = () => now() - window.pulse.timestamp;

// The original timestamp
window.pulse.timestamp = now();

// Log the time elapsed between page load and the window.load event.
const logWindowLoad = () => {
  window.pulse.timerWindowLoad = elapsed();
  window.removeEventListener('load', logWindowLoad);
};
window.addEventListener('load', logWindowLoad);

// Log the time elapsed between page load and the DOMContentLoaded event.
const logContentLoaded = () => {
  window.pulse.timerContentLoaded = elapsed();
  document.removeEventListener('DOMContentLoaded', logContentLoaded);
};
document.addEventListener('DOMContentLoaded', logContentLoaded);

// Log the time elapsed between page load and the first paint event.
const logFirstPaint = () => {
  window.pulse.timerFirstPaint = elapsed();
  window.cancelAnimationFrame(logFirstPaint);
};
window.requestAnimationFrame(logFirstPaint);

// Log the time elapsed between page load and the first user interaction.
const interactions = [ 'click', 'scroll', 'keypress', 'touch' ];
window.pulse.timerFirstInteraction = null;
const logFirstInteraction = () => {
  window.pulse.timerFirstInteraction = elapsed();
  interactions.forEach(interaction => {
    window.removeEventListener(interaction, logFirstInteraction);
  });
};
interactions.forEach(interaction => {
  window.addEventListener(interaction, logFirstInteraction);
});
