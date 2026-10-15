import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const outputDirectory = path.resolve('dist')
const configuredBasePath = process.env.BASE_PATH ?? '/'
const basePath = `/${configuredBasePath.split('/').filter(Boolean).join('/')}/`.replace(
  /^\/\/$/,
  '/'
)

if (basePath !== '/') {
  const files = await collectHtmlFiles(outputDirectory)

  for (const filePath of files) {
    const html = await readFile(filePath, 'utf8')
    const rewrittenHtml = html.replace(
      /\b(href|src|action|poster|cite|data-avatar-src)=(['"])(\/(?!\/)[^'"]*)\2/g,
      (_match, attribute, quote, value) => {
        if (value === basePath.slice(0, -1) || value.startsWith(basePath)) {
          return `${attribute}=${quote}${value}${quote}`
        }

        return `${attribute}=${quote}${basePath.slice(0, -1)}${value}${quote}`
      }
    )

    if (rewrittenHtml !== html) await writeFile(filePath, rewrittenHtml)
  }
}

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) return collectHtmlFiles(entryPath)
      return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : []
    })
  )

  return nestedFiles.flat()
}
