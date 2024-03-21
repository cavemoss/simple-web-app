import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Lists(){

    const navigate = useNavigate()

    const [backendData, setBackendData] = useState([])

    useEffect(() => {
    
        axios.get('/backend/lists').then(response => {

            if(response.data.message) {
                alert(response.data.message)
            } else {
                for(let packet of response.data){
                    setBackendData(prevBackendData => [...prevBackendData, packet])
                }
            }
 
        })

    }, [])

    function onClick(event) {navigate(`/lists/${event.target.id}`)}

    return(
        <>
            <h2>Your Lists</h2>
            <ul className="lists-list">
                {backendData.map(element => 
                    <li key={element.list_id}>
                        <button id={element.list_id} onClick={onClick}>{element.name}</button>
                    </li>
                )}
            </ul>
        </>
    )
}

export default Lists