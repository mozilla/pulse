import Uri from 'urijs';

import Logger from './log';
import { CDN_HEADERS, CDN_HOSTNAMES } from './cdn';

const logger = new Logger('webext.lib.http-observer', console);

export const REQUEST_TYPES = [
  'main_frame',
  'sub_frame',
  'stylesheet',
  'script',
  'image',
  'object',
  'xmlhttprequest',
  'xbl',
  'xslt',
  'ping',
  'beacon',
  'xml_dtd',
  'font',
  'media',
  'websocket',
  'csp_report',
  'imageset',
  'web_manifest',
  'other'
];

export default class HttpObserver {
  constructor() {
    this.requests = {};
    this.addListeners();
  }

  addListeners() {
    browser.webNavigation.onBeforeNavigate.addListener(details => {
      this.navigationListener(details);
    });
    browser.webRequest.onBeforeRequest.addListener(
      details => this.requestListener(details),
      { urls: [ '<all_urls>' ] }
    );
    browser.webRequest.onCompleted.addListener(
      details => this.responseListener(details),
      { urls: [ '<all_urls>' ] },
      [ 'responseHeaders' ]
    );
  }

  // Whenever the user navigates to a new page, clear the collected requests
  // for this tab.
  navigationListener(details) {
    this.requests[details.tabId] = {};
  }

  // Whenever a request is made, log some initial metadata. Only do this if the
  // instance was listening at webNavigation.onBeforeNavigate.
  requestListener(details) {
    if (details.tabId in this.requests) {
      this.requests[details.tabId][details.requestId] = {
        start: details.timeStamp,
        url: details.url,
        completed: false
      };
    }
  }

  // Whenever a request is completed, log additional metadata. Only do this if
  // the instance was listening at webNavigation.onBeforeNavigate.
  responseListener(details) {
    if (details.tabId in this.requests) {
      const request = this.requests[details.tabId][details.requestId];
      this.requests[details.tabId][details.requestId] = Object.assign(request, {
        end: details.timeStamp,
        elapsed: details.timeStamp - request.start,
        fromCache: details.fromCache,
        type: details.type,
        completed: true,
        cdn: this.isCDN(details.url, details.responseHeaders)
      });
    }
  }

  getHostname(url) {
    return new Uri(url).hostname();
  }

  isCDN(url, headers) {
    const hostname = this.getHostname(url);
    const hasCDNHost = CDN_HOSTNAMES.some(cdn_hostname => {
      return hostname.includes(cdn_hostname);
    });
    if (hasCDNHost) {
      return true;
    }
    return headers && headers.some(({ name, value }) => {
        name = name.toLowerCase();
        value = value.toLowerCase();
        if (Object.keys(CDN_HEADERS).includes(name)) {
          if (value === '') {
            return true;
          }
          return CDN_HEADERS[name].includes(value);
        }
        return false;
      });
  }

  // Passed a tab ID, returns the data payload for all requests made by that
  // tab.
  get(tabId) {
    if (tabId in this.requests) {
      const requestData = Object.assign(
        {},
        this.getAll(tabId),
        this.getTypes(tabId)
      );
      logger.log(requestData);
      return requestData;
    }
    logger.log('No requests available.');
    return null;
  }

  // Passed a tab ID, returns an object with a key `all`, mapped to stats for
  // all requests made in that tab.
  getAll(tabId) {
    return { all: this.getByType(tabId) };
  }

  // Passed a tab ID, returns an object mapping type => stats about the
  // requests of that type for that tab.
  getTypes(tabId) {
    return REQUEST_TYPES.reduce(
      (byType, type) => {
        byType[type] = this.getByType(tabId, type);
        return byType;
      },
      {}
    );
  }

  // Passed a tabId and optional type, returns an object with stats for
  // requests, filtered by type if one was provided.
  getByType(tabId, type = null) {
    const requests = this.filter(tabId, type);
    return {
      num: this.getNum(requests),
      time: this.getTime(requests),
      cached: this.getCached(requests),
      cdn: this.getCDN(requests)
    };
  }

  // Passed a tabId and optional type, returns the requests for that tab,
  // filtered by type if one was provided.
  filter(tabId, type = null) {
    const requestIds = Object.keys(this.requests[tabId]);
    return requestIds.reduce(
      (filteredRequests, requestId) => {
        const request = this.requests[tabId][requestId];
        if (request.completed && (!type || type && request.type === type)) {
          filteredRequests[requestId] = request;
        }
        return filteredRequests;
      },
      {}
    );
  }

  // Passed an object mapping requestId => request, returns the number of
  // requests.
  getNum(requests) {
    return Object.keys(requests).length;
  }

  // Passed an object mapping requestId => request, returns the time spent
  // loading those requests.
  getTime(requests) {
    return Object.keys(requests).reduce(
      (summed, requestId) => {
        return summed + requests[requestId].elapsed;
      },
      0
    );
  }

  // Passed an object mapping requestId => request, returns the proportion of
  // those requests that were retrieved from cache. If there are no requests,
  // returns null.
  getCached(requests) {
    const count = this.getNum(requests);
    if (count === 0) {
      return null;
    }
    return Object.keys(requests).reduce(
      (cacheCount, requestId) => {
        return cacheCount + requests[requestId].fromCache ? 1 : 0;
      },
      0
    ) / count;
  }

  // Passed an object mapping requestId => request, returns the proportion of
  // those requests that were retrieved from a CDN. If there are no requests,
  // returns null.
  getCDN(requests) {
    const count = this.getNum(requests);
    if (count === 0) {
      return null;
    }
    return Object.keys(requests).reduce(
      (cdnCount, requestId) => {
        return cdnCount + requests[requestId].cdn ? 1 : 0;
      },
      0
    ) / count;
  }
}
