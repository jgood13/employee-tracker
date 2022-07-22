INSERT INTO department (name)
VALUES ('engineering'),
       ('sales'),
       ('marketing'),
       ('IT'),
       ('accounting');

INSERT INTO roles (title, salary, department_id)
VALUES ('engineer', 80000, 1),
       ('sales rep', 50000, 2),
       ('product manager', 65000, 3),
       ('marketing assistant', 45000, 3),
       ('IT specialist', 60000, 4),
       ('accountant', 70000, 5),
       ('accounting manager', 95000, 5);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ('Dennis', 'Reynolds', 3, NULL),
       ('Frank', 'Reynolds', 7, NULL),
       ('Dee', 'Reynolds', 2, 1),
       ('Charlie', 'Kelly', 6, 2),
       ('The', 'Waitress', 4, 1)