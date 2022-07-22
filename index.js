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
        case 'View all employees':
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
  connection.query(`SELECT roles.title, roles.id, roles.salary,department.name AS department
                    FROM roles
                    INNER JOIN department ON roles.department_id = department.id`, (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

const viewEmps = () => {
  connection.query(
    `SELECT employee.id, employee.first_name,
            employee.last_name, roles.title,
            department.name AS department, roles.salary,
            CONCAT (manager.first_name,' ', manager.last_name) AS manager
    FROM employee
            INNER JOIN employee manager ON employee.manager_id = manager.id
            INNER JOIN roles on employee.roles_id = roles.id
            LEFT JOIN department on roles.department_id = department.id`, (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

const addDept = () => {
  inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'Input department name'
  }).then(response => {
    if (!response.departmentName ||response.departmentName == null || response.departmentName == ''){
      console.log('You have to input a department name.')
    }
    connection.query(`INSERT INTO department (name) VALUES (?)`, [response.departmentName], (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.log('Your department was added!')
    mainMenu()
  })
  })
  .catch(err => {
    if (err){
      console.log(err)
    }
  })
}

const addRole = () =>{
  connection.query(`SELECT name, id FROM department`, (err, res) => {
    if (err){
      console.log(err)
    }
    inquirer.prompt([{
      name: 'title',
      type: 'input',
      message: 'What is the title of the role'
    },
    {
    name: 'salary',
    type: 'Number',
    message: 'What is the salary'
    },
    {
      name: 'dept',
      type: 'list',
      choices: () =>{
        let resArray = res.map(({name,id})=> ({name: name, value: id}))
        return resArray
      }
      }
    ])
    .then(response =>{
      roleAnswers = [response.title, response.salary, response.dept]
      connection.query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, roleAnswers, (err, res)=>{
        if (err){
          console.error(err)
        }
        console.log('Your role was created!')
        mainMenu()
      })
    })
  .catch(err =>{
    if (err){
      console.error(err)
    }
  })
  
  })
  
 
}

console.log(logo({name: 'Employee Tracker'}).render())
mainMenu();