import { useEffect, useState, createContext } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import Task from "./Task"
import TaskEdit from "./TaskEdit"

export const FunctionContext = createContext()

function ViewList(){

    const navigate = useNavigate()

    const { id } = useParams()

    const [listName, setListName] = useState()

    const [newTask, setNewTask] = useState()

    const [backendData, setBackendData] = useState([])

    const [toDelete, setToDelete] = useState(null)

    const [toUpdate, setToUpdate] = useState(null)

    useEffect(() => fetchData(), [])

    useEffect(() => {

        if(toDelete) {
            axios.delete(`/backend/delete/tasks&${toDelete}`).then(response => {

                if(response.data.status === 'success') {
                    document.getElementById(toDelete).remove()
                } else {
                    alert(response.data.message)
                }
            })
        }

    }, [toDelete])

    useEffect(() => {

        if(toUpdate) {
            setBackendData([])
            fetchData()
        }

    }, [toUpdate])

    function fetchData(){

        axios.get(`/backend/lists&${id}`).then(response => {
            
            if(response.data.message) {
                alert(response.data.message)
            } else {
                for(let packet of response.data) setListName(packet.name)
            }
        })

        axios.get(`/backend/lists/${id}`).then(response => {

            if(response.data.message) {
                alert(response.data.message)
            } else {
                for(let packet of response.data){
                    setBackendData(prevBackendData => [...prevBackendData, packet]) 
                }
            }
        })
    }

    function fetchNew(){

        axios.get(`/backend/lists/${id}`).then(response => {

            if(response.data.message) {    
                alert(response.data.message)
            } else {
                for(let packet of response.data){
                    setBackendData([...backendData, packet]) 
                }
            }
        })
    }

    function onChangeItem(event) {setNewTask(event.target.value)}

    function deleteList(){
        axios.delete(`/backend/delete/lists&${id}`).then(response => {

            if(response.data.status === 'success') {
                navigate('/lists')
            } else {
                alert(response.data.message)
            }
        })
    }

    async function handleSubmit(event){
        event.preventDefault()
        document.querySelector('input').value = ''

        const response = await axios.post('/backend/add', {item: newTask, listId: id})

        if (response.data.status === 'success') {
            fetchNew()
        } else {
            alert(response.data.message)
        }
    }

    return(
        <>
            <FunctionContext.Provider value={{setToDelete: setToDelete, setToUpdate: setToUpdate}}>
            <h2>{listName}</h2><p onClick={deleteList}>Delete this list</p><br />
            <ul className="view-list-ul">
                {backendData.map(element =>

                    <li key={element.task_id} id={element.task_id}>
                        {
                            (element.task_id == toUpdate) ? 
                            (<TaskEdit id={element.task_id} element={element}></TaskEdit>) : 
                            (<Task id={element.task_id} element={element}/>)
                        }
                    </li>

                )}
            </ul>
            </FunctionContext.Provider>

            <form onSubmit={handleSubmit}>
                <input required onChange={onChangeItem} type="text" placeholder="New Item" />
                <button type="submit">Add</button>
            </form>
        </>
    )
}

export default ViewList