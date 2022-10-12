const fs = require('fs')
const yargs = require('yargs/yargs')
const t = require('./tools')

const argv = yargs(process.argv.slice(2))
    .option('current-password', {
        alias: 'c',
        description: 'the current password',
    })
    .option('new-password', {
        alias: 'n',
        description: 'the new password',
    })
    .option('file', {
        alias: 'f',
        description: 'the property file to modify (if not specified: read from stdin and write to stdout)'
    })
    .demandOption(['current-password', 'new-password'])
    .example('$0 -f configuration.properties -c foobar123 -n batbaz234', 'modify `configuration.properties`, re-encrypting values that were encrypted with the password `foobar123` using the new password `batbaz234`')
    .help()
    .argv;


const decryptString = encryptedString => t.applyJasypt('decrypt', encryptedString, argv['current-password'])

const encryptString = string => t.applyJasypt('encrypt', string, argv['new-password'])

const processLines = lines => lines
    .map(propLine => ({
        encryptedString: t.extractEncryptedString(propLine),
        propertyName: t.extractPropertyName(propLine),
        propertyValue: t.extractPropertyValue(propLine),
        wholeLine: propLine,
    }))
    .map(prop => ({
        ...prop,
        decryptedString: prop.encryptedString != null ? decryptString(prop.encryptedString) : null
    }))
    .map(prop => ({
        ...prop,
        newEncryptedString: prop.decryptedString != null ? encryptString(prop.decryptedString) : null
    }))
    .map(prop => prop.propertyName != null
        ? prop.encryptedString != null
            ? `${prop.propertyName}=ENC(${prop.newEncryptedString})`
            : `${prop.propertyName}=${prop.propertyValue}`
        : prop.wholeLine
    )
    .join('\n')

t.processFileOrProcessStdInToStdOut({filename: argv.file, overwriteFile: true}, processLines)
