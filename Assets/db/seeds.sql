INSERT INTO employee
VALUES (01, 'Rocky', 'Salerno', 01, null);

INSERT INTO employee
VALUES (02, 'Hannah', 'Salerno', 01, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sam', 'Smith', 01, 02);

INSERT INTO role
VALUES (01, 'Software Engineer', 120000, 01);

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Rep', 75000, 02);

INSERT INTO department
VALUES (01, 'Engineering');

INSERT INTO department (name)
VALUES ('Sales');
