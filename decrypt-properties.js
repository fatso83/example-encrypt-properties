const yargs = require('yargs/yargs')
const t = require('./tools')
const readlineSync = require('readline-sync')

const argv = yargs(process.argv.slice(2))
    .option('password', {
        alias: 'p',
        description: 'the password used to encrypt the property file (if not specified, the script will prompt for it)',
    })
    .option('file', {
        alias: 'f',
        description: 'the property file to decrypt (if not specified: read from standard input)'
    })
    .example('$0 -p foobar123 -f configuration.properties', 'output all lines of configuration.properties with any encrypted lines decrypted using the password `foobar123`')
    .demandOption([])
    .help()
    .argv;

const password = argv['password'] || readlineSync.question('Enter password: ', {hideEchoBack:true})
const decryptString = encryptedString => t.applyJasypt('decrypt', encryptedString, password)

t.processFileOrProcessStdInToStdOut({filename: argv['file'], overwriteFile: false}, lines =>
    lines
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
        .map(prop => prop.propertyName != null
            ? prop.encryptedString != null
                ? `${prop.propertyName}=${prop.decryptedString}`
                : `${prop.propertyName}=${prop.propertyValue}`
            : prop.wholeLine
        )
        .join('\n')
)