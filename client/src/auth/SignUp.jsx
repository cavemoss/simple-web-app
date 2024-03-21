import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' 

function SignUp(){

    const navigate = useNavigate()

    const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}/
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]){8,24}/

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    })   

    function onChangeUsername(event) {setValues({...values, username: event.target.value})}

    function onChangeEmail(event) {setValues({...values, email: event.target.value})}

    function onChangePassword(event) {setValues({...values, password: event.target.value})}

    async function handleSubmit(event){
        event.preventDefault()

        const response = await axios.post('/backend/register', values)

        if (response.data.status === 'success') {
            navigate('/login')
        } else {
            alert(response.data.message)
        }
    }

    return(
        <div className='card'>  
            <h1>Sign Up</h1>
            <div>
                <form onSubmit={handleSubmit}>

                    <label htmlFor="username">Username</label> 
                    <input 
                        required
                        onChange={onChangeUsername} 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        autoComplete="off"
                    />
                    
                    <br />

                    <label htmlFor="email">Email</label> 
                    <input 
                        required
                        onChange={onChangeEmail} 
                        type="email" 
                        placeholder="Enter Email" 
                        name="email" 
                        autoComplete="off"
                    />
                    
                    <br />

                    <label htmlFor="password">Password</label> 
                    <input
                        required
                        onChange={onChangePassword} 
                        type="password" 
                        placeholder="Enter Password" 
                        name="password" 
                    />
                    
                    <br />
                    <br />

                    <button type="submit"> Sign Up </button>
                </form>
                <p>Login <a href='' onClick={() => navigate('/login')}>here</a></p>
            </div>
        </div>
    );
}

export default SignUp