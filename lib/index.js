'use strict';

const Http = require('http');
const Https = require('https');
const RxObservableRequest = require('./request-observable');

class RxHttpRequest extends RxObservableRequest {
    constructor(options = {}) {
        super(Http.request(options));
    }
}

class RxHttpsRequest extends RxObservableRequest {
    constructor(options = {}) {
        super(Https.request(options));
    }
}

module.exports = { RxHttpRequest, RxHttpsRequest };
