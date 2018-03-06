'use strict';

const { Observable } = require('rxjs');
const Debug = require('debug');

class RxObservableEvents extends Observable {
    constructor(request) {
        const debug = Debug('rxhttpclient-RxObservableEvents');

        super((observer) => {
            let _socket = undefined;

            const onConnect = () => {
                observer.next({ event: 'connect' });
            };

            const onSecureConnect = () => {
                observer.next({ event: 'secureConnect' });
            };

            const onSocket = (socket) => {
                _socket = socket;
                socket.on('connect', onConnect);
                socket.on('secureConnect', onSecureConnect);
                observer.next({ event: 'socket' });
            };

            const onResponse = (/*response*/) => {
                debug('complete');
                observer.next({ event: 'response' });
                observer.complete();
            };

            const onError = (error) => {
                debug(`error: ${error.name}(${error.message})`);
                observer.next({ event: 'error' });
                observer.complete();
            }

            request.on('socket', onSocket);
            request.on('response', onResponse);
            request.on('error', onError);

            return () => {
                debug('disposed');
                if (_socket) {
                    _socket.removeListener('connect', onConnect);
                    _socket.removeListener('secureConnect', onSecureConnect);
                    _socket = null;
                }
                request.removeListener('socket', onSocket);
                request.removeListener('response', onResponse);
                request.removeListener('error', onError);
            };
        });

        this._raw = request;
    }

    get raw() {
        return this._raw;
    }
}

module.exports = RxObservableEvents;