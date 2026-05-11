/** @jsx jsx */
import * as React from "react"
import { jsx, Box, Text } from "theme-ui"
import { Link } from "gatsby"
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags"

type BlogListItemProps = {
  post: {
    slug: string
    title: string
    date: string
    excerpt: string
    description: string
    timeToRead?: number
    pinned?: boolean
    tags?: {
      name: string
      slug: string
    }[]
  }
  showTags?: boolean
}

const BlogListItem = ({ post, showTags = true }: BlogListItemProps) => (
  <Box mb={4}>
    <Box sx={{ display: `flex`, alignItems: `baseline`, flexWrap: `wrap`, columnGap: 2, rowGap: 1 }}>
      <Link to={post.slug} sx={(t) => ({ ...t.styles?.a, fontSize: [1, 2, 3], color: `text` })}>
        {post.title}
      </Link>
      {post.pinned ? (
        <Text
          as="span"
          sx={{
            color: `text`,
            fontSize: 0,
            fontWeight: `bold`,
            textTransform: `uppercase`,
            letterSpacing: `0.05em`,
            display: `inline-flex`,
            alignItems: `center`,
            gap: 1,
            px: 2,
            py: 1,
            borderRadius: 9999,
            bg: `muted`,
            border: `1px solid`,
            borderColor: `secondary`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="7" r="3" />
            <path d="M9 10h6v5H9z" />
            <path d="M12 15v6" />
          </svg>
          Pinned
        </Text>
      ) : null}
    </Box>
    <p sx={{ color: `secondary`, mt: 1, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
      <time>{post.date}</time>
      {post.tags && showTags && (
        <React.Fragment>
          {` — `}
          <ItemTags tags={post.tags} />
        </React.Fragment>
      )}
    </p>
  </Box>
)

export default BlogListItem
