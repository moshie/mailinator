"use strict";

const nodemailer = require('nodemailer')

/**
 * Configuration
 */
const { from, driver, smtp, mailgun, mandrill, ses, sparkpost } = {

    // Mail Driver
    "driver": process.env.MAIL_DRIVER || "smtp", // "smtp", "mailgun", "mandrill", "ses", "sparkpost"

    // From Address and Name
    "from": {
        "address": process.env.MAIL_FROM_ADDRESS || "hello@example.com",
        "name": process.env.MAIL_FROM_NAME || "Example"
    },

    "smtp": {
        "host": process.env.MAIL_HOST || "smtp.mailgun.org",
        "port": 587,
        "auth": {
            "username": process.env.MAIL_USERNAME || "your-smtp-username",
            "password": process.env.MAIL_PASSWORD || "your-smtp-password"
        }
    },

    "mailgun": {
        "domain": process.env.MAILGUN_DOMAIN || "your-mailgun-domain",
        "secret": process.env.MAILGUN_SECRET || "your-mailgun-key"
    },

    "mandrill": {
        "secret": process.env.MANDRILL_SECRET || "your-mandrill-key"
    },

    "ses": {
        "key": process.env.SES_KEY || "your-ses-key",
        "secret": process.env.SES_SECRET || "your-ses-secret",
        "region": process.env.SES_REGION
    },

    "sparkpost": {
        "secret": process.env.SPARKPOST_SECRET || "your-sparkpost-key"
    }

}

/**
 * Get the Transporter
 */
function getTransport() {

    const drivers = {

        smtp,

        mailgun: {
            auth: {
                api_key: mailgun.secret,
                domain: mailgun.domain
            }
        },

        mandrill: { 
            auth: {
                apiKey: mandrill.secret
            }
        },

        ses: {
            accessKeyId: ses.key,
            secretAccessKey: ses.secret,
            region: ses.region
        },

        sparkpost: {
            sparkPostApiKey: sparkpost.secret
        }

    };

    var transporter = drivers[driver];

    if (driver !== 'smtp') {
        transporter = require(`nodemailer-${driver}-transport`)(drivers[driver])
    }

    return nodemailer.createTransport(transporter);
}

/**
 * Check if data is parsable to json
 * 
 * @param {mixed} data
 */
function isJson (data) {
    if (typeof data === 'undefined' || typeof data === 'object') {
        return data;
    }

    try {
        return JSON.parse(data);
    } catch (e) {
        return false;
    }
}

/**
 * Get the Response object
 * 
 * @param {Object} obj
 */
function respond (obj = {}) {
    return Object.assign({}, {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success'
        }),
        headers: {
            "Access-Control-Allow-Origin": process.env.CORS || "*",
            "Access-Control-Allow-Credentials": true,
            "Content-Type": "application/json"
        }
    }, obj);
}

/**
 * Lambda function export
 * 
 * @param {Object} event 
 * @param {Object} context 
 * @param {Function} callback 
 */
exports.handler = function(event, context, callback) {

    console.log('IS THIS EVEN RUNNING?');

    context.callbackWaitsForEmptyEventLoop = false;

    var data = isJson(event.body) || {};

    if (data.hasOwnProperty('from')) {
        delete data.from;
    }

    const sendData = Object.assign({ from }, data);

    getTransport().sendMail(sendData, (error, info) => {
        if (error) {
            return callback(null, respond({
                statusCode: 500,
                body: JSON.stringify({
                    message: error.message
                })
            }));
        }

        callback(null, respond({
            statusCode: 200,
            body: JSON.stringify(info)
        }));
    });

};