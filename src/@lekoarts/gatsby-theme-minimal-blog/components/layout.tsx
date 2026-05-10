/** @jsx jsx */
import * as React from "react"
import { Global } from "@emotion/react"
import { Box, Container, jsx, get } from "theme-ui"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "@lekoarts/gatsby-theme-minimal-blog/src/components/mdx-components"
import Header from "@lekoarts/gatsby-theme-minimal-blog/src/components/header"
import Footer from "./footer"
import CodeStyles from "@lekoarts/gatsby-theme-minimal-blog/src/styles/code"
import SkipNavLink from "@lekoarts/gatsby-theme-minimal-blog/src/components/skip-nav"
import "katex/dist/katex.min.css"

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => (
  <MDXProvider components={MdxComponents}>
    <Global
      styles={(t) => ({
        "*": {
          boxSizing: `inherit`,
        },
        "[hidden]": {
          display: `none`,
        },
        "::selection": {
          backgroundColor: get(t, `colors.text`),
          color: get(t, `colors.background`),
        },
        /* Collapsible MDX spoilers: clear block boundaries for long `<details>` sections */
        "main details": {
          marginTop: `1.35rem`,
          marginBottom: `1.35rem`,
          padding: `0`,
          borderRadius: `8px`,
          overflow: `hidden`,
          border: `1px solid`,
          borderColor: get(t, `colors.muted`),
          backgroundColor: `color-mix(in srgb, ${get(t, `colors.text`)} 6%, ${get(t, `colors.background`)})`,
          boxShadow: `inset 4px 0 0 0 ${get(t, `colors.primary`)}`,
        },
        "main details summary": {
          cursor: `pointer`,
          display: `list-item`,
          padding: `0.65rem 1rem`,
          fontWeight: `600`,
          backgroundColor: `color-mix(in srgb, ${get(t, `colors.text`)} 4%, ${get(t, `colors.background`)})`,
          borderBottom: `1px solid`,
          borderBottomColor: get(t, `colors.muted`),
        },
        "main details summary::marker": {
          color: get(t, `colors.primary`),
          fontSize: `1.1em`,
        },
        /* Safari / legacy Chromium: native disclosure triangle */
        "main details summary::-webkit-details-marker": {
          color: get(t, `colors.primary`),
        },
        "main details > *:not(summary)": {
          paddingLeft: `1rem`,
          paddingRight: `1rem`,
        },
        "main details > *:not(summary):nth-child(2)": {
          paddingTop: `1rem`,
        },
        "main details > *:last-child:not(summary)": {
          paddingBottom: `1.15rem`,
        },
        /*
          Display math: gatsby-browser wraps KaTeX output in div.math-display-panel only.
          KaTeX’s own root keeps class `.katex-display` — styling `.katex-display` would match twice.
        */
        "main .math-display-panel": {
          marginTop: `1.15rem`,
          marginBottom: `1.15rem`,
          padding: `0.85rem 1rem`,
          textAlign: `center`,
          borderRadius: `8px`,
          /* One accent on the left only: avoid `border` + `inset` shadow (reads as two stripes) */
          border: `1px solid`,
          borderColor: get(t, `colors.muted`),
          borderLeft: `3px solid`,
          borderLeftColor: get(t, `colors.primary`),
          backgroundColor: `color-mix(in srgb, ${get(t, `colors.text`)} 5%, ${get(t, `colors.background`)})`,
          overflowX: `auto`,
        },
        "main .math-display-panel .katex": {
          margin: `0 auto`,
        },
        /* Inside spoilers, outer `<details>` already has the accent bar — uniform thin frame only */
        "main details .math-display-panel": {
          borderLeft: `1px solid ${get(t, `colors.muted`)}`,
        },
      })}
    />
    <SkipNavLink>Skip to content</SkipNavLink>
    <Container>
      <Header />
      <Box id="skip-nav" as="main" variant="layout.main" sx={{ ...CodeStyles }} className={className}>
        {children}
      </Box>
      <Footer />
    </Container>
  </MDXProvider>
)

export default Layout
