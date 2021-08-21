const functions = require("firebase-functions");
const express = require("express")
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
const axios = require("axios").default;
const each = require("async/each");

sgMail.setApiKey(functions.config().sendgrid.key);
const SMSNOTIFY_API_KEY = functions.config().smsnotify.key;
const SMSNOTIFY_SENDER_ID = functions.config().smsnotify.sender_id;
const SMSNOTIFY_URL = "http://sms.smsnotifygh.com/smsapi";
const API_KEY = functions.config().lknotifier.key;
const FROM_EMAIL = "info@codewithflash.com";

const app = express();

app.use(cors());
app.use(express.json());

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let checkAPIKey = function(req, res, next) {
    console.log("Checking");
    const key = req.query.key;
    if (key === API_KEY) {
        next();
    }

    else if(key === undefined) {
        res.status(401).json({
            "details": "Bad Request"
        });
    }

    else if(key !== API_KEY) {
        res.status(400).json({
            "details": "Unauthorized Request"
        });
    }
}

app.use(checkAPIKey);

async function sendSMS(config, callback) {
    try {
        const  response = await axios.get(SMSNOTIFY_URL, {
            params: config
        });
        return response;
    } catch(err) {
        console.log(err);
        throw err;
    }
}

app.get("/", (req, res) => {
    res.json({
        name: "LKNotifier"
    })
})

app.post("/send-email/", (req, res) => {
    let msg = {
        to: req.body.recipient,
        from: FROM_EMAIL,
        subject: req.body.subject,
    }
    switch(req.body.type) {
        case "text":
            msg["text"] = req.body.body;
            break;
        case "html":
            msg["html"] = req.body.body;
            break;
        default:
            msg["text"] = req.body.body;
    }

    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({
                details: "Email Delivered Successfully"
            });
        })
        .catch((err) => {
            res.status(400).json({
                details: "An error occurred"
            });
        });
})

app.post("/send-sms/", async (req, res) => {
    let config = {
        key: SMSNOTIFY_API_KEY,
        to: req.body.recipient,
        msg: req.body.body,
        sender_id: SMSNOTIFY_SENDER_ID
    };
    sendSMS(config)
        .then(({ data }) => {
            console.log(data);
            res.status(200).json({
                details: "SMS Delivered Successfully"
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({
                details: "An error occurred"
            });
        });
        
})

app.post("/send-bulk-email/", (req, res) => {
    let msg = {
        to: req.body.recipients,
        from: FROM_EMAIL,
        subject: req.body.subject,
    }
    switch(req.body.type) {
        case "text":
            msg["text"] = req.body.body;
            break;
        case "html":
            msg["html"] = req.body.body;
            break;
        default:
            msg["text"] = req.body.body;
    }
    sgMail
        .sendMultiple(msg)
        .then(() => {
            res.status(200).json({
                details: "Emails Delivered Successfully"
            });
        })
        .catch((err) => {
            res.status(400).json({
                details: "An error occurred"
            });
        });
})

app.post("/send-bulk-sms/", (req, res) => {
    const smses = req.body.recipients.map((recipient) => ({
        key: SMSNOTIFY_API_KEY,
        to: recipient,
        msg: req.body.body,
        sender_id: SMSNOTIFY_SENDER_ID
    }));

    each(smses, sendSMS, function(err) {
        if(err) {
            console.log(err);
            res.status(400).json({
                details: "An error occurred"
            });
        } else {
            res.status(200).json({
                details: "SMSs delivered successfully"
            });
        }
    });
})

exports.api = functions.https.onRequest(app);