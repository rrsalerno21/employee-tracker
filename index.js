const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const config = require('./private/config');
const util = require('util');

function makeDb() {
    const connection = mysql.createConnection(config);

    console.log('Connection successful at ' + config.port);

    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end)
                .call(connection)
        }
    };
};

const db = makeDb(config);

