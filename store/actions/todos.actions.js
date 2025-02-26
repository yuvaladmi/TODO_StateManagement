import { todoService } from "../../services/todo.service.js"
import { ADD_TODO, SET_TODOS, UPDATE_TODO, REMOVE_TODO, SET_IS_LOADING } from "../reducers/todoList.reducer.js"
import { store } from "../store.js"

export function loadTodos() {
    store.dispatch({type: SET_IS_LOADING, isLoading: true});
    const filterBy = store.getState().todoModule.filterBy;
    return todoService.query(filterBy)
        .then(todos => {
            store.dispatch({type: SET_TODOS, todos})
        })
        .catch(err => {
            console.error('err:', err);
            throw err;
        })
        .finally(() => {
            store.dispatch({type: SET_IS_LOADING, isLoading: false});
        })
}

export function removeTodos(todoId) {
    return todoService.remove(todoId)
        .then(() => {
            store.dispatch({type: REMOVE_TODO,todoId: todoId})
        })
        .catch(err => {
            console.log('err:', err)
            throw err;
        })
}

export function saveTodos(todo) {
    const type = todo._id ? UPDATE_TODO : ADD_TODO;
    return todoService.save(todo)
        .then((savedTodo) => {
            store.dispatch({type: type, todo : savedTodo})
            return savedTodo;
        })
        .catch(err => {
            console.log('err:', err)
            throw err;
        })
}