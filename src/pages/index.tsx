import * as React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Listing from "@lekoarts/gatsby-theme-minimal-blog/src/components/listing"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import { Text, Box, Flex } from "theme-ui"

interface IndexQuery {
  blogPosts: {
    nodes: any[]
  }
  projectPosts: {
    nodes: any[]
  }
}

const Index = ({ data }: PageProps<IndexQuery>) => {
  const blogPosts = data.blogPosts.nodes
  const projectPosts = data.projectPosts.nodes

  return (
    <Layout>
      {/* Welcome Section */}
      <Box sx={{ mb: [5, 6], p: { fontSize: [1, 2, 3], mt: 2 }, variant: `section_hero` }}>
        <Flex sx={{ alignItems: 'center', gap: 4, flexDirection: ['column', 'row'] }}>
          <Box sx={{ flexShrink: 0 }}>
            <img 
              src="/profile.jpg" 
              alt="Gustavo Vasquez" 
              style={{ 
                width: '200px', 
                height: '200px', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }} 
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Text sx={{ fontSize: [4, 5, 6], fontWeight: `bold`, color: `heading`, mb: 2 }}>
              Hi.
            </Text>
            <br />
            <br />
            <Text sx={{ fontSize: [2, 3], lineHeight: 1.6, mb: 3 }}>
              My name is{' '}
              <a 
                href="https://github.com/gus-vasquez" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--theme-ui-colors-primary)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Gustavo
              </a>
              .
            </Text>
            <br />
            <Text sx={{ fontSize: [2, 3], lineHeight: 1.6, mb: 3 }}>
              I'm an engineer by training and like all sorts of nerdy stuff.
            </Text>
            <br />
            <Text sx={{ fontSize: [2, 3], lineHeight: 1.6 }}>
              Check my{' '}
              <Link 
                to="/blog"
                style={{ 
                  color: 'var(--theme-ui-colors-primary)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                posts
              </Link>
              {' '}and{' '}
              <Link 
                to="/projects"
                style={{ 
                  color: 'var(--theme-ui-colors-primary)',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                projects
              </Link>
              .
            </Text>
          </Box>
        </Flex>
      </Box>
      
      {/* Latest Posts Section - showing BLOG posts */}
      <Box sx={{ mb: [4, 5] }}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Text as="h2" sx={{ fontSize: [3, 4], fontWeight: 'bold', color: 'heading', m: 0 }}>
            Latest Posts
          </Text>
          <Link 
            to="/blog"
            style={{ 
              color: 'var(--theme-ui-colors-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Read all posts
          </Link>
        </Flex>
        <Box sx={{ height: '1px', backgroundColor: 'text', mb: 3 }} />
        <Listing posts={blogPosts} />
      </Box>

      {/* Latest Projects Section - showing PROJECT posts */}
      <Box>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Text as="h2" sx={{ fontSize: [3, 4], fontWeight: 'bold', color: 'heading', m: 0 }}>
            Latest Projects
          </Text>
          <Link 
            to="/projects"
            style={{ 
              color: 'var(--theme-ui-colors-secondary)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Read all projects
          </Link>
        </Flex>
        <Box sx={{ height: '1px', backgroundColor: 'text', mb: 3 }} />
        <Listing posts={projectPosts} />
      </Box>
    </Layout>
  )
}

export default Index

export const Head: HeadFC = () => <Seo title="Home" />

export const query = graphql`
  query Index {
    blogPosts: allPost(
      filter: { tags: { elemMatch: { name: { eq: "blog" } } } }
      sort: { date: DESC }
      limit: 3
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
    projectPosts: allPost(
      filter: { tags: { elemMatch: { name: { eq: "project" } } } }
      sort: { date: DESC }
      limit: 3
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
