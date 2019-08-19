import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_FAV_TOPICS = 'GET_FAV_TOPICS'
const ADD_FAVS = 'ADD_FAVS'
const REMOVE_FAVS = 'REMOVE_FAVS'

/**
 * INITIAL STATE
 */
const favTopics = []

/**
 * ACTION CREATORS
 */
const getFavTopics = topics => ({type: GET_FAV_TOPICS, topics})
const addFavs = topic => ({type: ADD_FAVS, topic})
const removeFavs = topic => ({type: REMOVE_FAVS, topic})

/**
 * THUNK CREATORS
 */

export const getSelectTopicsThunk = () => async (dispatch, state) => {
  try {
    const {data} = await axios.get(`/api/topics/${state().user.id}`)
    dispatch(getFavTopics(data))
  } catch (error) {
    console.log(error)
  }
}

export const addFavoriteThunk = topic => async (dispatch, state) => {
  try {
    await axios.post('/api/topics', {topic, id: state().user.id})
    dispatch(addFavs(topic))
  } catch (error) {
    console.log(error)
  }
}
export const removeFavoriteThunk = topic => async (dispatch, state) => {
  try {
    await axios.delete('/api/topics/', {data: {topic, id: state().user.id}})
    dispatch(removeFavs(topic))
  } catch (error) {
    console.log(error)
  }
}

/**
 * REDUCER
 */
export default function(state = favTopics, action) {
  switch (action.type) {
    case GET_FAV_TOPICS:
      return action.topics
    case ADD_FAVS:
      return [...state, +action.topic]
    case REMOVE_FAVS:
      return state.filter(topic => topic !== +action.topic)
    default:
      return state
  }
}
