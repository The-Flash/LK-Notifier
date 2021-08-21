# USAGE
## SEND SINGLE SMS
```
const axios = require("axios").default;

const API_KEY = "API_KEY";
const BASE_URL = "https://us-central1-lk-notifier.cloudfunctions.net/api";

const lkNotifier = axios.create({
    baseURL: BASE_URL
});

async function testAPI() {
    try {
        const response = await lkNotifier.post("send-sms", {
            recipient: "0553847137",
            body: "Seems to be working"
        }, {
            params: {
                key: API_KEY
            }
        });
        console.log(response.data);
    } catch(e) {
        console.log("Not working");
    }
}

testAPI().then(console.log).catch(console.log);
```

## Sending Bulk SMS
```
const axios = require("axios").default;

const API_KEY = "API_KEY";
const BASE_URL = "https://us-central1-lk-notifier.cloudfunctions.net/api";

const lkNotifier = axios.create({
    baseURL: BASE_URL
});

async function testAPI() {
    try {
        const response = await lkNotifier.post("send-bulk-sms", {
            recipients: ["0553847137", "0509343841"],
            body: "Seems to be working"
        }, {
            params: {
                key: API_KEY
            }
        });
        console.log(response.data);
    } catch(e) {
        console.log("Not working");
    }
}

testAPI().then(console.log).catch(console.log);
```

Note that for bulk sms, its "recipients" - with an s.

## Send Single Email
```
async function testEmailAPI() {
    try {
        const response = await lkNotifier.post("send-email", {
            recipient: "absaugustineflash@gmail.com",
            subject: "Please work",
            body: "I hope this works. I'm tired"
        }, {
            params: {
                key: API_KEY
            }
        })
        console.log(response.data);
    } catch(e) {
        console.log(e);
        console.log("Not working");
    }
}

testEmailAPI().then(console.log).catch(console.log);
```

## Sending Bulk Email
```
async function testBulkEmailAPI() {
    try {
        const response = await lkNotifier.post("send-bulk-email", {
            recipients: ["absaugustineflash@gmail.com", "logickids@codewithflash.com"],
            subject: "Please work",
            body: "I hope this works. I'm tired"
        }, {
            params: {
                key: API_KEY
            }
        })
        console.log(response.data);
    } catch(e) {
        console.log(e);
        console.log("Not working");
    }
}

testBulkEmailAPI().then(console.log).catch(console.log);
```
