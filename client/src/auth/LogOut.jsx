import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LogOut(){

    const navigate = useNavigate()

    useEffect(() => {

        document.cookie = "token=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        navigate('/login')

    }, [])
    
    return(<></>)
}

export default LogOut