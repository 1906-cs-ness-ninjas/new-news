/* eslint-disable react/jsx-key */
import React, {Component} from 'react'
import {getFavArticles} from '../store/articles'
import {connect} from 'react-redux'
import {
  Card,
  Image,
  Grid,
  Transition,
  Form,
  Modal,
  Button
} from 'semantic-ui-react'

class Articles extends Component {
  constructor() {
    super()
    this.state = {visible: false}
    this.handleVisibility = this.handleVisibility.bind(this)
  }

  handleVisibility = () =>
    this.setState(prevState => ({visible: !prevState.visible}))

  async componentDidMount() {
    await this.props.getFavArticles()
    this.handleVisibility()
  }
  render() {
    const {visible} = this.state

    return (
      <Grid celled centered>
        {this.props.articles &&
          this.props.articles.map(article => (
            // <a href={article.url} key={article.id}>
            <Modal
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
                  {article.article.split('/n').map(paragraph => {
                    return <p>{paragraph}</p>
                  })}
                </Modal.Description>
              </Modal.Content>
            </Modal>

            // </a>
          ))}
      </Grid>
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
