const fs = require('fs')
const shelljs = require('shelljs')
const readline = require('readline')

const PROP_REGEX = /^(.*?)=(.*)$/;
const ENCRYPTED_PROP_REGEX = /^(.*?)=ENC\((.*)\)$/;

const processLinesFromStdIn = (callback) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line){
        callback([line]);
    })
}

/**
 * @param filename Omit this parameter to work just with standard input/output
 * @param overwriteFile
 * @param processLines
 */
const processFileOrProcessStdInToStdOut = ({filename, overwriteFile}, processLines) => {
    if (filename != null) {
        const lines = fs.readFileSync(filename, 'utf8').split('\n')
        if (overwriteFile) {
            fs.writeFileSync(filename, processLines(lines))
        } else {
            console.log(processLines(lines))
        }
    }
    if (filename == null) {
        processLinesFromStdIn(lines =>
            console.log(processLines(lines))
        )
    }
}

const extractPropertyName = propertyLine => propertyLine.match(PROP_REGEX)
    ? propertyLine.match(PROP_REGEX)[1]
    : null

const extractPropertyValue = propertyLine => propertyLine.match(PROP_REGEX)
    ? propertyLine.match(PROP_REGEX)[2]
    : null

const extractEncryptedString = propertyLine => propertyLine.match(ENCRYPTED_PROP_REGEX)
    ? propertyLine.match(ENCRYPTED_PROP_REGEX)[2]
    : null

const applyJasypt = (command, input, password) => {
    const jasyptExecutable = `${__dirname}/jasypt-1.9.3/bin/${command}.sh`
    const execution = shelljs.exec(
        `${jasyptExecutable} input="${input}" \
    verbose="false"  \
    password="${password}"  \
    algorithm="PBEWITHHMACSHA256ANDAES_256"  \
    ivGeneratorClassName="org.jasypt.iv.RandomIvGenerator" \
    `, {silent:true})
    if (execution.code !== 0) {
        console.error(execution.stderr)
        process.exit(1)
    }
    return execution.replace(/\n$/, "")
}

module.exports = {
    processFileOrProcessStdInToStdOut,
    extractPropertyName,
    extractPropertyValue,
    extractEncryptedString,
    applyJasypt
}