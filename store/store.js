import { todoListReducer } from "./reducers/todoList.reducer.js"
import { userReducer } from "./reducers/user.reducer.js"


const { createStore, combineReducers, compose } = Redux


const rootReducer = combineReducers({
    todoModule: todoListReducer,
    userModule: userReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers())

window.gStore = store
