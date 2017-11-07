
const fs = require('fs');

const chalk = require('chalk');

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

function filterString(unfilteredString) {
    let string;
    if (unfilteredString instanceof Error) {
        string = unfilteredString.stack;
    } else {
        string = unfilteredString.toString();
    }
    return string;
}

function printToConsole(timestamp, level, unfilteredString) {
    const string = filterString(unfilteredString);
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

function appendToFile(path) {
    return function(timestamp, level, unfilteredString) {
        const string = filterString(unfilteredString);
        const log = `${timestamp} ${level} ${string}\n`;
        fs.appendFile(path, log, (error) => {  
            if (error) {
                throw error;
            }
        });
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

    this.error = function(string) {
        const timestamp = getTimestamp();
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'ERROR', string);
        }
        files.forEach(func => func(timestamp, 'ERROR', string));
    }
    this.warn = function (string) {
        const timestamp = getTimestamp();
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'WARN', string);
        }
        files.forEach(func => func(timestamp, ' WARN', string));
    }
    this.info = function (string) {
        const timestamp = getTimestamp();
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'INFO', string);
        }
        files.forEach(func => func(timestamp, ' INFO', string));
    }
    this.debug = function(string) {
        const timestamp = getTimestamp();
        if (shouldPrintToConsole) {
            printToConsole(timestamp, 'DEBUG', string);
        }
        files.forEach(func => func(timestamp, 'DEBUG', string));
    }
    this.trace = function(string) {
        const timestamp = getTimestamp();
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
