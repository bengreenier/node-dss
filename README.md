# node-dss

[![Build Status](https://travis-ci.org/bengreenier/node-dss.svg?branch=master)](https://travis-ci.org/bengreenier/node-dss)

dead simple signalling for webrtc.

## Why

Think of this as a message broker service. It allows you to pass messages to a predetermined reciever. We use this as a lightweight replacement for a signalling server, where both clients have known identities. This saves us from the more complex logic of tracking live clients, and communicating peer 'join' and 'leave' events.

## How

> Note: To see logs, use the environment variable `DEBUG` with the `dss` namespace. IE: `set DEBUG=dss*`.

You'll need to install [nodejs](https://nodejs.org) to leverage this service.

First install dependencies with [npm](http://npmjs.com/) - from the project directory run: `npm install`. Then run the service with `npm start` from the project directory.

__Without the `DEBUG` environment variable set as-documented above, there will be no output from the process indicating a successful start.__

### Check for a message

Use `GET` to `/data/:id` where `:id` identifies your client

#### No messages for you

```
GET /data/user1 HTTP/1.1
Host: localhost:3000

404

<emptyBody>
```

#### You have a message

```
GET /data/user1 HTTP/1.1
Host: localhost:3000

200

<message data>
```

### Post a message

Use `POST` to `/data/:id` where `:id` identifies the destination client. The body is your message. MIME not required.

#### Message uploaded

```
POST /data/user1 HTTP/1.1
Host: localhost:3000

<message data>

200

<emptyBody>
```

## License

MIT
