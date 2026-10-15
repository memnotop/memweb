import { loadEnv } from 'vite'

import type { Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export type BlogTopicSourceField = 'tags' | 'repositories'

export type BlogTopic = {
  slug: string
  title: string
  description: string
  source: {
    field: BlogTopicSourceField
    values: string[]
  }
}

export const blogTopics = [
  {
    slug: 'life',
    title: 'Life',
    description: 'Personal writing and everyday observations.',
    source: {
      field: 'repositories',
      values: ['life']
    }
  },
  {
    slug: 'books',
    title: 'Books',
    description: 'Reading notes, book reviews, and research summaries.',
    source: {
      field: 'repositories',
      values: ['books']
    }
  },
  {
    slug: 'movies',
    title: 'Movies',
    description: 'Film reviews and notes on visual media.',
    source: {
      field: 'repositories',
      values: ['movies']
    }
  },
  {
    slug: 'technical',
    title: 'Technical',
    description: 'Technical articles, tools, tutorials, and project notes.',
    source: {
      field: 'repositories',
      values: ['technical']
    }
  }
] satisfies BlogTopic[]

export function getBlogTopic(slug: string) {
  const topic = blogTopics.find((item) => item.slug === slug)
  if (!topic) throw new Error(`Unknown blog topic: ${slug}`)
  return topic
}

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_')
const walineServer = (process.env.PUBLIC_WALINE_SERVER ?? env.PUBLIC_WALINE_SERVER ?? '').trim()
export const footerQuotes = [
  'Write once, publish anywhere.',
  'A small post is a good place to start.',
  'Make this site your own.',
  'Keep your ideas in plain text.',
  'Build a website at your own pace.'
]

function createRandomQuoteTarget(quotes: string[]) {
  return `() => {
    const quotes = ${JSON.stringify(quotes)}
    return quotes[Math.floor(Math.random() * quotes.length)] || ''
  }`
}

export const theme: ThemeUserConfig = {
  // === Basic configuration ===
  /** Title for your website. Will be used in metadata and as browser tab title. */
  title: 'MemWeb | Astro Blog Starter',
  /** Will be used in index page & copyright declaration */
  author: 'Site Owner',
  /** Description metadata for your website. Can be used in page metadata. */
  description: 'A customizable blog starter built with Astro.',
  /** The default favicon for your site which should be a path to an image in the `public/` directory. */
  favicon: '/favicon/favicon.svg',
  /** Specify the default language for this site. */
  locale: {
    lang: 'zh-CN',
    attrs: 'zh_CN',
    // Date locale
    dateLocale: 'zh-CN',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  /** Set a logo image to show in the homepage. */
  logo: {
    src: 'src/assets/avatar.svg',
    alt: 'Site logo'
  },

  // === Global configuration ===
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // Still in test
  head: [
    /* Telegram channel */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** Configure the header of your site. */
  header: {
    menu: [
      { title: 'Home', link: '/' },
      {
        title: 'Blog',
        link: '/blog',
        children: blogTopics.map(({ slug, title }) => ({ title, link: `/blog/${slug}` }))
      },
      { title: 'Training', link: '/training' },
      { title: 'Notes', link: '/notes', description: 'Short dated thoughts' },
      { title: 'Links', link: '/links' },
      { title: 'About', link: '/about' },
      { title: 'Projects', link: '/projects' }
    ]
  },

  /** Configure the footer of your site. */
  footer: {
    // Year format
    year: `© ${new Date().getFullYear()}`,
    // year: `© 2019 - ${new Date().getFullYear()}`,
    links: [
      // Registration link
      {
        title: 'GitHub Pages',
        link: 'https://pages.github.com/',
        style: 'text-xs text-muted-foreground' // Uno/TW CSS class
      }
    ],
    /** Enable displaying a “Astro & Pure theme powered” link in your site’s footer. */
    credits: false,
    /** Optional details about the social media accounts for this site. */
    social: {}
  },

  content: {
    /** External links configuration */
    externalLinks: {
      content: ' ↗',
      /** Properties for the external links element */
      properties: {
        style: 'user-select:none'
      }
    },
    /** Blog page size for pagination (optional) */
    blogPageSize: 8,
    // Currently support weibo, x, bluesky
    share: []
  },
  signature: false
}

export const integ: IntegrationUserConfig = {
  // Enable page search function
  pagefind: true,
  // Add a random quote to the footer (default on homepage footer)
  // See: https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  quote: {
    server: 'data:application/json,{}',
    target: createRandomQuoteTarget(footerQuotes)
    // https://github.com/lukePeavey/quotable
    // server: 'https://api.quotable.io/quotes/random?maxLength=60',
    // target: `(data) => data[0].content || 'Error'`
  },
  // UnoCSS typography
  // See: https://unocss.dev/presets/typography
  typography: {
    class: 'prose text-base text-muted-foreground',
    // The style of blockquote font, normal or italic (default to italic in typography)
    blockquoteStyle: 'italic',
    // The style of inline code block, code or modern (default to code in typography)
    inlineCodeBlockStyle: 'modern'
  },
  // A lightbox library that can add zoom effect
  // See: https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // disable it will not load the whole library
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // Comment system
  waline: {
    enable: Boolean(walineServer),
    // Set PUBLIC_WALINE_SERVER in your environment after deploying Waline server.
    server: walineServer,
    // Refer https://waline.js.org/en/guide/features/emoji.html
    emoji: ['bmoji', 'weibo'],
    // Refer https://waline.js.org/en/reference/client/props.html
    additionalConfigs: {
      // search: false,
      pageview: true,
      comment: true,
      lang: 'zh-CN',
      noRss: true,
      noCopyright: true,
      locale: {
        like: '喜欢',
        cancelLike: '取消喜欢',
        reaction0: 'Like',
        placeholder: '欢迎留言。填写邮箱可以接收回复，无需登录。',
        subPostComment: '订阅本文评论',
        subSiteComment: '订阅本站评论',
        subscribeToReplies: '订阅你的评论回复'
      },
      imageUploader: false
    }
  }
}

const config = { ...theme, integ } as Config
export default config
