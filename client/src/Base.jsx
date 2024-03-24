import { useEffect, useState } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'

function Base(){

    const navigate = useNavigate()

    useEffect(() => {
        navigate('/home')
    }, [])

    const [display, setDisplay] = useState(false)

    const root = document.querySelector(':root')

    root.style.setProperty('--content-width', window.innerWidth + 'px')
    if(window.innerWidth > 600) {
        root.style.setProperty('--navbar-left', '0')
        root.style.setProperty('--content-margin', '260px')    
    } else {
        if(display){
            root.style.setProperty('--navbar-left', '0')
            root.style.setProperty('--content-margin', '260px')
        } else {
            root.style.setProperty('--navbar-left', '-210px')
            root.style.setProperty('--content-margin', '50px')
        }  
    }

    function slide(){
        if(window.innerWidth < 600){
            display ? setDisplay(false) : setDisplay(true)
        } else {
            setDisplay(true)
        }
    }
    
    return(
        <>
            <div onClick={slide} className="navbar">
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