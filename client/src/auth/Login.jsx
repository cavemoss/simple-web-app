import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials = true

function Login(){

    const navigate = useNavigate()

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    function onChangeEmail(event) {setValues({...values, email: event.target.value})}

    function onChangePassword(event) {setValues({...values, password: event.target.value})}

    async function handleSubmit(event){
        event.preventDefault()

        const response = await axios.post('/backend/login', values)

        if(response.data.status === 'success') {
            navigate('/')
        } else {
            alert(response.data.message)
        }
    }

    return(
        <div className='card'>  
            <h1>Login</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        required
                        onChange={onChangeEmail} 
                        autoComplete='off'
                        type="email" 
                        placeholder="Enter Email" 
                        name="email" 
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

                    <button className="submit-button" type="submit"> Login </button>
                </form>
                <p>Sign Up <a href='' onClick={() => navigate('/register')}>here</a></p>
            </div>
        </div>
    );
}

export default Login