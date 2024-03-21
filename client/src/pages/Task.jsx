import { useContext } from 'react'
import { FunctionContext } from './ViewList'

function Task(props){

    const fromAbove = useContext(FunctionContext)

    function handleUpdate() {
        fromAbove.setToUpdate(props.element.task_id)
    }

    function handleDelete() {
        fromAbove.setToDelete(props.element.task_id)
    }

    return(
        <>
            {props.element.task_name}
            <p onClick={handleUpdate} className="edit">Edit</p>
            <p onClick={handleDelete} className="delete">Delete</p>
        </>
    )
}

export default Task