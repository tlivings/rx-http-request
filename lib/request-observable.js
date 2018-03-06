'use strict';

const { Observable } = require('rxjs');
const Debug = require('debug');
const RxObservableEvents = require('./events');
const RxRequestSubscriber = require('./request-subscriber');
const RxReadable = require('./readable');


class RxObservableRequest extends Observable {
    constructor(request) {
        const debug = Debug('rxhttpclient-RxObservableRequest');

        super((observer) => {
            const onResponse = (response) => {
                debug('complete');
                observer.next(new RxReadable(response));
                observer.complete();
            };

            const onError = (error) => {
                debug(`error: ${error.name}(${error.message})`);
                observer.error(error);
            }

            request.on('response', onResponse);
            request.on('error', onError);

            return () => {
                debug('disposed');
                request.removeListener('response', onResponse);
                request.removeListener('error', onError);
            };
        });

        this._raw = request;
        this._subject = new RxRequestSubscriber(request);
        this._events = new RxObservableEvents(request);
    }

    next(x) {
        this._subject.next(x);
    }

    error(error) {
        this._subject.error(error);
    }

    complete() {
        this._subject.complete();
    }

    get events() {
        return this._events;
    }

    get raw() {
        return this._raw;
    }
}

module.exports = RxObservableRequest;