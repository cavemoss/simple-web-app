const express = require('express')
const ip = require('ip')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')


const app = express()
app.use(express.json())
app.use(cookieParser())
dotenv.config()

const db = mysql.createConnection({
    host: "mysqldb",
    user: "root",
    password: "password",
    database: "register"
})


function verifyUser(request, response, next){

    const token = request.cookies.token

    if(!token) {return response.json({message: 'token required'})} 
    
    else {
        jwt.verify(token, process.env.JWT_TOKEN, 

            (error, decoded) => {
                if (error) {return response.json({message: 'authentication error'})} 
                
                else {
                    request.payload = decoded.payload
                    next()
                }
            }
        )
    }
}

app.get('/backend', verifyUser, (request, response) => {
    return response.json({status: 'success', payload: request.payload})
})

app.get('/backend/:what&:id', verifyUser, (request, response) => {

    const what = request.params.what
    const id = request.params.id

    db.query(`SELECT * FROM ${what} WHERE id = ${id}`, 

        (error, data) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})

            if (data.length > 0) {
                response.send(data)
            } else {
                return response.json({message: 'not found'})
            }
        }
    )
})

app.post('/backend/register', (request, response) => {

    const username = request.body.username
    const email = request.body.email
    const password = request.body.password
    
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password],

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'user already exists'})
            
            return response.json({status: 'success'})
        }  
    )
})

app.post('/backend/login', (request, response) => {

    const email = request.body.email
    const password = request.body.password 

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], 

        (error, data) => {
            console.log(error)
            if (error) {console.log(error); return response.json({message: 'server side error'})}

            if (data.length > 0) {
                
                const payload = {username: data[0].username, id: data[0].id}
                const token = jwt.sign({payload}, process.env.JWT_TOKEN, {expiresIn: '1d'})
                response.cookie('token', token)

                return response.json({status: 'success'})
            } else {

                return response.json({message: 'wrong email or password'})
            }
        }
    )
})


app.post('/backend/create', verifyUser, (request, response) => {

    const name = request.body.name
    const ownerId = request.payload.id

    db.query('INSERT INTO lists (name, owner_id) VALUES (?, ?)', [name, ownerId], 

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )

})

app.post('/backend/add', verifyUser, (request, response) => {

    const item = request.body.item
    const listId = request.body.listId

    db.query('INSERT INTO tasks (name, owner_id) VALUES (?, ?);', [item, listId], 

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )
})

app.put('/backend/update', verifyUser, (request, response) => {

    const newName = request.body.newName
    const taskId = request.body.taskId

    db.query(`UPDATE tasks SET name = '${newName}' WHERE id = ${taskId}`,

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )

})

app.delete('/backend/delete/:what&:id', verifyUser, (request, response) => {

    const what = request.params.what
    const id = request.params.id

    db.query(`DELETE FROM ${what} WHERE id = ${id}`,

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )
})

app.delete('/backend/delete/user', verifyUser, (request, response) => {

    const userId = request.payload.id

    db.query(`DELETE FROM users WHERE id = ${userId}`,

        (error, result) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )
})

app.get('/backend/lists', verifyUser, (request, response) => {

    const userId = request.payload.id

    db.query(

        `SELECT 
            users.id AS user_id, 
            lists.id AS list_id, 
            name 
        FROM lists 
        LEFT JOIN users 
        ON lists.owner_id = users.id 
        WHERE users.id = ${userId}`,

        (error, data) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})

            if (data.length > 0) {
                response.send(data)
            } else {
                return response.json({message: 'no lists found'})
            }
        }
    )
})

app.get('/backend/lists/:id', verifyUser, (request, response) => {

    const listId = request.params.id

    db.query(
        
        `SELECT 
            lists.id AS list_id, 
            tasks.id AS task_id, 
            tasks.name AS task_name 
        FROM tasks 
        LEFT JOIN lists 
        ON tasks.owner_id = lists.id 
        WHERE lists.id = ${listId}`,

        (error, data) => {
            console.log(error)
            if (error) return response.json({message: 'server side error'})

            if (data.length > 0) {
                response.send(data)
            } else {
                return response.json({message: 'no items found'})
            }
        }
    )
})

app.listen(5000, () => console.log(`Server started at http://${ip.address()}:5000/backend`))