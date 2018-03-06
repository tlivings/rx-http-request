'use strict';

const { Observable } = require('rxjs');
const Debug = require('debug');

class RxReadable extends Observable {
    constructor(readable) {
        const debug = Debug('rxhttpclient-RxReadable');

        super((observer) => {
            const onReadable = () => {
                let chunk;

                while ((chunk = readable.read()) !== null) {
                    observer.next(chunk);
                }
            };

            const onEnd = () => {
                debug('complete');
                observer.complete();
            };

            const onError = (error) => {
                debug('complete');
                observer.error(error);
            };

            readable.on('readable', onReadable);
            readable.on('error', onError);
            readable.on('end', onEnd);

            return () => {
                debug('disposed');
                readable.removeListener('readable', onReadable);
                readable.removeListener('end', onEnd);
                readable.removeListener('error', onError);
            };
        });

        this._raw = readable;
    }

    get raw() {
        return this._raw;
    }
}

module.exports = RxReadable;