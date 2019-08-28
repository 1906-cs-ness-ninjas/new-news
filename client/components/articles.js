/* eslint-disable react/jsx-key */
import React, {Component} from 'react'
import {getFavArticles, getRecArticles} from '../store/articles'
import RecArticle from './recArticle'
import {connect} from 'react-redux'
import {
  Card,
  Image,
  Grid,
  Transition,
  Header,
  Modal,
  Button
} from 'semantic-ui-react'

class Articles extends Component {
  constructor() {
    super()
    this.recArticles = {}
    this.state = {visible: false, hasRec: true}
    this.handleVisibility = this.handleVisibility.bind(this)
  }

  handleVisibility = () =>
    this.setState(prevState => ({visible: !prevState.visible}))

  componentDidMount() {
    this.props.getFavArticles()
    this.props.getRecArticles()
    this.handleVisibility()
  }
  render() {
    const {visible} = this.state

    return (
      <Grid celled centered>
        {this.props.favArticles &&
          this.props.favArticles.map((article, idx) => (
            <Modal
              key={idx}
              trigger={
                <Button>
                  <Transition.Group animation="horizontal flip" duration={1000}>
                    {visible && (
                      <Card style={{marginTop: 50}}>
                        <Card.Content extra>
                          #{article.category.replace(/\w/, char =>
                            char.toUpperCase()
                          )}
                        </Card.Content>
                        <Image src={article.imageUrl} wrapped ui={false} />
                        <Card.Content>
                          <Card.Header>{article.title}</Card.Header>
                        </Card.Content>
                      </Card>
                    )}
                  </Transition.Group>
                </Button>
              }
            >
              <Modal.Header>{article.title}</Modal.Header>
              <Modal.Content image scrolling>
                <Image wrapped size="massive" src={article.imageUrl} wrapped />
                <Modal.Description>
                  {article.article.split('/n').map((paragraph, i) => {
                    return <p key={i + 1}>{paragraph}</p>
                  })}
                </Modal.Description>
              </Modal.Content>
              <Modal.Content>
                <RecArticle
                  recArticles={this.props.recArticles}
                  category={article.category}
                />
              </Modal.Content>
            </Modal>
          ))}
      </Grid>
    )
  }
}
const mapStateToProps = state => {
  return {
    favArticles: state.articles.favArticles,
    recArticles: state.articles.recArticles
  }
}
const mapDispatchToProps = dispatch => {
  return {
    getFavArticles: () => dispatch(getFavArticles()),
    getRecArticles: () => dispatch(getRecArticles())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Articles)
