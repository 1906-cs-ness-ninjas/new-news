import axios from 'axios'

// Action Types
const GET_FAVORITE_ARTICLES = 'GET_FAVORITE_ARTICLES'
const GET_REC_ARTICLES = 'GET_REC_ARTICLES'

// Action Creators
const gotFavArticles = favArticles => ({
  type: GET_FAVORITE_ARTICLES,
  favArticles
})
const gotRecArticles = recArticles => ({
  type: GET_REC_ARTICLES,
  recArticles
})

// Thunk Creator
export const getFavArticles = () => async (dispatch, store) => {
  try {
    const userId = store().user.id

    const {data} = await axios.get(`/api/bbcArticles/${userId}/favArticles`)

    dispatch(gotFavArticles(data))
  } catch (error) {
    console.log(error)
  }
}
export const getRecArticles = () => async (dispatch, store) => {
  try {
    const userId = store().user.id

    const {data} = await axios.get(`/api/bbcArticles/${userId}/recArticles`)

    dispatch(gotRecArticles(data))
  } catch (error) {
    console.log(error)
  }
}

const articles = {
  favArticles: [],
  recArticles: []
}
// Reducer
export default function(state = articles, action) {
  switch (action.type) {
    case GET_FAVORITE_ARTICLES:
      return {...state, favArticles: [...action.favArticles]}
    case GET_REC_ARTICLES:
      return {...state, recArticles: [...action.recArticles]}
    default:
      return state
  }
}
