#!/usr/bin/env node
const yargs = require('yargs/yargs')
const t = require('./tools')
const readlineSync = require("readline-sync");

const argv = yargs(process.argv.slice(2))
    .option('password', {
        alias: 'p',
        description: 'the password to use for the encryption (if not provided, will prompt)',
    })
    .option('properties', {
        description: 'a comma separated list of the property keys you want to encrypt',
        alias: 'P',
    })
    .option('file', {
        alias: 'f',
        description: 'the property file to modify (if not specified: read from standard input and write to standard output)'
    })
    .demandOption(['properties'])
    .example('$0 -f configuration.properties -p foobar123 -P secret_prop,secret_url', 'modify `configuration.properties`, with the values of `secret_prop` and `secret_url` encrypted using the password `foobar123`')
    .help()
    .argv;

const password = argv['password'] || readlineSync.question('Enter password: ', {hideEchoBack:true})

const encryptString = string => {
    const escapedString = JSON.stringify(string);
    const escapedStringWithoutSurroundingQuotes = escapedString.substring(1, escapedString.length - 1)
    return t.applyJasypt('encrypt',  escapedStringWithoutSurroundingQuotes, password)
}

t.processFileOrProcessStdInToStdOut({filename: argv.file, overwriteFile: true}, lines =>
    lines.map(propLine => ({
        propertyName: t.extractPropertyName(propLine),
        propertyValue: t.extractPropertyValue(propLine),
        wholeLine: propLine,
    }))
        .map(prop => ({
            ...prop,
            newValue: argv['properties'].split(',').includes(prop.propertyName) ? `ENC(${encryptString(prop.propertyValue)})` : null
        }))
        .map(prop => prop.propertyName != null && prop.newValue != null
            ? `${prop.propertyName}=${prop.newValue}`
            : prop.wholeLine
        )
        .join('\n')
)
