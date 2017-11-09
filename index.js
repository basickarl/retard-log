
const fs = require('fs');
const path = require('path');

const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

function getTimestamp() {
    const date = new Date();

    let year = date.getFullYear().toString();

    let month = (date.getMonth() + 1).toString();
    if (month.length === 1) {
        month = `0${month}`;
    }

    let day = date.getDate().toString();
    if (day.length === 1) {
        day = `0${day}`;
    }

    let hours = date.getHours().toString();
    if (hours.length === 1) {
        hours = `0${hours}`;
    }

    let minutes = date.getMinutes().toString();
    if (minutes.length === 1) {
        minutes = `0${minutes}`;
    }

    let seconds = date.getSeconds().toString();
    if (seconds.length === 1) {
        seconds = `0${seconds}`;
    }

    let offsetUTC = (date.getTimezoneOffset() / 60);
    if (offsetUTC > 0) {
        offsetUTC = `-${offsetUTC}`;
    } else {
        offsetUTC = `+${(offsetUTC * -1)}`;
    }

    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC${offsetUTC}`;
    return timestamp;
}

function formatArguments(arguments) {
    const string = arguments.reduce((string, argument) => {
        let newString

        if (string === '') {
            newString = string;
        } else {
            newString = `${string} `;
        }

        if (argument === undefined) {
            newString += undefined;
        } else if (argument === null) {
            newString += argument;
        } else if (argument.constructor === Array) {
            newString += argument.toString();
        } else if (argument.constructor === String) {
            newString += argument;
        } else if (argument.constructor === Number) {
            newString += argument.toString();
        } else if (argument.constructor === Boolean) {
            newString += argument.toString();
        } else if (argument.constructor === Error) {
            newString += argument.stack;
        }

        return newString;
    }, '');

    return string;
}

function printToConsole(timestamp, level, string) {
    let log;
    if (level === 'ERROR') {
        log = `${chalk.grey(timestamp)}  ${chalk.bgBlack(chalk.redBright(chalk.bold(level)))} ${string}\n`;
    } else if (level === 'WARN') {
        log = `${chalk.grey(timestamp)}   ${chalk.bgYellow(chalk.black(chalk.bold(level)))} ${string}\n`;
    } else if (level === 'INFO') {
        log = `${chalk.grey(timestamp)}   ${chalk.white(chalk.bold(level))} ${string}\n`;
    } else if (level === 'DEBUG') {
        log = `${chalk.grey(timestamp)}  ${chalk.cyan(level)} ${string}\n`;
    } else if (level === 'TRACE') {
        log = `${chalk.grey(timestamp)}  ${chalk.green(level)} ${string}\n`;
    }

    process.stdout.write(log);
}

function appendToFile(relativePath) {
    const absolutePath = path.resolve(relativePath);
    return function(timestamp, level, string) {
        const strippedString = stripAnsi(string);
        const log = `${timestamp} ${level} ${strippedString}\n`;
        fs.appendFileSync(absolutePath, log);
    }
}

const Retardlog = function(options) {
    let shouldPrintToConsole = false;
    let files = [];

    options.map((option) => {
        if (option.type === 'console') {
            shouldPrintToConsole = true;
        } else if (option.type === 'file') {
            files.push(appendToFile(option.path));
        }
    });

    this.error = function(...arguments) {
        const timestamp = getTimestamp();
        const string = formatArguments(arguments);
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'ERROR', string);
        }
        files.forEach(func => func(timestamp, 'ERROR', string));
    }
    this.warn = function (...arguments) {
        const timestamp = getTimestamp();
        const string = formatArguments(arguments);
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'WARN', string);
        }
        files.forEach(func => func(timestamp, ' WARN', string));
    }
    this.info = function (...arguments) {
        const timestamp = getTimestamp();
        const string = formatArguments(arguments);
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'INFO', string);
        }
        files.forEach(func => func(timestamp, ' INFO', string));
    }
    this.debug = function(...arguments) {
        const timestamp = getTimestamp();
        const string = formatArguments(arguments);
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'DEBUG', string);
        }
        files.forEach(func => func(timestamp, 'DEBUG', string));
    }
    this.trace = function(...arguments) {
        const timestamp = getTimestamp();
        const string = formatArguments(arguments);
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'TRACE', string);
        }
        files.forEach(func => func(timestamp, 'TRACE', string));
    }
};

module.exports = {
    create: (options) => {
        return new Retardlog(options);
    },
}
