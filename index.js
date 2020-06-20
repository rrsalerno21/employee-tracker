const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const config = require('./private/config');
const util = require('util');
const colors = require('colors');

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

async function start() {
    const startResponse = await inquirer.prompt(
        [
            {
                type: 'list',
                name: 'operation',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Employees by Department',
                    'View All Employees by Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'Add Role',
                    'Remove Role'
                ]
            }
        ]
    );

    switch (startResponse.operation) {
        case 'View All Employees':
            //
            break;
        case 'View All Employees by Department':
            //
            break;
        case 'View All Employees by Manager':
            //
            break;
        case 'Add Employee':
            //
            break;
        case 'Remove Employee':
            //
            break;
        case 'Update Employee Role':
            //
            break;
        case 'Update Employee Manager':
            //
            break;
        case 'View All Roles':
            //
            break;
        case 'Add Role':
            //
            break;
        case 'Remove Role':
            //
            break;
    }
};


