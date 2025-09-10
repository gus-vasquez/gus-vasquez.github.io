import * as React from "react"

const GoodreadsWidget: React.FC = (): JSX.Element => {
  React.useEffect(() => {
    // Load the Goodreads script
    const script = document.createElement('script')
    script.src = 'https://www.goodreads.com/review/custom_widget/187073912.Books%20in%20Progress?cover_position=left&cover_size=medium&num_books=5&order=a&shelf=currently-reading&show_author=1&show_cover=1&show_rating=1&show_review=1&show_tags=1&show_title=1&sort=date_added&widget_bg_color=FFFFFF&widget_bg_transparent=true&widget_border_width=2&widget_id=1757474327&widget_text_color=FFFFFF&widget_title_size=large&widget_width=medium'
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    
    // Append to head
    document.head.appendChild(script)
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div>
      <style type="text/css" media="screen">
        {`
          .gr_custom_container_1757474327 {
            /* customize your Goodreads widget container here*/
            border: 2px solid gray;
            border-radius:10px;
            padding: 10px 5px 10px 5px;
            background-color: transparent;
            color: #FFFFFF;
            width: 300px
          }
          .gr_custom_header_1757474327 {
            /* customize your Goodreads header here*/
            border-bottom: 1px solid gray;
            width: 100%;
            margin-bottom: 5px;
            text-align: center;
            font-size: 150%
          }
          .gr_custom_each_container_1757474327 {
            /* customize each individual book container here */
            width: 100%;
            clear: both;
            margin-bottom: 10px;
            overflow: auto;
            padding-bottom: 4px;
            border-bottom: 1px solid #aaa;
          }
          .gr_custom_book_container_1757474327 {
            /* customize your book covers here */
            overflow: hidden;
            height: 160px;
            float: left;
            margin-right: 4px;
            width: 98px;
          }
          .gr_custom_author_1757474327 {
            /* customize your author names here */
            font-size: 10px;
          }
          .gr_custom_tags_1757474327 {
            /* customize your tags here */
            font-size: 10px;
            color: gray;
          }
          .gr_custom_rating_1757474327 {
            /* customize your rating stars here */
            float: right;
          }
        `}
      </style>

      <div id="gr_custom_widget_1757474327">
        {/* Dynamic content will be loaded here by the Goodreads script */}
      </div>
    </div>
  )
}

export default GoodreadsWidget
