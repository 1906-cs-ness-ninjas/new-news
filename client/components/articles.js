/* eslint-disable react/jsx-key */
import React, {Component} from 'react'
import {getFavArticles} from '../store/articles'
import {connect} from 'react-redux'
import {Card, Image, Grid} from 'semantic-ui-react'

class Articles extends Component {
  componentDidMount() {
    this.props.getFavArticles()
  }
  render() {
    return (
      <div>
        <Grid celled>
          {this.props.articles &&
            this.props.articles.map(article => (
              <a href={article.url} key={article.id}>
                <Card>
                  <Image src={article.imageUrl} wrapped ui={false} />
                  <Card.Content>
                    <Card.Header>{article.title}</Card.Header>
                  </Card.Content>

                  <Card.Content extra>
                    #{article.category.replace(/\w/, char =>
                      char.toUpperCase()
                    )}
                  </Card.Content>
                </Card>
              </a>
            ))}
        </Grid>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    articles: state.articles
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getFavArticles: () => dispatch(getFavArticles())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Articles)
