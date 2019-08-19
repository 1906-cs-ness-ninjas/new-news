import React, {Component} from 'react'
import {getTopicsThunk} from '../store/topicStore'
import {
  getSelectTopicsThunk,
  addFavoriteThunk,
  removeFavoriteThunk
} from '../store/favoriteTopicStore'
import {connect} from 'react-redux'

class Topics extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     selectedTopics : []
  //   }
  // }

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
    if (ev.target.checked) {
      this.props.addFavoriteThunk(ev.target.name)
    } else {
      this.props.removeFavoriteThunk(ev.target.name)
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={ev => this.onSubmit(ev)}>
          {this.props.topics &&
            this.props.topics.map(topic => {
              return (
                <div key={topic.id}>
                  <input
                    onChange={e => this.onChange(e)}
                    type="checkbox"
                    name={topic.id}
                    checked={
                      this.props.favoriteTopic && this.isChecked(topic.id)
                    }
                  />
                  <span key={topic.id}>{topic.name}</span>
                </div>
              )
            })}
          {/* <button>Select Favorite Topics</button> */}
        </form>
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
