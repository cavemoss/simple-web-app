import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Create(){

    const [name, setName] = useState()

    const navigate = useNavigate()

    function onChangeName(event) {setName(event.target.value)}

    function handleSubmit(event){
        event.preventDefault()

        axios.post('/backend/create', {name}).then(response => {

            if(response.data.status === 'success') {
                navigate('/lists')
            } else {
                alert(response.data.message)
            }
            
        })        
    }

    return(
        <>
            <h2>Create List</h2>
            <form onSubmit={handleSubmit}>
                <input required onChange={onChangeName} type="text" placeholder="List Name" />
                <button type="submit">Create</button>
            </form>
        </>
    )
}

export default Create