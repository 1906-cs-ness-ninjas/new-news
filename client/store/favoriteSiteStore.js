import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_FAV_SITES = 'GET_FAV_SITES'
const ADD_FAV_SITE = 'ADD_FAV_SITE'
const REMOVE_FAV_SITE = 'REMOVE_FAV_SITE'

/**
 * INITIAL STATE
 */
const favSites = []

/**
 * ACTION CREATORS
 */
const getFavSites = sites => ({type: GET_FAV_SITES, sites})
const addFavs = site => ({type: ADD_FAV_SITE, site})
const removeFavs = site => ({type: REMOVE_FAV_SITE, site})

/**
 * THUNK CREATORS
 */

export const getSelectSiteThunk = () => async (dispatch, state) => {
  try {
    const {data} = await axios.get(`/api/favoriteSite/${state().user.id}`)

    dispatch(getFavSites(data))
  } catch (error) {
    console.log(error)
  }
}

// export const addFavoriteThunk = site => async (dispatch, state) => {
//   try {
//     await axios.post('/api/topics', {site, id: state().user.id})
//     dispatch(addFavs(site))
//   } catch (error) {
//     console.log(error)
//   }
// }
// export const removeFavoriteThunk = topic => async (dispatch, state) => {
//   try {
//     await axios.delete('/api/topics/', {data: {topic, id: state().user.id}})
//     dispatch(removeFavs(topic))
//   } catch (error) {
//     console.log(error)
//   }
// }

/**
 * REDUCER
 */
export default function(state = favSites, action) {
  switch (action.type) {
    case GET_FAV_SITES:
      return action.sites

    case REMOVE_FAV_SITE:
      return state.filter(topic => topic !== +action.site)
    default:
      return state
  }
}
