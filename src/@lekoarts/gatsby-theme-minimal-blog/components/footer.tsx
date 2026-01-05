/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import useSiteMetadata from "@lekoarts/gatsby-theme-minimal-blog/src/hooks/use-site-metadata"

const Footer = () => {
  const { siteTitle } = useSiteMetadata()

  return (
    <footer
      sx={{
        boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `space-between`,
        mt: [6],
        color: `secondary`,
        a: {
          variant: `links.secondary`,
        },
        flexDirection: [`column`, `column`, `row`],
        variant: `dividers.top`,
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} Gustavo Vasquez.
      </div>
      <div>
        <a
          aria-label="Link to the theme's GitHub repository"
          href="https://github.com/LekoArts/gatsby-themes/tree/main/themes/gatsby-theme-minimal-blog"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ variant: `links.secondary` }}
        >
          Theme
        </a>
        {` `}
        by
        {` `}
        <a
          aria-label="Link to the theme author's website"
          href="https://www.lekoarts.de?utm_source=minimal-blog&utm_medium=Theme"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ variant: `links.secondary` }}
        >
          LekoArts
        </a>
      </div>
    </footer>
  )
}

export default Footer
