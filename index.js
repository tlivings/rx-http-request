'use strict';

const Http = require('http');
const Https = require('https');
const { Observable, Subscriber } = require('rxjs');

class RxClientRequest extends Subscriber {
    constructor(request) {
        super(
            (x) => {
                request.write(x);
            },
            (error) => {
                request.emit('error', error);
            },
            () => {
                request.end();
            }
        );

        this._raw = request;
    }

    get raw() {
        return this._raw;
    }
}

class RxReadable extends Observable {
    constructor(readable) {
        super((observer) => {
            const onReadable = () => {
                let chunk;

                while ((chunk = readable.read()) !== null) {
                    observer.next(chunk);
                }
            };

            const onEnd = () => {
                observer.complete();
            };

            const onError = (error) => {
                observer.error(error);
            };

            readable.on('readable', onReadable);
            readable.on('error', onError);
            readable.on('end', onEnd);

            return () => {
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

class RxObservableRequest extends Observable {
    constructor(request) {
        super(
            (observer) => {
                let _socket = undefined;

                const onConnect = () => {
                    //TODO: something
                };

                const onSecureConnect = () => {
                    //TODO: something
                };

                const onSocket = (socket) => {
                    _socket = socket;
                    socket.on('connect', onConnect);
                    socket.on('secureConnect', onSecureConnect);
                };

                const onResponse = (response) => {
                    observer.next(new RxReadable(response));
                    observer.complete();
                };

                const onError = (error) => {
                    observer.error(error);
                }

                request.on('socket', onSocket);
                request.on('response', onResponse);
                request.on('error', onError);

                return () => {
                    if (_socket) {
                        _socket.removeListener('connect', onConnect);
                        _socket.removeListener('secureConnect', onSecureConnect);
                    }
                    request.removeListener('socket', onSocket);
                    request.removeListener('response', onResponse);
                    request.removeListener('error', onError);
                };
            }
        );

        this._raw = request;
        this._subject = new RxClientRequest(request);
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

    get raw() {
        return this._raw;
    }
}

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
