import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import topic from './topicStore'
import favoriteTopic from './favoriteTopicStore'
import articles from './articles'
import favoriteSite from './favoriteSiteStore'

const reducer = combineReducers({
  user,
  topic,
  favoriteTopic,
  favoriteSite,
  articles
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
