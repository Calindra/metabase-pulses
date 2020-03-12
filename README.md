### Metabase Pulses

Send metabase pulses exactly as they're shown! This workaround a current metabase limitation due different render engines between the browser (view engine) and the server (pulses engine).

This is a temporary project and should be considered obsolete when the following issue is implemented: [Different chart rendered in pulse from question](https://github.com/metabase/metabase/issues/5493)

### Getting started 

Complete the file config/default.json with your metabase and SMTP information.

```json
{
    "smtp": {
        "host": "smtpHost",
        "user": "smtpUser",
        "password": "smtpPassword"
    },
    "metabase": {
        "url": "metabaseUrl",
        "user": "metabaseUser",
        "password": "metabasePassword"
    }
}
```

Use pulses.json file as template to define the pulses you want to send and to whom. You can define a list of pulses.

```json
[{
    "mailTo":"email@host.com, anotheremail@host.com",
    "questionIds" : [ "17", "21" ],
    "subject": "Pulses: weekly report"
}]
```

Then you can run it...
```
npm install
node index.js pulses.json
```

and set a cron tab using "crontab -e" command

```
SHELL=/bin/bash
HOME=/home/ubuntu/pulses
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

0 11 * * * node index.js pulses.json  > /homedir/pulses.log 2>&1
```

