import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import Topics from './Topics'
import FavoriteSites from './FavoriteSites'
import {Button} from 'semantic-ui-react'
import {SideMenu} from './SideMenu'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="banner">
    <nav>
      {isLoggedIn ? (
        <div>
          <a />
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <div>
      <SideMenu />
      <div id="header">
        <h1 className="heading" align="center">
          New News
        </h1>
        <h3 className="slogan">
          All of your favorite news articles in one place. Plus something new
        </h3>
      </div>
    </div>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
