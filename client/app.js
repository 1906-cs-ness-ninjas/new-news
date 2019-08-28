import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Navbar} from './components'
import Routes from './routes'
import {
  Button,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar
} from 'semantic-ui-react'
import {logout} from './store'
import Topics from './components/Topics'
import FavoriteSites from './components/FavoriteSites'
import {getSelectSiteThunk} from './store/favoriteSiteStore'

class App extends Component {
  state = {visible: false}

  componentDidMount() {
    this.props.getSelectSiteThunk()
  }

  handleHideClick = () => this.setState({visible: false})
  handleShowClick = () => this.setState({visible: true})
  handleSidebarHide = () => this.setState({visible: false})

  render() {
    const {visible} = this.state
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
            <Menu.Item as="a">{this.props.isLoggedIn && <Topics />}</Menu.Item>
            <Menu.Item as="a">
              {this.props.isLoggedIn && (
                <FavoriteSites favoriteSites={this.props.favoriteSite} />
              )}
            </Menu.Item>

            <Menu.Item as="a">
              <Icon name="hand peace" />
              <a href="#" onClick={this.props.handleClick} align="right">
                Logout
              </a>
            </Menu.Item>
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
    isLoggedIn: !!state.user.id,
    favoriteSite: state.favoriteSite
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
