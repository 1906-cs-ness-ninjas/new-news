import React, {Component} from 'react'
import {getTopicsThunk} from '../store/topicStore'
import {
  getSelectTopicsThunk,
  addFavoriteThunk,
  removeFavoriteThunk
} from '../store/favoriteTopicStore'
import {connect} from 'react-redux'
import {Form, Dropdown} from 'semantic-ui-react'
import {getFavArticles} from '../store/articles'

class Topics extends Component {
  componentDidMount() {
    this.props.getTopicsThunk()
    this.props.getSelectTopicsThunk()
  }

  isChecked = id => {
    return this.props.favoriteTopic.includes(id)
  }

  onChange = async ev => {
    if (ev.target.checked) {
      await this.props.addFavoriteThunk(ev.target.name)
      await this.props.getFavArticlesThunk()
    } else {
      await this.props.removeFavoriteThunk(ev.target.name)
      await this.props.getFavArticlesThunk()
    }
  }

  render() {
    return (
      <div>
        <Form>
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
                      key={topic.id}
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
    getSelectTopicsThunk: () => dispatch(getSelectTopicsThunk()),
    getFavArticlesThunk: () => dispatch(getFavArticles())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topics)
