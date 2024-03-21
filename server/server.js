const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173/"],
    methods: ["POST", "GET"],
    credentials: true
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "141008!goR",
    database: "register"
})


function verifyUser(request, response, next){

    const token = request.cookies.token

    if(!token) {return response.json({message: 'token required'})} 
    
    else {
        jwt.verify(token, 'jsonwebtoken-secret-key', 

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
            if (error) return response.json({message: 'server side error'})

            if (data.length > 0) {
                
                const payload = {username: data[0].username, id: data[0].id}
                const token = jwt.sign({payload}, 'jsonwebtoken-secret-key', {expiresIn: '1d'})
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
            if (error) return response.json({message: 'server side error'})
            return response.json({status: 'success'})
        }
    )
})

app.delete('/backend/delete/user', verifyUser, (request, response) => {

    const userId = request.payload.id

    db.query(`DELETE FROM users WHERE id = ${userId}`,

        (error, result) => {
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
            if (error) return response.json({message: 'server side error'})

            if (data.length > 0) {
                response.send(data)
            } else {
                return response.json({message: 'no items found'})
            }
        }
    )
})


app.listen(5000, () => console.log('Server started on port 5000 \n> http://localhost:5000'))