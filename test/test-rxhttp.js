'use strict';



const Test = require('tape');
const { RxHttpRequest } = require('../index');
const Nock = require('nock');
const { Observable } = require('rxjs');

Test('test', (t) => {

    t.test('get', (t) => {
        t.plan(2);

        Nock('http://example.com').get('/hello').reply(200, { hello: 'hello world' });

        const request = new RxHttpRequest({
            method: 'GET',
            hostname: 'example.com',
            path: '/hello'
        });

        request.complete();

        request.flatMap((response) => response).toArray().map((chunks) => JSON.parse(Buffer.concat(chunks))).subscribe(
            (body) => {
                t.equal(body.hello, 'hello world');
            },
            (error) => {
                console.error(error);
            },
            () => {
                t.pass();
            }
        );
    });

    t.test('post', (t) => {
        t.plan(2);

        Nock('http://example.com').post('/hello', (body) => body === 'hello world').reply(200);

        const request = new RxHttpRequest({
            method: 'POST',
            hostname: 'example.com',
            path: '/hello'
        });

        request.next('hello world');
        request.complete();

        request.subscribe(
            (response) => {
                t.equal(response.raw.statusCode, 200);
            },
            (error) => {
                console.error(error);
            },
            () => {
                t.pass();
            }
        );
    });

});