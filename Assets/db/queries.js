/* View All Employees Query */
const queries = {
	viewAllEmployees: 
		`SELECT
			eT.id AS 'Emp. #',
			eT.first_name AS 'First Name',
			eT.last_name AS 'Last Name',
			role.title AS 'Role',
			department.name AS 'Department',
			role.salary AS 'Salary',
			CONCAT(mT.first_name, ' ', mT.last_name) AS 'Manager'
		FROM
			employee AS eT
		LEFT JOIN employee AS mT ON (eT.manager_id = mT.id)
		INNER JOIN role ON (eT.role_id = role.id)
		INNER JOIN  department ON (department.id = role.department_id)
		ORDER BY eT.id`,

	viewAllEmployeesByDepartment: 
		`SELECT
			department.id AS 'Dept ID',
			department.name AS 'Department',
			eT.first_name AS 'First Name',
			eT.last_name AS 'Last Name',
			role.title AS 'Role',
			et.id AS 'Emp. #',
			role.salary AS 'Salary',
			CONCAT(mT.first_name, ' ', mT.last_name) AS 'Manager'
		FROM
			employee AS eT
		LEFT JOIN employee AS mT ON (eT.manager_id = mT.id)
		INNER JOIN role ON (eT.role_id = role.id)
		INNER JOIN  department ON (department.id = role.department_id)
		ORDER BY department.name`,
	
	viewAllEmployeesByManager: 
		`SELECT
			CONCAT(mT.first_name, ' ', mT.last_name) AS 'Manager',
			eT.id AS 'Emp. #',
			eT.first_name AS 'First Name',
			eT.last_name AS 'Last Name',
			role.title AS 'Role',
			department.name AS 'Department',
			role.salary AS 'Salary'
		FROM
			employee AS eT
		LEFT JOIN employee AS mT ON (eT.manager_id = mT.id)
		INNER JOIN role ON (eT.role_id = role.id)
		INNER JOIN  department ON (department.id = role.department_id)
		ORDER BY Manager`,

	viewAllRoles:
		`SELECT 
			role.id AS 'Role #',
			role.title 'Title',
			role.salary AS 'Salary',
			department.name AS 'Department'
		FROM 
			role
		LEFT JOIN department ON (role.department_id = department.id)`,
	curEmployees: 
		`SELECT DISTINCT
            id,
            CONCAT(first_name, ' ', last_name) AS 'name'
        FROM 
			employee`,
	curRoles:
		`SELECT DISTINCT
			id,
			title
		FROM 
			role`,
	viewAllDepartments:
		`SELECT 
			id AS 'Dept #', 
			name AS 'Department' 
		FROM department`
}

module.exports = queries;