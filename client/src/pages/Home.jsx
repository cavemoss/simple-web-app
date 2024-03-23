import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Home(){

  const navigate = useNavigate()

  const [backendData, setBackendData] = useState()

  useEffect(() => {

    axios.get('/backend').then(response => {
      
      if(response.data.status === 'success') {
        setBackendData(response.data.payload.username)
      } else {
        alert(response.data.message)
        navigate('/login')
      }

    })
    
  }, [])

  function deleteAccount(){
     
    axios.delete(`/backend/delete/user`).then(response => {

      if(response.data.status === 'success') {
        navigate('/login')
      } else {
        alert(response.data.message)
      }
    })

  }

  return(
    <>
      <h1>{`Welcome Home, ${backendData}`}</h1>
      <p className='edit' onClick={() => navigate('/logout')}>Logout</p>
      <p className='del' onClick={deleteAccount}>Delete This Account</p>
    </>
  );
}

export default Home