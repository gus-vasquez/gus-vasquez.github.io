import * as fs from 'fs'
import * as path from 'path'

export const onPostBuild = async ({ reporter }: { reporter: any }) => {
  reporter.info('Starting post-build HTML modification for external links...')
  
  try {
    // Find all HTML files in the public directory
    const publicDir = path.join(__dirname, 'public')
    const htmlFiles = findHtmlFiles(publicDir)
    
    reporter.info(`Found ${htmlFiles.length} HTML files to process`)
    
    for (const filePath of htmlFiles) {
      await modifyHtmlFile(filePath, reporter)
    }
    
    reporter.info('Successfully modified all HTML files')
  } catch (error) {
    reporter.error('Error during post-build HTML modification:', error)
  }
}

function findHtmlFiles(dir: string): string[] {
  const files: string[] = []
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        traverse(fullPath)
      } else if (item.endsWith('.html')) {
        files.push(fullPath)
      }
    }
  }
  
  traverse(dir)
  return files
}

async function modifyHtmlFile(filePath: string, reporter: any) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Use regex to find external links in header and add target="_blank"
    const modifiedContent = content.replace(
      /(<a[^>]*href="https?:\/\/[^"]*"[^>]*class="[^"]*css-aizfxq[^"]*"[^>]*>)/g,
      (match) => {
        // Check if target="_blank" is already present
        if (match.includes('target="_blank"')) {
          return match
        }
        
        // Add target="_blank" and rel="noopener noreferrer"
        return match.replace('>', ' target="_blank" rel="noopener noreferrer">')
      }
    )
    
    if (content !== modifiedContent) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8')
      reporter.info(`Modified: ${path.relative(process.cwd(), filePath)}`)
    }
  } catch (error) {
    reporter.error(`Error modifying ${filePath}:`, error)
  }
}
