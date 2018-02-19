# Mailinator

> **NOTE** Still very much in the beta phase!

Mailinator is a Lambda function for sending mail using various mail services.

Supported
    - "smtp"
    - "mailgun"
    - "mandrill"
    - "ses"
    - "sparkpost"

## Prerequisites

You will require access to an aws account from the client.

## Installation

**Clone down this repository** and navigate inside of the project, while mailinator supports different drivers **you will need to pull in the respected driver transformer** see below for a [list of transporters](#transporters).

Next depends on how you want to implement the mailinator for [netlify click here](#netlify) otherwise for a [AWS api gateway click here](#aws-gateway)

## <a name="aws-gateway"></a>AWS Api Gateway Lambda Proxy



## <a name="netlify"></a>Netlify Implementation

Create a folder named `functions` in the root of your project.

In your `netlify.toml` file create a `lambda` field like so: 
```
[build]
  functions = "./lambda"
```

Add `node_modules, mailinator.js, package.json & package-lock.json` to the new `lambda` folder

Ensure node_modules is pushed up with source control as it contains all of the packages needed to make the mail request.

## <a name="transporters"></a>Driver Transformers

**Mailgun**
```bash
npm install --save nodemailer-mailgun-transport
```

**Mandrill**
```bash
npm install --save nodemailer-mandrill-transport
```

**SES**
```bash
npm install --save nodemailer-ses-transport
```

**Sparkpost**
```bash
npm install --save nodemailer-sparkpost-transport
```









### Mailgun

Navigate inside of the repository and run the following command:



Inside of `mail.js` file update the driver and from properties to match your needs finally add the correct mailgun domain and api key.

```js
module.exports = {
    "driver": "mailgun",
    "from": {
        "address": "hello@example.com",
        "name": "Example"
    },
    "mailgun": {
        "domain": "your-mailgun-domain",
        "secret": "your-mailgun-key"
    },
}
```

#### Mailgun






### Netlify





