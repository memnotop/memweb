import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

import remarkObsidian from '../src/plugins/remark-obsidian'

async function render(
  value: string,
  {
    filePath = '/tmp/example.md',
    publicAssets = 'url'
  }: { filePath?: string; publicAssets?: 'import' | 'url' } = {}
) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkObsidian, { publicAssets })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process({ value, path: filePath })

  return String(file)
}

test('Obsidian tags are transformed once without nested links', async () => {
  const html = await render('正文 #标签')

  assert.equal(html.match(/<a\b/g)?.length, 1)
  assert.match(html, /href="\/tags\/%E6%A0%87%E7%AD%BE"/)
})

test('Obsidian syntax is not transformed inside existing Markdown links', async () => {
  const html = await render('[已有链接 #标签](https://example.com)')

  assert.equal(html.match(/<a\b/g)?.length, 1)
  assert.match(html, /href="https:\/\/example\.com"/)
  assert.doesNotMatch(html, /\/tags\//)
})

test('Obsidian syntax is not transformed in formatted link labels', async () => {
  const html = await render('[已有链接 **#标签**](https://example.com)')

  assert.equal(html.match(/<a\b/g)?.length, 1)
  assert.match(html, /<strong>#标签<\/strong>/)
  assert.doesNotMatch(html, /\/tags\//)
})

test('Obsidian note links resolve to the canonical Astro content route', async () => {
  const filePath = path.join(process.cwd(), 'src/content/2026/Technical/setup-guide/index.md')
  const html = await render('[[setup-guide#frontmatter]]', { filePath })

  assert.match(html, /href="\/blog\/2026\/technical\/setup-guide#frontmatter"/)
})

test('Obsidian content paths and aliases resolve to the same article route', async () => {
  const html = await render('[[src/content/2026/Technical/setup-guide/index|Setup guide]]')

  assert.match(html, /href="\/blog\/2026\/technical\/setup-guide"/)
  assert.match(html, />Setup guide<\/a>/)
})

test('public Obsidian images stay as root URLs outside the Astro image pipeline', async () => {
  const html = await render('![[/images/social-card.svg]]')

  assert.match(html, /src="\/images\/social-card\.svg"/)
})

test('Astro content rendering can opt public Obsidian images into asset imports', async () => {
  const filePath = path.join(process.cwd(), 'src/content/2026/Technical/setup-guide/index.md')
  const html = await render('![[/images/social-card.svg]]', {
    filePath,
    publicAssets: 'import'
  })

  assert.match(html, /src="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/public\/images\/social-card\.svg"/)
})
