Getting Started
===============
Install via
```
npm install git+https://github.com/jacobp100/node-gcm-ccs.git
```

Use via
```js
var GCM = require('node-gcm-ccs');
var gcm = GCM(<project id>, <api key>);
```

Getting an API Key
------------------
* Go to `https://console.developers.google.com`, create a project and open it
* Navigate to `overview`, and you'll see your `<project id>` at the top
* Go to `APIs & auth -> APIs`, add `Google Cloud Messaging for Android`
* Go to `APIs & auth -> credentials`, and create a new public `<api key>`

Functions
=========
Send Message
------------
Use `send` to send a message.
```js
gcm.send(to, data, [options, callback(error, messageId, to)]);
```
Argument            | Details
------------------- | -------
to                  | A single user
data                | Data to be sent to the client
options (optional)  | See _Message Paremeters_ from https://developer.android.com/google/gcm/server.html#send-msg. If `delivery_receipt_requested = true`, an event will be sent when the message is received by the target.
callback (optional) | `function(error, messageId, to)` called back individually for each target.

End Connection
--------------
```
gcm.end;
```

Events
======
Events are defined as below.
```js
gcm.on('message', function(messageId, from, category, data)); // Messages received from client (excluding receipts)
gcm.on('receipt', function(messageId, from, category, data)); // Only fired for messages where options.delivery_receipt_requested = true

gcm.on('connected', console.log);
gcm.on('disconnected', console.log);
gcm.on('online', console.log);
gcm.on('error', console.log);
```

Example
=======
```js
var GCM = require('node-gcm-ccs');
var gcm = GCM(<project id>, <api key>);

gcm.on('message', function(messageId, from, category, data) {
	console.log('received message', arguments);
});

gcm.on('receipt', function(messageId, from, category, data) {
	console.log('received receipt', arguments);
});

gcm.send(<device id>, { message: 'hello world' }, { delivery_receipt_requested: true }, function(err, messageId, to)) {
	if (!err) {
		console.log('sent message to', to, 'with message_id =', messageId);
	} else {
		console.log('failed to send message');
	}
}
```
Echo Client
-----------
```js
gcm.on('message', function(_, from, __, data) {
	gcm.send(from, data);
});
```

Notes on GCM
============
* No events are emitted from GCM or this library when a device new registers: you'll have to send a message from the device and process it yourself
* This library doesn't have functions to create user notifications (https://developer.android.com/google/gcm/notifications.html). However, if you implement this yourself, you'll be able to send to a user group by paassing the `notification_key_name` as a `device_id` for `gcm.send`.
* Occasionally, GCM performs load balancing, so the connection is sometimes restarted. This library handles this transparently, and your messages will be queued in these situations.