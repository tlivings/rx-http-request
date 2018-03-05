# rx-http-request

The intent of this module is to provide a low level utility providing `rxjs` wrapping of node core http/https
off of which higher level abstractions can be built.

### Request API

- `RxHttpRequest(options)` - a `Subject` wrapping `http.ClientRequest`.
    - `raw` - the underlying `http.ClientRequest` object.

- `RxHttpsRequest(options)` - a `Subject` wrapping `http.ClientRequest` for `https`.
    - `raw` - the underlying `http.ClientRequest` object.

As subjects, `complete` must be called (similar to `end` on a request), to begin the request.

### Responses

As observables, requests emit `RxReadable` observable responses.

- `RxReadable` - an `Observable` wrapping `http.IncomingMessage`.
    - `raw` - the underlying `http.IncomingMessage`.

This observable emits data read off the `http.IncomingMessage` stream.

### Example Usage

```javascript
const request = new RxHttpRequest({
    method: 'GET',
    hostname: 'example.com',
    path: '/hello'
});

request
//project the incoming response observable
.flatMap((response) => response)
//gather all data read off the response
.toArray()
//parse the body (JSON in this case)
.map((chunks) => JSON.parse(Buffer.concat(chunks)))
.subscribe(
    (body) => {
        console.log(body);
    },
    (error) => {
        console.error(error);
    },
    () => {
        console.log('request complete');
    }
);

//Begins the request
request.complete();
```
