'use strict';

const { Subscriber } = require('rxjs');
const Debug = require('debug');

class RxRequestSubscriber extends Subscriber {
    constructor(request) {
        const debug = Debug('rxhttpclient-RxRequestSubscriber');

        super(
            (x) => {
                request.write(x);
            },
            (error) => {
                debug(`error: ${error.name}(${error.message})`);
                request.emit('error', error);
            },
            () => {
                debug('complete');
                request.end();
            }
        );

        this._raw = request;
    }

    get raw() {
        return this._raw;
    }
}

module.exports = RxRequestSubscriber;