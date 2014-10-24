Getting Started
===============

* Go to `https://console.developers.google.com`, create a project and open it
* Navigate to `overview`, and you'll see your `<project id>` at the top
* Go to `APIs & auth -> APIs`, add `Google Cloud Messaging for Android`
* Go to `APIs & auth -> credentials`, and create a new public `<api key>`

```
var GCM = require('node-gcm-ccs');
var gcm = GCM(<project id>, <api key>);
```

Events
------

As defined below

```
gcm.on('connected', console.log);
gcm.on('disconnected', console.log);
gcm.on('online', console.log);
gcm.on('message', console.log);
gcm.on('error', console.log);

gcm.emit('send'); // Send message
gcm.emit('end'); // End connection
```