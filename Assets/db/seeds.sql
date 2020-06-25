-- DEPARTMENTS

INSERT INTO department (name)
VALUES ('Executive');

INSERT INTO department (name)
VALUES ('Finance and Accounting');

INSERT INTO department (name)
VALUES ('Engineering');

INSERT INTO department (name)
VALUES ('Product');

INSERT INTO department (name)
VALUES ('Marketing');

INSERT INTO department (name)
VALUES ('Sales');

INSERT INTO department (name)
VALUES ('Customer Success');

-- ROLES

INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 200000, 01);

INSERT INTO role (title, salary, department_id)
VALUES ('CFO', 175000, 02);

INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 90000, 02);

INSERT INTO role (title, salary, department_id)
VALUES ('VP of Engineering', 150000, 03);

INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 100000, 03);

INSERT INTO role (title, salary, department_id)
VALUES ('QA Engineer', 75000, 03);

INSERT INTO role (title, salary, department_id)
VALUES ('VP of Product', 150000, 04);

INSERT INTO role (title, salary, department_id)
VALUES ('Product Manager', 100000, 04);

INSERT INTO role (title, salary, department_id)
VALUES ('VP of Marketing', 120000, 05);

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Engineer', 120000, 05);

INSERT INTO role (title, salary, department_id)
VALUES ('VP of Sales', 120000, 06);

INSERT INTO role (title, salary, department_id)
VALUES ('SDR', 45000, 06);

INSERT INTO role (title, salary, department_id)
VALUES ('VP of Customer Success', 40000, 07);

INSERT INTO role (title, salary, department_id)
VALUES ('Account Manager', 50000, 07);

-- EMPLOYEES

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Rocky', 'Salerno', 01, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Andrew', 'Beeler', 02, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Brad', 'Smith', 03, 02);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chris', 'Chang', 04, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dick', 'Ronald', 05, 04);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Erin', 'Hall', 06, 04);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Frank', 'Gomez', 07, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Greg', 'Kennedy', 08, 07);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Harold', 'Donally', 09, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ian', 'Albert', 10, 09);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jim', 'Yang', 11, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kim', 'Chang', 12, 11);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Lee', 'Gonzalez', 13, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert', 'Sanchez', 14, 13);