const inquirer = require('inquirer')
const connection = require('./config/connection')
const mysql = require('mysql2')

const mainMenu = async () =>{

  const result = await inquirer.prompt([
    {
      message: "Choose what you would like to do.",
      type: 'list',
      name: 'userPrompt',
      choices: [
        {
          name: 'View all departments',
          value: 'viewDepartments',
        },
        {
          name: 'View all roles',
          value: 'viewRoles',
        },{
          name: 'View all employees',
          value: 'viewEmployees',
        },{
          name: 'Add a department',
          value: 'addDepartment',
        },{
          name: 'Add a role',
          value: 'addRole',
        },{
          name: 'Add an employee',
          value: 'addEmployee',
        },{
          name: 'Update an employee',
          value: 'updateEmployee',
        },
        {
          name: 'Exit',
          value: 'exit'
        }
      ]
    }
  ])
  console.log(result);
}


mainMenu();