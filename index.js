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
                addEmp();
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

async function addEmp() {
    try {
        const curEmployees = await returnQuery(`
            SELECT DISTINCT
                id,
                CONCAT(first_name, ' ', last_name) AS 'name'
            FROM 
                employee
        `);

        const curRoles = await returnQuery(`
            SELECT DISTINCT
                id,
                title
            FROM 
                role
        `);

        let roles = [], managers = [];

        for (i in curEmployees) {
            managers.push(curEmployees[i].name);
        };

        for (i in curRoles) {
            roles.push(curRoles[i].title);
        };

        console.log(roles),
        console.log(managers)
        const result = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: `What is the employee's first name?`
            },
            {
                type: 'input',
                name: 'last_name',
                message: `What is the employee's last name?`
            },
            {
                type: 'list',
                name: 'role',
                message: `What is the employee's role?`,
                choices: roles
            },
            {
                type: 'list',
                name: `manager`,
                message: `Who is the manager for this employee?`,
                choices: [...managers, 'No Manager']
            }
        ]

        );

        // handle the no manager case
        let finalManagerId, roleID;
        if (result.manager === 'No Manager') {
            finalManagerId = null; 
        } else {
            for (i in curEmployees) {
                if (curEmployees[i].name === result.manager) {
                    finalManagerId = curEmployees[i].id;
                    break;
                }
            }
        };

        // find and set the correct role ID
        for (i in curRoles) {
            if (curRoles[i].title === result.role) {
                roleID = curRoles[i].id;
            }
        }

        // insert add code here
        const addQuery = await db.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${result.first_name}', '${result.last_name}', ${roleID}, ${finalManagerId})`)

        console.log(colors.bold.green(`\n${result.first_name} ${result.last_name} added to employee list\n`));

    } catch (error) {
        if (error) throw error;
    } finally {
        start();
    }
    
}

start();