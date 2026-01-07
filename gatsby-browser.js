// Client-side math rendering using KaTeX
// This processes math expressions after MDX renders the content
import katex from "katex"
import "katex/dist/katex.min.css"

const renderMath = () => {
  if (typeof window === "undefined") return

  // Find all content areas that might contain math
  const contentSelectors = [
    "main article",
    "main section",
    "[class*='mdx']",
    "main > div > div",
  ]

  contentSelectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      // Skip if already processed
      if (element.dataset.mathProcessed) return
      element.dataset.mathProcessed = "true"

      // Process inline math in code elements (format: `$...$`)
      const inlineCodeElements = element.querySelectorAll("code:not(pre code)")
      inlineCodeElements.forEach((codeEl) => {
        const text = codeEl.textContent?.trim()
        if (text && text.startsWith("$") && text.endsWith("$") && text.length > 2) {
          const mathContent = text.slice(1, -1)
          try {
            const mathHtml = katex.renderToString(mathContent, {
              displayMode: false,
              throwOnError: false,
            })
            const span = document.createElement("span")
            span.innerHTML = mathHtml
            if (codeEl.parentNode) {
              codeEl.parentNode.replaceChild(span, codeEl)
            }
          } catch (e) {
            // Silently fail - leave as is
          }
        }
      })

      // Process display math in code blocks (format: ```...```)
      const displayCodeBlocks = element.querySelectorAll("pre code")
      displayCodeBlocks.forEach((codeBlock) => {
        if (codeBlock.dataset.mathRendered) return

        const preElement = codeBlock.parentElement

        // Get className handling both string and DOMTokenList
        const getClassName = (el) => {
          if (!el?.className) return ""
          if (typeof el.className === "string") return el.className
          if (el.className.toString) return el.className.toString()
          return ""
        }

        const preClassName = getClassName(preElement)
        const codeClassName = getClassName(codeBlock)

        // Skip code blocks with actual language classes (e.g., "language-python")
        const hasActualLanguage =
          /language-[a-zA-Z0-9]+/.test(preClassName) ||
          /language-[a-zA-Z0-9]+/.test(codeClassName)

        if (hasActualLanguage) return

        const text = codeBlock.textContent?.trim()
        if (!text) return

        // Check if it looks like LaTeX math first (before code detection)
        const hasBackslash = text.includes("\\")
        const hasLaTeXCommand =
          hasBackslash &&
          (text.includes("\\frac") ||
            text.includes("\\sum") ||
            text.includes("\\sqrt") ||
            text.includes("\\mathbf") ||
            text.includes("\\langle") ||
            text.includes("\\rangle") ||
            text.includes("\\text") ||
            text.match(/\\[a-zA-Z]+/))
        
        // Math notation: subscripts/superscripts with curly braces (e.g., e^{-E_a / (RT)})
        const hasMathNotation = (text.includes("^") || text.includes("_")) && /[{}]/.test(text)
        const isMath = hasLaTeXCommand || hasMathNotation

        // Skip if it looks like code (but not if it's math)
        const looksLikeCode =
          !isMath &&
          (text.includes("import ") ||
            text.includes("def ") ||
            text.includes("class ") ||
            text.includes("print(") ||
            text.includes("return ") ||
            text.includes("from ") ||
            text.includes("//") ||
            text.includes("# ") ||
            (text.includes("=") && text.includes("(") && text.includes(")") && !text.includes("\\")))

        if (looksLikeCode) return

        // Process if it has LaTeX commands OR math notation (subscripts/superscripts)
        if (text.length < 500 && isMath) {
          try {
            const mathHtml = katex.renderToString(text, {
              displayMode: true,
              throwOnError: true,
            })

            codeBlock.dataset.mathRendered = "true"

            const wrapper = document.createElement("div")
            wrapper.style.textAlign = "center"
            wrapper.style.margin = "1em 0"
            wrapper.style.overflowX = "auto"
            wrapper.className = "katex-display"
            wrapper.innerHTML = mathHtml

            const parentToReplace = codeBlock.parentElement
            if (parentToReplace?.parentNode) {
              // Delay replacement to avoid hydration issues
              setTimeout(() => {
                if (parentToReplace?.parentNode) {
                  parentToReplace.parentNode.replaceChild(wrapper, parentToReplace)
                }
              }, 0)
            }
          } catch (e) {
            // Silently fail - not valid LaTeX
          }
        }
      })
    })
  })
}

// Run renderMath with delays to catch content loaded at different times
// Use longer delays to ensure React hydration is complete
const runRenderMath = () => {
  if (typeof window === "undefined") return
  // Wait for React to fully hydrate before manipulating DOM
  setTimeout(renderMath, 500)
  setTimeout(renderMath, 1000)
  setTimeout(renderMath, 2000)
}

// Run on route change
export const onRouteUpdate = () => {
  runRenderMath()
}

// Run on initial load
export const onInitialClientRender = () => {
  runRenderMath()

  // Watch for dynamically added content
  if (typeof window !== "undefined" && window.MutationObserver) {
    const observer = new MutationObserver(() => {
      setTimeout(renderMath, 500)
    })

    const main = document.querySelector("main")
    if (main) {
      observer.observe(main, {
        childList: true,
        subtree: true,
      })
    }
  }
}
