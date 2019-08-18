import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_TOPICS = 'GET_TOPICS'

/**
 * INITIAL STATE
 */
const topics = []

/**
 * ACTION CREATORS
 */
const getTopic = topic => ({type: GET_TOPICS, topic})

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

/**
 * REDUCER
 */
export default function(state = topics, action) {
  switch (action.type) {
    case GET_TOPICS:
      return action.topic
    default:
      return state
  }
}
