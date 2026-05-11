import * as React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import { Text } from "theme-ui"
import { sortPostsWithPinnedFirst } from "../utils/sort-posts-with-pinned"

interface ProjectsQuery {
  posts: {
    nodes: any[]
  }
}

const Projects = ({ data }: PageProps<ProjectsQuery>) => {
  const posts = sortPostsWithPinnedFirst(data.posts.nodes).map(({ fields, ...post }) => ({
    ...post,
    pinned: fields?.pinned ?? false,
  }))

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Text as="h1" sx={{ fontSize: [4, 5, 6], fontWeight: 'bold', color: 'heading', m: 0 }}>Projects</Text>
        <Link 
          to="/tags"
          style={{ 
            color: 'var(--theme-ui-colors-secondary)',
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          View all tags
        </Link>
      </div>
      <Listing posts={posts} sx={{ mt: [4, 5] }} />
    </Layout>
  )
}

export default Projects

export const Head: HeadFC = () => <Seo title="Projects" />

export const query = graphql`
  query Projects {
    posts: allPost(
      filter: { tags: { elemMatch: { name: { eq: "project" } } } }
      sort: { date: DESC }
    ) {
      nodes {
        sortDate: date
        slug
        title
        date(formatString: "MMMM D, YYYY")
        excerpt
        description
        timeToRead
        tags {
          name
          slug
        }
        banner {
          childImageSharp {
            small: gatsbyImageData(width: 760, quality: 90)
          }
        }
        ... on MdxPost {
          fields {
            pinned
          }
        }
      }
    }
  }
`
