import * as React from "react"
import Layout from "@lekoarts/gatsby-theme-minimal-blog/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-minimal-blog/src/components/seo"
import { Text, Box, Flex } from "theme-ui"
import GoodreadsWidget from "../components/GoodreadsWidget"

const About = () => {
  // Add target="_blank" to external links in header
  React.useEffect(() => {
    const headerLinks = document.querySelectorAll('header a[href^="http"]');
    headerLinks.forEach((link) => {
      const anchorLink = link as HTMLAnchorElement;
      anchorLink.setAttribute('target', '_blank');
      anchorLink.setAttribute('rel', 'noopener noreferrer');
    });
  }, []);

  return (
    <Layout>
      <Seo title="About" />
      <Text as="h1" sx={{ fontSize: [4, 5, 6], fontWeight: 'bold', color: 'heading', mb: [4, 5] }}>
        About
      </Text>
      
      <Box sx={{ mb: [4, 5] }}>
        <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <img src="/stone.jpg" alt="Stone Mountain" style={{width: '400px', height: 'auto', display: 'block'}} />
          <div style={{fontSize: '0.875rem', textAlign: 'center', marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--theme-ui-colors-text)', lineHeight: '1.4'}}>
            <a href="https://en.wikipedia.org/wiki/Twelve-angled_stone" target="_blank" rel="noopener noreferrer" style={{color: 'var(--theme-ui-colors-primary)', textDecoration: 'none', fontSize: 'inherit'}}>
              The Twelve-Angled Stone, Cusco, Peru.
            </a>
          </div>
        </div>
      </Box>

      <Box sx={{ fontSize: [1, 2], lineHeight: 1.8, mb: [4, 5] }}>
        <Text sx={{ mb: 4 }}>
          I'm <strong>Gustavo Vasquez</strong>, an engineer based in New York.
          This is my{' '}
          <a 
            href="https://drive.google.com/file/d/1z1FY42QDfURfIz5l4_Yn3wucLXHQe4SD/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{color: 'var(--theme-ui-colors-primary)', fontWeight: 'bold', textDecoration: 'none'}}
          >
            CV
          </a>.
          <br />
        </Text>

        <Text sx={{ mb: 4 }}>
          My current interests include <em>(but are not limited)</em> to <strong>Machine Learning</strong> and <strong>Computer Science</strong>.
        </Text>
        <br />

        <Text sx={{ mb: 4 }}>
          The idea behind this blog is to <em>(somehow)</em> give some order and structure to my <em>(rather vague)</em> ideas and plans.
        </Text>
        <br />

        <Text sx={{ mb: 4 }}>
          I'm fluent in <strong>Spanish</strong>, <strong>English</strong> and <strong>Japanese</strong>.
          Currently learning <strong>Chinese</strong>.
        </Text>
      </Box>

      {/* Goodreads Widget */}
      <Box sx={{ mb: [4, 5], mt: [4, 5], display: 'flex', justifyContent: 'center' }}>
        <GoodreadsWidget />
      </Box>
    </Layout>
  )
}

export default About
