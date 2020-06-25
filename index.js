const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const config = require('./private/config');
const util = require('util');
const colors = require('colors');
const queries = require('./Assets/db/queries');

// function to create database connection
// and return promises for close and query methods
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

// Create database 'db'
const db = makeDb(config);

// function to start node app
async function start() {
    try {
        // initial prompt to user
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
                        'View All Departments',
                        'Add Department',
                        'Remove Department',
                        'View All Roles',
                        'Add Role',
                        'Remove Role',
                        'Exit'
                    ]
                }
            ]
        );
        
        // declare variable for db queries depending on user's response
        let data;
        
        // switch statement for each case
        switch (startResponse.operation) {
            case 'View All Employees':
                // get query result for viewAllEmployees
                data = await db.query(queries.viewAllEmployees);

                // console.log a table
                consoleTable('All Employees', data);
                break;
            case 'View All Employees by Department':
                data = await db.query(queries.viewAllEmployeesByDepartment);
                consoleTable('All Employees by Department', data);
                break;
            case 'View All Employees by Manager':
                data = await db.query(queries.viewAllEmployeesByManager);
                consoleTable('All Employees by Manager', data);
                break;
            case 'Add Employee':
                addEmp();
                break;
            case 'Remove Employee':
                removeData('employee');
                break;
            case 'Update Employee Role':
                updateData('role');
                break;
            case 'Update Employee Manager':
                updateData('manager');
                break;
            case 'View All Departments':
                data = await db.query(queries.viewAllDepartments);
                consoleTable('All Departments', data);
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Remove Department':
                removeData('department');
                break;
            case 'View All Roles':
                data = await db.query(queries.viewAllRoles);
                consoleTable('All Roles', data);
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Remove Role':
                removeData('role');
                break;
            case 'Exit':
                db.close();
        }
    } catch (error) {
        throw error;
    }
};

// function to log data to console in table format
async function consoleTable(title, data) {
    try {
        // check to see if there's any data
        if (data.length === 0) {
            // if not, notify user
            console.log(`-------------- \n${colors.bold.red('\nThere is currently no data to display.  Add data to get started!')}\n`)
        } else {
            // if data exists, then console.log the title and the table
            console.log(`-------------- \n${colors.bold(title)}\n`)
            console.table(data);
            //console.log(`=> ${colors.blue(query[index].item_name)} (Bid:$${query[index].highest_bid})\n`);
        };
    } catch (error) {
        throw error;
    } finally {
        // start the app once completed
        start();
    }
}

// function to add Employee to table
async function addEmp() {
    try {
        // get current employee id's and names
        const curEmployees = await db.query(queries.curEmployees);

        // get current role id's and titles
        const curRoles = await db.query(queries.curRoles);

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

async function addRole() {
    try {
        const deptQuery = await db.query('SELECT id, name FROM department');

        let deptArray = [];
        for (i in deptQuery) {
            deptArray.push(deptQuery[i].name);
        }

        const response = await inquirer.prompt([
            {
                type:'input',
                name: 'roleName',
                message: `What is the name of the role you'd like to add?`
            },
            {
                type:'number',
                name: 'salary',
                message: `What is the salary for this role?`
            },
            {
                type:'list',
                name: 'department',
                message: `What department does this role belong to?`,
                choices: deptQuery
            }
        ]);

        let deptID;
        for (i in deptQuery) {
            if (response.department === deptQuery[i].name) {
                deptID = deptQuery[i].id;
            }
        }

        console.log(deptID);

        const addRoleQuery = await db.query(
            `INSERT INTO role (title, salary, department_id) 
            VALUES ('${response.roleName}', '${response.salary}', ${deptID})`);
        
        console.log(colors.bold.green(`\n${response.roleName} successfully added to roles.\n`));    

    } catch (error) {
        throw error;
    } finally {
        start();
    }
}

async function addDepartment() {
    try {
        const response = await inquirer.prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?'
            }
        ])

        const addDeptQuery = await db.query(`INSERT INTO department (name) VALUES ('${response.department}')`)

        console.log(colors.bold.green(`\n${response.department} department successfully added\n`))
    } catch (error) {
        throw error
    } finally {
        start();
    }
}

async function removeData(type) {
    if (type === 'employee') {
        try {
            const curEmployees = await db.query(queries.curEmployees);

            let empNames = [];
            for (i in curEmployees) {
                empNames.push(curEmployees[i].name);
            };

            const response = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'whoToRemove',
                    message: 'Which employee would you like to remove?',
                    choices: empNames
                }
            ]);

            let delId;

            for (i in curEmployees) {
                if (curEmployees[i].name === response.whoToRemove) {
                    delId = curEmployees[i].id;
                }
            }

            const delEmpQuery = await db.query(`DELETE FROM employee WHERE id = ${delId}`)

            console.log(colors.bold.green(`\n${response.whoToRemove} removed from employee list\n`));

        } catch (error) {
            throw error;
        } finally {
            start();
        }

    } else if (type === 'role') {
        try {
            const curRoles = await db.query(queries.curRoles);

            let roleTitles = [];
            for (i in curRoles) {
                roleTitles.push(curRoles[i].title);
            };

            const response = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleToRemove',
                    message: 'Which role would you like to remove?',
                    choices: roleTitles
                }
            ]);

            let delId;

            for (i in curRoles) {
                if (curRoles[i].title === response.roleToRemove) {
                    delId = curRoles[i].id;
                }
            }

            const delEmpQuery = await db.query(`DELETE FROM role WHERE id = ${delId}`);

            console.log(colors.bold.green(`\n${response.roleToRemove} removed from role list\n`));

        } catch (error) {
            throw error;
        } finally {
            start();
        }
    } else if (type === 'department') {
        try {
            const deptQuery = await db.query('SELECT id, name FROM department');
            let deptArray = [];
            for (i in deptQuery) {
                deptArray.push(deptQuery[i].name)
            };

            const deptResponse = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: `Which department would you like to remove?`,
                    choices: deptArray
                }
            ])

            let deptID;
            for (i in deptQuery) {
                if (deptQuery[i].name === deptResponse.department) {
                    deptID = deptQuery[i].id;
                    break;
                }
            }

            const delDeptQuery = await db.query(`DELETE FROM department WHERE id = ${deptID}`);
            console.log(colors.bold.green(`\n${deptResponse.department} removed from department list\n`));

        } catch (error) {
            throw error;
        } finally {
            start();
        }
    }
}

async function updateData(detail) {
    try {
        const curEmployees = await db.query(queries.curEmployees);
        
        let empArray = [];
        for (i in curEmployees) {
            empArray.push(curEmployees[i].name);
        }
        
        const response = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: empArray
            }
        ]);
        
        let empID;
        for (i in curEmployees) {
            if (curEmployees[i].name === response.employee) {
                empID = curEmployees[i].id;
                break;
            }
        }

        switch (detail) {
            case 'role':
                const curRoles = await db.query(queries.curRoles);
                rolesArray = [];
                for (i in curRoles) {
                    rolesArray.push(curRoles[i].title);
                }

                const roleResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'newRole',
                        message: 'Which role would you like to reassign this employee to?',
                        choices: rolesArray
                    }
                ]);

                let newRoleID;
                for (i in curRoles) {
                    if (curRoles[i].title === roleResponse.newRole) {
                        newRoleID = curRoles[i].id;
                        break;
                    }
                }
                console.log(newRoleID);

                const updateRoleQuery = await db.query('UPDATE employee SET ? WHERE ?', [{role_id: newRoleID},{id: empID}])

                console.log(colors.bold.green(`\n ${response.employee} role successfully updated. \n`))
                break;
            case 'manager':
                const filteredEmpArray = empArray.filter(item => item != response.employee)
                const managerResponse = await inquirer.prompt([
                    {
                        type: 'list',
                        name: `manager`,
                        message: `Who is the new manager for this employee?`,
                        choices: [...filteredEmpArray, 'No Manager']
                    }
                ]);

                let finalManagerId;
                if (managerResponse.manager === 'No Manager') {
                    finalManagerId = null; 
                } else {
                    for (i in curEmployees) {
                        if (curEmployees[i].name === managerResponse.manager) {
                            finalManagerId = curEmployees[i].id;
                            break;
                        }
                    }
                };

                const updateManagerQuery = await db.query('UPDATE employee SET ? WHERE ?', [{manager_id: finalManagerId},{id: empID}])

                console.log(colors.bold.green(`\n ${response.employee}'s manager successfully updated to ${managerResponse.manager}. \n`))
            }

    } catch (error) {
        throw error;
    } finally {
        start();
    }
}

start();