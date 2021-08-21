# USAGE
## SEND SINGLE SMS
```
const axios = require("axios").default;

const API_KEY = "64e43732-5e41-4fdc-9855-4f48c15b96b1";
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