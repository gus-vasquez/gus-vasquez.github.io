/** @jsx jsx */
import { jsx } from "theme-ui"
import type { ThemeUIStyleObject } from "theme-ui"
import BlogListItem from "./blog-list-item"

type ListingProps = {
  posts: {
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
  }[]
  className?: string
  showTags?: boolean
  sx?: ThemeUIStyleObject
}

const Listing = ({ posts, className = ``, showTags = true, sx: sxProp }: ListingProps) => (
  <section sx={sxProp ? { mb: [5, 6, 7], ...sxProp } : { mb: [5, 6, 7] }} className={className}>
    {posts.map((post) => (
      <BlogListItem key={post.slug} post={post} showTags={showTags} />
    ))}
  </section>
)

export default Listing
