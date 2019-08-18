import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TOPICS = 'GET_TOPICS'
// const REMOVE_TOPIC = 'REMOVE_TOPIC'
const ADD_FAVS = 'ADD_FAVS'

/**
 * INITIAL STATE
 */
const topics = []

/**
 * ACTION CREATORS
 */
const getTopic = topic => ({type: GET_TOPICS, topic})

// const removeTopic = topic => ({type: REMOVE_TOPIC, topic})
// const addFavs = topics => ({type: ADD_FAVS, topics})

/**
 * THUNK CREATORS
 */
export const getTopicsThunk = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/topics')
    dispatch(getTopic(data))
  } catch (err) {
    console.error(err)
  }
}
export const addFavoriteThunk = topics => async (dispatch, state) => {
  try {
    console.log('STATE SHOULD BE THERE********', state().user.id)
    await axios.post('/api/topics', {topics, id: state().user.id})
    dispatch()
  } catch (error) {
    console.log(error)
  }
}

/**
 * REDUCER
 */
export default function(state = topics, action) {
  switch (action.type) {
    case GET_TOPICS:
      return action.topic
    case ADD_FAVS:
      return state
    // case REMOVE_USER:
    //   return defaultUser
    default:
      return state
  }
}
