import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Navbar} from './components'
import Routes from './routes'
import {Button, Icon, Menu, Segment, Sidebar} from 'semantic-ui-react'
import {logout} from './store'
import Topics from './components/Topics'
import FavoriteSites from './components/FavoriteSites'
import {getSelectSiteThunk} from './store/favoriteSiteStore'

class App extends Component {
  state = {visible: false}

  componentDidMount() {
    this.props.isLoggedIn && this.props.getSelectSiteThunk()
  }

  handleHideClick = () => this.setState({visible: false})
  handleShowClick = () => this.setState({visible: true})
  handleSidebarHide = () => this.setState({visible: false})

  render() {
    const {visible} = this.state
    const {isLoggedIn, handleClick} = this.props
    return (
      <div>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="overlay"
            icon="labeled"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width="thin"
          >
            {isLoggedIn && (
              <Menu.Item as="a">
                <Topics />
              </Menu.Item>
            )}
            {isLoggedIn && (
              <Menu.Item as="a">
                <FavoriteSites />
              </Menu.Item>
            )}

            {isLoggedIn && (
              <Menu.Item as="a" onClick={handleClick}>
                <Icon name="hand peace" />
                Logout
              </Menu.Item>
            )}
          </Sidebar>

          <Sidebar.Pusher dimmed={visible}>
            <div className="landing-image">
              <Segment basic>
                <Button.Group>
                  <Button
                    icon
                    disabled={visible}
                    onClick={this.handleShowClick}
                  >
                    <Icon name="sidebar" />
                  </Button>
                </Button.Group>
                <Navbar />
                <Routes />
              </Segment>
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    },
    getSelectSiteThunk: () => dispatch(getSelectSiteThunk())
  }
}

export default connect(mapState, mapDispatch)(App)
