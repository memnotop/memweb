import path from 'node:path'
import type { AstroGlobal, ImageMetadata } from 'astro'
import { getImage } from 'astro:assets'
import type { CollectionEntry } from 'astro:content'
import rss from '@astrojs/rss'
import type { Root } from 'mdast'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import config from 'virtual:config'

import { getSortedArticlePosts } from '@/utils/blog'
import remarkObsidian from '@/plugins/remark-obsidian'

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{jpeg,jpg,png,gif,avif,webp}'
)
const projectRoot = process.cwd()

const renderContent = async (post: CollectionEntry<'blog'>, site: URL, siteBase: URL) => {
  const resolveImagePath = (url: string) => {
    if (/^[a-z]+:/i.test(url) || !post.filePath) return undefined
    return path.resolve(path.dirname(post.filePath), url)
  }

  const getPublicImageUrl = (url: string) => {
    const resolvedPath = resolveImagePath(url)
    if (!resolvedPath) return undefined

    const publicRoot = path.join(projectRoot, 'public')
    const relativePath = path.relative(publicRoot, resolvedPath)
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) return undefined

    return new URL(relativePath.split(path.sep).join('/'), siteBase).href
  }

  const getLocalImagePath = (url: string) => {
    const resolvedPath = resolveImagePath(url)
    if (!resolvedPath) return undefined
    const relativePath = path.relative(projectRoot, resolvedPath)
    if (relativePath.startsWith('..')) return undefined

    const globKey = `/${relativePath.split(path.sep).join('/')}`
    return imagesGlob[globKey] ? globKey : undefined
  }

  // Replace image links with the correct path
  function remarkReplaceImageLink() {
    /**
     * @param {Root} tree
     */
    return async function (tree: Root) {
      const promises: Promise<void>[] = []
      visit(tree, 'image', (node) => {
        if (node.url.startsWith('/')) {
          node.url = new URL(
            `${import.meta.env.BASE_URL}${node.url.replace(/^\/+/, '')}`,
            site
          ).href
        } else {
          const publicImageUrl = getPublicImageUrl(node.url)
          if (publicImageUrl) {
            node.url = publicImageUrl
            return
          }

          const imagePath = getLocalImagePath(node.url)
          const promise =
            imagePath &&
            imagesGlob[imagePath]?.().then(async (res) => {
              const imageMetadata = res?.default
              if (imageMetadata) {
                const optimizedImage = await getImage({ src: imageMetadata })
                const optimizedPath = optimizedImage.src.startsWith(import.meta.env.BASE_URL)
                  ? optimizedImage.src
                  : `${import.meta.env.BASE_URL}${optimizedImage.src.replace(/^\/+/, '')}`
                node.url = new URL(optimizedPath, site).href
              }
            })
          if (promise) promises.push(promise)
        }
      })
      await Promise.all(promises)
    }
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkObsidian)
    .use(remarkAlert)
    .use(remarkReplaceImageLink)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process({
      value: post.body,
      path: post.filePath ?? path.join(projectRoot, 'src/content', `${post.id}.md`)
    })

  return String(file)
}

const GET = async (context: AstroGlobal) => {
  const allPostsByDate = (await getSortedArticlePosts()) as CollectionEntry<'blog'>[]
  const siteUrl = context.site ?? new URL(import.meta.env.SITE)
  const configuredBasePath = process.env.BASE_PATH ?? import.meta.env.BASE_URL
  const siteBaseUrl = new URL(
    `${configuredBasePath.split('/').filter(Boolean).join('/')}/`,
    siteUrl
  )

  return rss({
    // Basic configs
    trailingSlash: false,
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    stylesheet: new URL('scripts/pretty-feed-v3.xsl', siteBaseUrl).href,

    // Contents
    title: config.title,
    description: config.description,
    site: siteBaseUrl,
    items: await Promise.all(
      allPostsByDate.map(async (post) => {
        const heroImage =
          typeof post.data.heroImageSrc === 'string'
            ? post.data.heroImageSrc
            : post.data.heroImageSrc?.src
        const heroImageUrl = heroImage
          ? heroImage.startsWith('/')
            ? new URL(`${import.meta.env.BASE_URL}${heroImage.replace(/^\/+/, '')}`, siteUrl).href
            : new URL(heroImage, siteUrl).href
          : undefined

        return {
          pubDate: post.data.publishDate,
          link: new URL(`blog/${post.id}`, siteBaseUrl).href,
          customData: heroImageUrl
            ? `<h:img src="${heroImageUrl}" /><enclosure url="${heroImageUrl}" />`
            : undefined,
          content: await renderContent(post, siteUrl, siteBaseUrl),
          ...post.data
        }
      })
    )
  })
}

export { GET }
