import React, {Component} from 'react'
import {getTopicsThunk} from '../store/topicStore'
import {
  getSelectTopicsThunk,
  addFavoriteThunk,
  removeFavoriteThunk
} from '../store/favoriteTopicStore'
import {connect} from 'react-redux'
import {Form, Dropdown} from 'semantic-ui-react'

class Topics extends Component {
  componentDidMount() {
    this.props.getTopicsThunk()
    this.props.getSelectTopicsThunk()
  }

  onSubmit = ev => {
    ev.preventDefault()
    this.props.addFavoriteThunk(
      [...ev.target.elements]
        .filter(topic => topic.checked)
        .map(selected => selected.name)
    )
  }

  isChecked = id => {
    return this.props.favoriteTopic.includes(id)
  }

  onChange = ev => {
    console.log(ev.target.name)
    if (ev.target.checked) {
      this.props.addFavoriteThunk(ev.target.name)
    } else {
      this.props.removeFavoriteThunk(ev.target.name)
    }
  }

  render() {
    return (
      <div>
        <Form onSubmit={ev => this.onSubmit(ev)}>
          <Form.Group grouped>
            <Dropdown
              placeholder="Favorite Topics"
              fluid
              multiple
              selection
              options={
                this.props.topics &&
                this.props.topics.map(topic => {
                  return (
                    <Form.Field
                      id={topic.id}
                      onChange={e => this.onChange(e)}
                      label={topic.name}
                      name={topic.id}
                      control="input"
                      type="checkbox"
                      checked={
                        this.props.favoriteTopic && this.isChecked(topic.id)
                      }
                    />
                  )
                })
              }
            />
            {/* <button>Select Favorite Topics</button> */}
          </Form.Group>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    topics: state.topic,
    favoriteTopic: state.favoriteTopic
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTopicsThunk: () => dispatch(getTopicsThunk()),
    addFavoriteThunk: topics => dispatch(addFavoriteThunk(topics)),
    removeFavoriteThunk: topic => dispatch(removeFavoriteThunk(topic)),
    getSelectTopicsThunk: () => dispatch(getSelectTopicsThunk())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topics)
