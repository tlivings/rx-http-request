'use strict';



const Test = require('tape');
const { RxHttpRequest, RxHttpsRequest } = require('../lib');

Test('test request creation', (t) => {

    t.test('create http', (t) => {
        t.plan(2);

        const request = new RxHttpRequest({
            method: 'GET',
            hostname: 'example.com',
            path: '/hello'
        });

        t.ok(request, 'request created.');
        t.ok(request.raw, 'raw request created.');
        request.raw.abort();
    });

    t.test('create https', (t) => {
        t.plan(2);

        const request = new RxHttpsRequest({
            method: 'GET',
            hostname: 'example.com',
            path: '/hello'
        });

        t.ok(request, 'request created.');
        t.ok(request.raw, 'raw request created.');
        request.raw.abort();
    });

    t.test('create error', (t) => {
        t.plan(1);

        t.throws(() => {
            new RxHttpRequest({
                method: 1234,
            });
        }, 'throws on bad args.');
    });

});
