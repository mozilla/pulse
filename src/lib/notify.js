import uuid from 'uuid';

import { Services } from 'resource://gre/modules/Services.jsm';
import Uri from 'urijs';
import { data } from 'sdk/self';
import { storage } from 'sdk/simple-storage';
import tabs from 'sdk/tabs';
import { getMostRecentBrowserWindow } from 'sdk/window/utils';

import Logger from './log';
import sendEvent from './metrics';

const logger = new Logger(
  'sdk.lib.notify',
  getMostRecentBrowserWindow().console
);

class BaseElement {
  getWindow() {
    return Services.wm.getMostRecentWindow('navigator:browser');
  }
}

class RatingStar extends BaseElement {
  constructor(val, cb) {
    super(...arguments);
    this.element = this.render(val, cb);
  }

  handleClick(evt, cb) {
    cb(evt.target.getAttribute('data-score'));
  }

  render(val, cb) {
    const win = this.getWindow();
    const elem = win.document.createElement('toolbarbutton');
    elem.classList.add('plain', 'star-x');
    elem.id = `star-${val}`;
    elem.setAttribute('data-score', val);
    elem.addEventListener('click', evt => this.handleClick(evt, cb));
    return this.style(elem);
  }

  style(elem) {
    elem.style.height = '20px';
    elem.style.width = '20px';
    return elem;
  }
}

class Rating extends BaseElement {
  constructor(cb) {
    super(...arguments);
    this.element = this.render(cb);
  }

  render(cb, max = 5) {
    const { document } = this.getWindow();
    const fragment = document.createDocumentFragment();
    const elem = document.createElement('hbox');
    elem.id = 'star-rating-container';
    for (let i = 0; i < max; i++) {
      elem.appendChild(new RatingStar(max - i, cb).element);
    }
    fragment.appendChild(this.style(elem));
    fragment.appendChild(this.renderSpacer());
    return fragment;
  }

  renderSpacer() {
    const { document } = this.getWindow();
    const elem = document.createElement('spacer');
    elem.flex = 66;
    return elem;
  }

  style(elem) {
    elem.style.marginBottom = '2px';
    elem.style.mozBoxDirection = 'reverse';
    elem.style.setProperty('-moz-box-direction', 'reverse', 'important');
    return elem;
  }
}

export default class Notification extends BaseElement {
  constructor(options) {
    super(...arguments);
    this.id = uuid();
    this.type = 'random';

    this.notifyBox = null;
    this.getSiteName().then(sitename => {
      options.label = `How would you rate your experience on ${sitename}?`;
      this.element = this.render(options);
    });
  }

  promptedPing() {
    const promptedPing = {
      method: 'pulse-prompted',
      id: this.id,
      type: this.type
    };
    logger.log('Prompted', promptedPing);
    sendEvent(promptedPing);
  }

  dismissedPing() {
    const dismissedPing = {
      method: 'pulse-dismissed',
      id: this.id,
      type: this.type
    };
    logger.log('Dismissed', dismissedPing);
    sendEvent(dismissedPing);
  }

  dismiss(notifyBox, notification) {
    notifyBox.removeNotification(notification);
  }

  openSurvey(surveyUrl, sentiment) {
    storage.id[this.id] = tabs.activeTab;
    tabs.open(new Uri(surveyUrl).query({ id: this.id, sentiment }).toString());
  }

  getParts(elem) {
    const win = Services.wm.getMostRecentWindow('navigator:browser');
    const details = win.document.getAnonymousElementByAttribute(
      elem,
      'anonid',
      'details'
    );
    const closeButton = details.nextSibling;
    const image = win.document.getAnonymousElementByAttribute(
      elem,
      'anonid',
      'messageImage'
    );
    const text = win.document.getAnonymousElementByAttribute(
      elem,
      'anonid',
      'messageText'
    );
    const spacer = text.nextSibling;
    return { closeButton, details, image, spacer, text };
  }

  style(elem) {
    const { closeButton, image, spacer, text } = this.getParts(elem);
    closeButton.style.marginRight = '16px';
    image.style.height = '24px';
    image.style.margin = '8px';
    image.style.marginRight = '6px';
    image.style.width = '24px';
    elem.style.backgroundColor = '#F1F1F1';
    elem.style.color = '#333333';
    elem.style.fontSize = '14px';
    elem.style.padding = '0';
    elem.style.setProperty('font-weight', '400', 'important');
    spacer.flex = 0;
    text.style.fontWeight = '400';
    text.style.margin = '0';
    return elem;
  }

  getSiteName() {
    return new Promise(resolve => {
      const worker = tabs.activeTab.attach({
        contentScriptFile: data.url('sitename.js')
      });
      worker.port.on('send-sitename', sitename => {
        resolve(sitename);
      });
      worker.port.emit('get-sitename', null);
    });
  }

  render(instanceOptions) {
    this.promptedPing();

    const notifyBox = this.notifyBox = this.getWindow().gBrowser.getNotificationBox();
    const options = Object.assign(
      { priority: notifyBox.PRIORITY_INFO_LOW },
      this.defaultOptions,
      instanceOptions
    );
    const notification = notifyBox.appendNotification(
      options.label,
      `pulse-${new Date().getTime()}`,
      options.image,
      options.priority,
      options.buttons,
      options.callback
    );
    notification.appendChild(
      new Rating(sentiment => {
        this.dismiss(notifyBox, notification);
        this.openSurvey(options.surveyUrl, sentiment);
      }).element
    );
    notification.classList.add('heartbeat');
    notification.persistence = options.persistence;

    const { closeButton } = this.getParts(notification);
    closeButton.addEventListener('click', () => {
      this.dismissedPing();
    });

    return this.style(notification);
  }
}

Notification.prototype.defaultOptions = {
  label: 'How would you rate your experience on Mozilla.org?',
  image: 'resource://pulse-at-mozilla-dot-com/webextension/icons/pulse-64.png',
  buttons: [],
  callback: () => {
  },
  persistence: 1
};
