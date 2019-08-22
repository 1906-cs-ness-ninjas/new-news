import axios from 'axios'

// Action Types
const GET_FAVORITE_ARTICLES = 'GET_FAVORITE_ARTICLES'

// Action Creators
const gotFavArticles = articles => ({
  type: GET_FAVORITE_ARTICLES,
  articles
})

// Thunk Creator
export const getFavArticles = () => async (dispatch, store) => {
  try {
    const userId = store().user.id

    const {data} = await axios.get(`/api/bbcArticles/${userId}`)

    dispatch(gotFavArticles(data))
  } catch (error) {
    console.log(error)
  }
}

// Reducer
export default function(state = [], action) {
  switch (action.type) {
    case GET_FAVORITE_ARTICLES:
      return action.articles
    default:
      return state
  }
}
