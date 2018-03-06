'use strict';



const Test = require('tape');
const { RxHttpRequest, RxHttpsRequest } = require('../lib');
const Nock = require('nock');
const Debug = require('debug');

const debug = Debug('rxhttpclient-test');

Test('test request', (t) => {

    t.test('get', (t) => {
        t.plan(2);

        Nock('http://example.com').get('/hello').reply(200, { hello: 'hello world' });

        const request = new RxHttpRequest({
            method: 'GET',
            hostname: 'example.com',
            path: '/hello'
        });

        request.flatMap((response) => response).toArray().map((chunks) => JSON.parse(Buffer.concat(chunks))).subscribe(
            (body) => {
                t.equal(body.hello, 'hello world');
            },
            (error) => {
                debug(`error: ${error.name}(${error.message})`);
            },
            () => {
                t.pass();
            }
        );

        request.complete();
    });

    t.test('get over ssl', (t) => {
        t.plan(2);

        Nock('https://example.com').get('/hello').reply(200, { hello: 'hello world' });

        const request = new RxHttpsRequest({
            method: 'GET',
            hostname: 'example.com',
            path: '/hello'
        });

        request.flatMap((response) => response).toArray().map((chunks) => JSON.parse(Buffer.concat(chunks))).subscribe(
            (body) => {
                t.equal(body.hello, 'hello world');
            },
            (error) => {
                debug(`error: ${error.name}(${error.message})`);
            },
            () => {
                t.pass();
            }
        );

        request.complete();
    });

    t.test('post', (t) => {
        t.plan(2);
    
        Nock('http://example.com').post('/hello', (body) => body === 'hello world').reply(200);
    
        const request = new RxHttpRequest({
            method: 'POST',
            hostname: 'example.com',
            path: '/hello'
        });
    
        request.subscribe(
            (response) => {
                t.equal(response.raw.statusCode, 200);
            },
            (error) => {
                debug(`error: ${error.name}(${error.message})`);
            },
            () => {
                t.pass();
            }
        );
    
        request.next('hello world');
        request.complete();
    });

    t.test('error on writing request', (t) => {
        t.plan(1);
    
        Nock('http://example.com').post('/hello', (body) => body === 'hello world').reply(200);
    
        const request = new RxHttpRequest({
            method: 'POST',
            hostname: 'example.com',
            path: '/hello'
        });
    
        request.subscribe(
            (response) => {
                t.fail();
            },
            (error) => {
                debug(`(expected) error: ${error.name}(${error.message})`);
                t.pass();
            },
            () => {
                t.fail();
            }
        );
    
        request.next('hello world');
        request.error(new Error());
    });

});

