import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

function Base(){

    const navigate = useNavigate()

    useEffect(() => {
        navigate('/home')
    }, [])
    
    return(
        <>
            <div className="navbar">
                <p onClick={() => navigate('/home')}>Home</p>
                <p onClick={() => navigate('/create')}>Create</p>
                <p onClick={() => navigate('/lists')}>Lists</p>
            </div>
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}

export default Base