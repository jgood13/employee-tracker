const inquirer = require('inquirer')
const connection = require('./config/connection')
const mysql = require('mysql2')

const mainMenu = () =>{

  inquirer.prompt({
      message: "Choose what you would like to do.",
      type: 'list',
      name: 'userPrompt',
      choices: ['View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee',
        'Exit',]
  },
  )
  .then(answer => {
    switch (answer.userPrompt) {
        case 'View all departments':
            viewDepts();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all Employees':
            viewEmps();
            break;
        case 'Add a department':
            addDept();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmp();
            break;
        case 'Update an employee':
            updateEmp();
            break;
        case 'Exit':
            connection.end();
            break;
      }
  })
  .catch((err) => {
    console.error(err)
  })
};

const viewDepts = () => {
  connection.query(`SELECT * FROM DEPARTMENT`)
}


mainMenu();