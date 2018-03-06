'use strict';



const Test = require('tape');
const { RxHttpRequest, RxHttpsRequest } = require('../lib');
const Nock = require('nock');

Test('test reading', (t) => {

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
                console.error(error);
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
                console.error(error);
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
