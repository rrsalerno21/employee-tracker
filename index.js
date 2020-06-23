const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const config = require('./private/config');
const util = require('util');
const colors = require('colors');
const queries = require('./Assets/db/queries');

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
    try {
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
                        'Remove Role',
                        'Exit'
                    ]
                }
            ]
        );
        
        let data;

        switch (startResponse.operation) {
            case 'View All Employees':
                data = await returnQuery(queries.viewAllEmployees);
                consoleTable('All Employees', data);
                break;
            case 'View All Employees by Department':
                data = await returnQuery(queries.viewAllEmployeesByDepartment);
                consoleTable('All Employees by Department', data);
                break;
            case 'View All Employees by Manager':
                data = await returnQuery(queries.viewAllEmployeesByManager);
                consoleTable('All Employees by Manager', data);
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
                data = await returnQuery(queries.viewAllRoles);
                consoleTable('All Roles', data);
                break;
            case 'Add Role':
                //
                break;
            case 'Remove Role':
                //
                break;
            case 'Exit':
                db.close();
        }
    } catch (error) {
        throw error;
    }
};

// return query function
async function returnQuery(query) {
    try {
        const curQuery = await db.query(query);
        console.log(curQuery);
        return curQuery;
    } catch (error) {
        throw error;
    }
}

async function consoleTable(title, data) {
    try {
        // for creating a table
        if (data.length === 0) {
            console.log(`-------------- \n${colors.bold.red('\nThere is currently no data to display.  Add data to get started!')}\n`)
        } else {
            console.log(`-------------- \n${colors.bold(title)}\n`)
            console.table(data);
            //console.log(`=> ${colors.blue(query[index].item_name)} (Bid:$${query[index].highest_bid})\n`);
        };
    } catch (error) {
        throw error;
    } finally {
        start();
    }
}



start();