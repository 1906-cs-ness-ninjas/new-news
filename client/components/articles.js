/* eslint-disable react/jsx-key */
import React, {Component} from 'react'
import {getFavArticles} from '../store/articles'
import {connect} from 'react-redux'
import {Card, Icon, Image} from 'semantic-ui-react'

class Articles extends Component {
  componentDidMount() {
    this.props.getFavArticles(this.props.userId)
  }
  render() {
    return (
      <div>
        {this.props.articles &&
          this.props.articles.map(article => (
            <a href={article.url}>
              <Card>
                <Image src={article.imageUrl} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{article.title}</Card.Header>
                </Card.Content>
              </Card>
            </a>
          ))}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    userId: state.user.id,
    articles: state.articles
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getFavArticles: userId => dispatch(getFavArticles(userId))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Articles)
