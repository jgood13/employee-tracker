const inquirer = require('inquirer')
const connection = require('./config/connection')
const mysql = require('mysql2')
const logo = require('asciiart-logo')

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
            quit();
            break;
      }
  })
  .catch((err) => {
    console.error(err)
  })
};

const quit = () =>{
  console.log('Thanks for stopping by.')
  process.exit()
}

const viewDepts = () => {
  connection.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

const viewRoles = () =>{
  connection.query(`SELECT * FROM ROLES`, (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

// const viewEmps = () => {
//   connection.query(`SELECT * FROM EMPLOYEES`, (err, res) =>{
//     if (err) {
//       console.error(err)
//     }
//     console.table(res)
//   })
// }

console.log(logo({name: 'Employee Tracker'}).render())
mainMenu();