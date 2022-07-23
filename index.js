// Requiring dependancies
const inquirer = require('inquirer')
const connection = require('./config/connection')
const logo = require('asciiart-logo')

// Function that calls the primary inquirer prompt screen
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
        'Update an employee role',
        'Update an employee manager',
        'Delete departments, roles, or employees',
        'Exit',]
  })
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
            addEmp()
            break;
        case 'Update an employee role':
            updateEmp();
            break;
        case 'Update an employee manager':
            updateMan()
            break;
        case 'Delete departments, roles, or employees':
            deleteStuff()
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

// function for selecting exit from primary prompt
const quit = () =>{
  console.log('Thanks for stopping by.')
  process.exit()
}

// function for viewing all departments
const viewDepts = () => {
  connection.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

// function for viewing all roles
const viewRoles = () =>{
  connection.query(`SELECT roles.title, roles.id, roles.salary, department.name AS department
                    FROM roles
                    INNER JOIN department ON roles.department_id = department.id`, (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

// function for viewing specific attributes about each employee
const viewEmps = () => {
  connection.query(
    `SELECT employee.id, employee.first_name,
            employee.last_name, roles.title,
            department.name AS department, roles.salary,
            CONCAT (manager.first_name,' ', manager.last_name) AS manager
            FROM employee
            LEFT JOIN employee manager ON employee.manager_id = manager.id
            LEFT JOIN roles on employee.roles_id = roles.id
            INNER JOIN department on roles.department_id = department.id`, (err, res) =>{
    if (err) {
      console.error(err)
    }
    console.table(res)
    mainMenu()
  })
}

// function for adding a department
const addDept = () => {
  inquirer.prompt({
    name: 'departmentName',
    type: 'input',
    message: 'Input department name'
  }).then(response => {
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

// Function for adding a role
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

// function for adding an employee

const addEmp = () => {
  console.log('running addEMP')
  inquirer.prompt([
    {
      name: 'firstName',
      type: 'input',
      message: 'What is the first name of the employee?'
    },
    {
      name: 'lastName',
      type: 'input',
      message: 'What is the last name of the employee?'
    }
  ])
  .then(response => {
    let empInfo = [response.firstName, response.lastName]
    connection.query(`SELECT title, id FROM roles`, (err, res) =>{
      if (err){
        console.error(err)}
        inquirer.prompt([{
        name: 'role',
        type: 'list',
        choices: () =>{
          let roleArray = res.map(({title, id}) => ({name:title, value:id}))
          return roleArray
        }
      }])
      .then(response =>{
        empInfo.push(response.role)
        connection.query(`SELECT first_name, last_name, id FROM employee`,(err,res)=>{
          if (err){
            console.log(err)}
          inquirer.prompt([{
            name:'manager',
            type:'list',
            choices: ()=>{
              let managers = res.map(({first_name, last_name, id}) => ({ name:(first_name + ' '+ last_name), value: id}))
              // adding option of null in case new employee is manager
              managers.push([null])
              return managers
            }
          }])
          .then(response =>{
            empInfo.push(response.manager)
            connection.query(`INSERT INTO employee (first_name,last_name,roles_id,manager_id) VALUES (?,?,?,?)`, empInfo, (err, res) =>{
              if (err)
              console.error(err)
            })
            console.log('Employee added!')
            mainMenu()
          })   
          .catch(err =>{
            if (err){
              console.error(err)
            }
          }) 
      })
      })
    })
  })
};

// function for updating employee role
const updateEmp = () =>{
  connection.query(`SELECT first_name, last_name, id FROM employee`, (err, res) =>{
    if (err){
      console.error(err)
    }
    inquirer.prompt([{
      name: 'updateEmployee',
      type: 'list',
      choices: () =>{
        let employeeList = res.map(({first_name,last_name,id}) =>({name:(first_name + ' '+ last_name), value: id }))
        return employeeList
      }
    }])
    .then(response=>{
      connection.query(`SELECT title, id FROM roles`, (err, res) =>{
        if (err){
          console.error(err)
        }
        inquirer.prompt([{
          name: 'updateRole',
          type: 'list',
          choices: () =>{
            let rolesList = res.map(({title, id}) => ({name:title,value:id}))
            return rolesList
          }
        }])
        .then(response2 =>{
          connection.query(`UPDATE employee SET roles_id = '${response2.updateRole}' WHERE id = ${response.updateEmployee} `, (err,res) =>{
            if (err){
              console.error(err)
            }
            console.log('Your employee role has been updated')
            mainMenu()
          })
        })
        .catch(err=>{
          if (err){
            console.error(err)
          }
        })
      })
    })
})
}

const updateMan = () =>{
  connection.query(`SELECT first_name, last_name, id FROM employee`, (err, res) =>{
    if (err){
      console.error(err)
    }
    inquirer.prompt([{
      name: 'updateEmployee',
      type: 'list',
      choices: () =>{
        let employeeList = res.map(({first_name,last_name,id}) =>({name:(first_name + ' '+ last_name), value: id }))
        return employeeList
      }
    }])
    .then(response=>{
      connection.query(`SELECT first_name, last_name, id FROM employee`, (err, res) =>{
        if (err){
          console.error(err)
        }
        inquirer.prompt([{
          name: 'updateMan',
          type: 'list',
          choices: () =>{
            let managerList = res.map(({first_name, last_name, id}) => ({name:(first_name+ ' ' + last_name),value:id}))
            return managerList
          }
        }])
        .then(response2 =>{
          console.log(response2.updateMan)
          connection.query(`UPDATE employee SET manager_id = '${response2.updateMan}' WHERE id = ${response.updateEmployee} `, (err,res) =>{
            if (err){
              console.log(err)
            }
            console.log('Your employee manager has been updated')
            mainMenu()
          })
        })
        .catch(err=>{
          if (err){
            console.error(err)
          }
        })
      })
    })
})
}

const deleteStuff = () =>{
  inquirer.prompt([{
    name: 'delete',
    type: 'list',
    choices: ['departments',
             'roles',
             'employees']
  }])
  .then(answer => {
    switch (answer.delete) {
        case 'departments':
            deleteDepts();
            break;
        case 'roles':
            deleteRoles();
            break;
        case 'employees':
            deleteEmps();
            break;
          }
  })
  const deleteDepts = () =>{
    connection.query(`SELECT name, id FROM department`,(err, res)=>{
      if (err) {
        console.log(err)
      }
      inquirer.prompt([{
        name: 'deleteDept',
        type: 'list',
        choices: () =>{
          let depts = res.map(({name, id}) =>({name:name, value:id}))
          return depts
        },
        message: 'Choose a department to delete!'
      }])
      .then(response=>{
        connection.query(`Delete FROM department WHERE id = ${response.deleteDept}`, (err, res) =>{
          if (err) {
            console.error(err)
          }
          console.log('Your department has been deleted!')
          mainMenu()
        })
      })
      
    })
  }

  const deleteRoles = () =>{
    connection.query(`SELECT title, id FROM roles`,(err, res)=>{
      if (err) {
        console.log(err)
      }
      inquirer.prompt([{
        name: 'deleteRole',
        type: 'list',
        choices: () =>{
          let roles = res.map(({title, id}) =>({name:title, value:id}))
          return roles
        },
        message: 'Choose a role to delete!'
      }])
      .then(response=>{
        connection.query(`Delete FROM roles WHERE id = ${response.deleteRole}`, (err, res) =>{
          if (err) {
            console.error(err)
          }
          console.log('Your role has been deleted!')
          mainMenu()
        })
      })
    })
  }

  const deleteEmps = () =>{
    connection.query(`SELECT first_name,last_name, id FROM employee`,(err, res)=>{
      if (err) {
        console.log(err)
      }
      inquirer.prompt([{
        name: 'deleteEmployee',
        type: 'list',
        choices: () =>{
          let employees = res.map(({first_name, last_name, id}) =>({name:(first_name+' '+last_name), value:id}))
          return employees
        },
        message: 'Choose an employee to delete!'
      }])
      .then(response=>{
        connection.query(`Delete FROM employee WHERE id = ${response.deleteEmployee}`, (err, res) =>{
          if (err) {
            console.error(err)
          }
          console.log('Your employee has been deleted!')
          mainMenu()
        })
      })
      .catch(err=>{
        if (err){
          console.error(err)
        }
      })
    })
  }
}


// creating inital logo
console.log(logo({name: 'Employee Tracker'}).render())
mainMenu();