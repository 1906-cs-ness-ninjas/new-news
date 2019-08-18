import React, {Component} from 'react'
import {getTopicsThunk, addFavoriteThunk} from '../store/topicStore'
import {connect} from 'react-redux'

class Topics extends Component {
  componentDidMount() {
    this.props.getTopicsThunk()
  }

  onSubmit = ev => {
    ev.preventDefault()
    this.props.addFavoriteThunk(
      [...ev.target.elements]
        .filter(topic => topic.checked)
        .map(selected => selected.name)
    )
  }

  render() {
    return (
      <div>
        <form onSubmit={ev => this.onSubmit(ev)}>
          {this.props.topics &&
            this.props.topics.map(topic => {
              return (
                <div key={topic.id}>
                  <input type="checkbox" name={topic.id} />
                  <span key={topic.id}>{topic.name}</span>
                </div>
              )
            })}
          <button>Select Favorite Topics</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {topics: state.topic}
}

const mapDispatchToProps = dispatch => {
  return {
    getTopicsThunk: () => dispatch(getTopicsThunk()),
    addFavoriteThunk: topics => dispatch(addFavoriteThunk(topics))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topics)
