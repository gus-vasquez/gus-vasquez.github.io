/** @jsx jsx */
import * as React from "react"
import { jsx, Box, Text } from "theme-ui"
import { Link } from "gatsby"
import ItemTags from "@lekoarts/gatsby-theme-minimal-blog/src/components/item-tags"

export type BannerImage = {
  childImageSharp?: {
    small?: {
      images?: {
        fallback?: {
          src?: string
          srcSet?: string
          sizes?: string
        }
      }
    } | null
  } | null
} | null

export type BlogListItemPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  description: string
  timeToRead?: number
  pinned?: boolean
  banner?: BannerImage
  tags?: {
    name: string
    slug: string
  }[]
}

type BlogListItemProps = {
  post: BlogListItemPost
  showTags?: boolean
}

const BlogListItem = ({ post, showTags = true }: BlogListItemProps) => {
  const thumbnail = post.banner?.childImageSharp?.small?.images?.fallback
  const summary = post.description || post.excerpt

  return (
    <Box
      as="article"
      sx={{
        display: `flex`,
        alignItems: `flex-start`,
        justifyContent: `space-between`,
        gap: [3, 4],
        mb: 4,
      }}
    >
      <Box sx={{ flex: `1 1 auto`, minWidth: 0 }}>
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
        {summary ? (
          <Text
            as="p"
            sx={{
              color: `secondary`,
              mt: 2,
              mb: 0,
              fontSize: [1, 1, 2],
              lineHeight: `body`,
              display: `-webkit-box`,
              WebkitBoxOrient: `vertical`,
              WebkitLineClamp: 2,
              overflow: `hidden`,
            }}
          >
            {summary}
          </Text>
        ) : null}
        <p sx={{ color: `secondary`, mt: 2, mb: 0, a: { color: `secondary` }, fontSize: [1, 1, 2] }}>
          <time>{post.date}</time>
          {post.tags && showTags && (
            <React.Fragment>
              {` — `}
              <ItemTags tags={post.tags} />
            </React.Fragment>
          )}
        </p>
      </Box>
      {thumbnail?.src ? (
        <Link
          to={post.slug}
          aria-label={`Read ${post.title}`}
          sx={{
            display: `block`,
            flex: `0 0 auto`,
            width: [`6rem`, `8rem`, `10rem`],
            mt: 1,
          }}
        >
          <img
            src={thumbnail.src}
            srcSet={thumbnail.srcSet}
            sizes={thumbnail.sizes}
            alt=""
            sx={{
              display: `block`,
              width: `100%`,
              height: [`4.5rem`, `5.5rem`, `6.5rem`],
              objectFit: `cover`,
              borderRadius: 2,
            }}
          />
        </Link>
      ) : null}
    </Box>
  )
}

export default BlogListItem
