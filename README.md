#PPSCode Pear to pear code sharing along with video call and communication platform 
    *Using Nodejs mongoose ..

```
$ npm i

$ npm start
```

### create config.js file
```javascript
module.exports = {
    mailer: {
        service: 'EMAILP', // email provide eg. Gmail
        auth: {
            user: 'YOUR EMAIL', // your email address eg. test@gmail.com
            pass: 'YOUR EMAIL PASSWORD' 
        }
    },
    db: 'mongodb://127.0.0.1/<>' // mongoose DataBase eg.  mongodb://127.0.0.1/dbname,
    sessionKey: 'thisismysecret', 
    GOOGLE_CLIENT_ID: '', // from https://console.developers.google.com/apis
    GOOGLE_CLIENT_SECRET: ''
}
```

### Resource
```
https://codemirror.net/
http://socket.io
https://github.com/peers/peerjs
https://github.com/Operational-Transformation/ot.js

```
