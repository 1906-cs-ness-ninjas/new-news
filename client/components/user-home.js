import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Articles from './articles'
import {Grid} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  return (
    <div>
      <h3>Here are your news for today</h3>
      <Grid celled>
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
