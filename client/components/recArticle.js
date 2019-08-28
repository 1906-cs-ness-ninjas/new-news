import React from 'react'
import {Image, Grid, Header} from 'semantic-ui-react'

export default function RecArticle(props) {
  const recommendedArticle = props.recArticles.filter(
    article => article.category === props.category
  )
  const index = Math.floor(Math.random() * recommendedArticle.length)
  return (
    <Grid>
      <Grid.Row
        href={recommendedArticle[index] && recommendedArticle[index].url}
      >
        {/* <a href={recommendedArticle[index].url}> */}
        <Image
          src={recommendedArticle[index] && recommendedArticle[index].imageUrl}
          wrapped
          ui={false}
          height={50}
        />
        <Header as="h4">
          {recommendedArticle[index] && recommendedArticle[index].title}
        </Header>
      </Grid.Row>
    </Grid>
  )
}
