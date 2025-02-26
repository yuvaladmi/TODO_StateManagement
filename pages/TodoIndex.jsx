import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadTodos, saveTodos, removeTodos } from "../store/actions/todos.actions.js"
import { checkout } from "../store/actions/user.actions.js"
import { SET_FILTER_BY } from "../store/reducers/todoList.reducer.js"

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function TodoIndex() {

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)

    const todos = useSelector(storeState => storeState.todoModule.todos);
    const filterBy = useSelector(storeState => storeState.todoModule.filterBy);
    const isLoading = useSelector(storeState => storeState.todoModule.isLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos()
            .catch((err) => showErrorMsg('Cannot load todos'))
    }, [filterBy])

    function onRemoveTodo(todoId) {
        if (confirm("Are you sure you want to proceed?")) {
            console.log("User confirmed!");
            removeTodos(todoId)
                .then(() => {
                    showSuccessMsg(`Todo removed`)
                })
                .catch(err => {
                    showErrorMsg('Cannot remove todo ' + todoId)
                })
        } else {
            console.log("User canceled.");
        }
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodos(todoToSave)
            .then((savedTodo) => {
                if(savedTodo.isDone){
                    checkout();
                }
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(err => {
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
    }

    function onSetFilter(filterBy){
        dispatch({type: SET_FILTER_BY,filterBy});
    }

    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilter={onSetFilter} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {!isLoading ? 
                <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
                : <div>Loading...</div>}
            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}