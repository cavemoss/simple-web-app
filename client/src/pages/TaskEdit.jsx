import { useContext, useEffect, useState } from 'react'
import { FunctionContext } from './ViewList'
import axios from "axios"

function TaskEdit(props){

    const fromAbove = useContext(FunctionContext)

    const [newName, setNewName] = useState(props.element.task_name)

    function onChangeNewName(event){
        setNewName(event.target.value)
    }

    function save(){
        axios.put('/backend/update', {newName: newName, taskId: props.element.task_id}).then(response => {

            if(response.data.status === 'success') {
                fromAbove.setToUpdate('reload')
            } else {
                alert(response.data.message)
            }
        })
    }

    useEffect(() => {
        document.querySelector('input').value = props.element.task_name
    }, [])

    return(
        <>
            <input onChange={onChangeNewName}></input>
            <button onClick={save}>Save</button>
        </>
    )
}

export default TaskEdit