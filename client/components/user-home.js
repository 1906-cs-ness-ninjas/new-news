import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Articles from './articles'
import {Grid, Transition} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export const UserHome = props => {
  return (
    <div>
      <h3 align="center">Here are your top stories for today</h3>
      <Grid celled centered>
        <Articles />
      </Grid>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
