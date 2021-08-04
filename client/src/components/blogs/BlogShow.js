import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchBlog } from 'actions'

class BlogShow extends Component {

  componentDidMount () {
    const { dispatch, match } = this.props
    dispatch(fetchBlog(match.params._id))
  }

  renderImage() {
    if (this.props.blog.imageUrl) {
      return <img src={'https://my-blog-project-bucket-2021.s3.ap-northeast-1.amazonaws.com/' + this.props.blog.imageUrl} style={{ maxWidth: '1000px', maxHeight: '600px' }} alt="blog-main-pic"/>
    }
  }

  render () {
    const { blog } = this.props
    
    if (!blog) return ''

    const { title, content } = blog
    return (
      <>
        <h3>{title}</h3>
        <p>{content}</p>
        {this.renderImage()}
      </>
    )
  }
}

const mapStateToProps = ({ blogs }, ownProps) => ({ 
  blog: blogs[ownProps.match.params._id] 
})

export default connect(mapStateToProps)(BlogShow)
