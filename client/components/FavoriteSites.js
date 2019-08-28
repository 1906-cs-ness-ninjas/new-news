import React, {Component} from 'react'
import {getSelectSiteThunk} from '../store/favoriteSiteStore'
import {connect} from 'react-redux'
import {Form, Dropdown, Button} from 'semantic-ui-react'
import {removeFavoriteThunk} from '../store/favoriteSiteStore'

class FavoriteSites extends Component {
  componentDidMount() {
    this.props.getSelectSiteThunk()
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Group grouped>
            <Dropdown
              style={{fontSize: '10px'}}
              placeholder="Subscribed News Sites"
              fluid
              multiple
              selection
              options={
                this.props.favoriteSite &&
                this.props.favoriteSite.map(topic => {
                  return (
                    <Form.Field
                      key={topic.id}
                      id={topic.id}
                      //   onChange={e => this.onChange(e)}
                      label={topic.website.split('.')[1]}
                      name={topic.website.split('.')[1]}
                      control="input"
                      type="button"
                      onClick={() => this.props.delete(topic.id)}
                    />
                  )
                })
              }
            />
          </Form.Group>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    favoriteSite: state.favoriteSite
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSelectSiteThunk: () => dispatch(getSelectSiteThunk()),
    delete: id => dispatch(removeFavoriteThunk(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteSites)