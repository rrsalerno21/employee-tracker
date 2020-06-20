/* View All Employees Query */
const queries = {
	viewAllEmployees: 
		`SELECT
			eT.id,
			eT.first_name,
			eT.last_name,
			role.title,
			department.name AS 'Department',
			role.salary,
			CONCAT(mT.first_name, ' ', mT.last_name) AS 'Manager'
		FROM
			employee AS eT
		LEFT JOIN employee AS mT ON (eT.manager_id = mT.id)
		INNER JOIN role ON (eT.role_id = role.id)
		INNER JOIN  department ON (department.id = role.department_id)`,
	viewAllEmployeesByManager: ``,
		
}