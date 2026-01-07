import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import { Text } from "theme-ui"

interface BlogQuery {
  posts: {
    nodes: any[]
  }
}

const Blog = ({ data }: PageProps<BlogQuery>) => {
  const posts = data.posts.nodes

  // Add target="_blank" to external links in header
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const headerLinks = document.querySelectorAll('header a[href^="http"]');
    headerLinks.forEach((link) => {
      const anchorLink = link as HTMLAnchorElement;
      anchorLink.setAttribute('target', '_blank');
      anchorLink.setAttribute('rel', 'noopener noreferrer');
    });
  }, []);

  return (
    <Layout>
      <Seo title="Blog" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <Text as="h1" sx={{ fontSize: [4, 5, 6], fontWeight: 'bold', color: 'heading', m: 0 }}>Blog</Text>
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

export default Blog

export const query = graphql`
  query Blog {
    posts: allPost(
      filter: { tags: { elemMatch: { name: { eq: "blog" } } } }
      sort: { date: DESC }
    ) {
      nodes {
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
      }
    }
  }
`
