const { existsSync } = require('fs')
const { readdir, readFile, writeFile, mkdir, rm } = require('fs/promises')
const { join, resolve } = require('path')

require('dotenv').config()

const config = getConfig(process.env.NODE_ENV === 'PRODUCTION')

function getConfig (production) {
  const PORT = process.env.PORT || 3000
  const LOCAL_URL = (process.env.LOCAL_URL || `http://localhost`) + ':'
  return {
    SITE_URL: production ? 'https://yugaan24x7.github.io' : LOCAL_URL + PORT,
    HTML_FOLDER: 'material',
    PDF_FOLDER: 'files',
    OUT_DIR: production ? join('..', 'docs') : 'build'
  }
}

;(async () => {
  const files = (await readdir('../pdfs')).filter(file => file.endsWith('.pdf'))
  const template = await readFile('./templates/file.html', 'utf8')
  const indexTemplate = await readFile('./templates/index.html', 'utf8')
  const index = indexTemplate.replace('{{ template }}', files.map(file => `<li><a href="${join(config.HTML_FOLDER, file.replace('.pdf', ''))}">${file}</a></li>`).join('\n'))
  if (existsSync(resolve(config.OUT_DIR))) await rm(resolve(config.OUT_DIR), { recursive: true })
  await mkdir(resolve(config.OUT_DIR, config.HTML_FOLDER), {
    recursive: true
  }).catch(console.error)
  await Promise.all(
    [...files.map(async file => {
      const outputFilePath = join(
        '.',
        config.OUT_DIR,
        config.HTML_FOLDER,
        file
      ).replace('.pdf', '.html')
      const outputUrl = join(
        '..',
        config.PDF_FOLDER,
        file
      )
      const output = template.replace('{{ template }}', outputUrl)

      return writeFile(outputFilePath, output)
    }), writeFile(resolve(config.OUT_DIR, 'index.html'), index)]
  )
})()
