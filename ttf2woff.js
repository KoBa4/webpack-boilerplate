const path = require('path')
const fs = require('fs').promises
const fse = require('fs-extra')
const Fontmin = require('fontmin')
const fonts = require('@hayes0724/web-font-converter/src/lib/fonts')

let argv = require('minimist')(process.argv.slice(2))
const { mode = 'modern' } = argv // "oldie", "recent" or "modern"

const srcFonts = path.resolve(__dirname, 'src/styles/base/_fonts.scss')
const folderFonts = path.resolve(__dirname, 'src/assets/fonts')
const outputFolderFonts = path.resolve(__dirname, 'src/assets/fonts/converted')
let style = 'normal'

const checkWeight = fontName => {
  let weight
  switch (true) {
    case /Thin/g.test(fontName):
      weight = 100
      break
    case /(ExtraLight|UltraLight)/g.test(fontName):
      weight = 200
      break
    case /Light/g.test(fontName):
      weight = 300
      break
    case /(Normal|Regular)/g.test(fontName):
      weight = 400
      break
    case /Medium/g.test(fontName):
      weight = 500
      break
    case /(Semi|SemiBold|DemiBold)/g.test(fontName):
      weight = 600
      break
    case /Bold/g.test(fontName):
      weight = 700
      break
    case /(ExtraBold|UltraBold)/g.test(fontName):
      weight = 800
      break
    case /(Black|Heavy)/g.test(fontName):
      weight = 900
      break
    default:
      weight = 400
  }
  return weight
}
(async function () {
  try {
    await rmFonts(outputFolderFonts)
    // await fse.emptyDir(outputFolderFonts)
    // await fse.outputFile(`${outputFolderFonts}/.keep`, '', 'utf-8')
    await fse.outputFile(srcFonts, '', 'utf-8')
    const allFiles = await fs.readdir(folderFonts, { withFileTypes: true })
    const files = allFiles.filter(dirent => dirent.isFile()).map(dirent => dirent.name)

    let cFontName = ''
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      let [fontname] = file.split('.')
      let [font] = fontname.split('-')
      let weight = checkWeight(fontname)

      if (cFontName !== fontname) {
        if (/Italic/.test(fontname)) {
          style = 'italic'
        }
        // eslint-disable-next-line no-await-in-loop
        await fs.appendFile(
          srcFonts,
          // eslint-disable-next-line max-len
          `@include font-face("${font}", "../assets/fonts/converted/${fontname}", ${weight}, ${style}, "${mode}");\r\n`,
          undefined
        )

        /* eslint-disable no-await-in-loop */
        switch (true) {
          case file.endsWith('.svg'):
            await fromSVG(fontname)
            break
          case file.endsWith('.otf'):
            await fromOTF(fontname)
            break
          case file.endsWith('.ttf'):
            await fromTTF(fontname)
            break
          case file.endsWith('.woff'):
          case file.endsWith('.woff2'):
            await copyFonts(file)
            break
          default:
            console.log(`${file} not supported`)
        }
        /* eslint-enable no-await-in-loop */
      }
      cFontName = fontname
    }

    console.log('Fonts converted!')
  } catch (e) {
    console.log(e)
  }
})()

async function rmFonts(dir) {
  // eslint-disable-next-line no-useless-catch
  try {
    const files = await fs.readdir(dir)

    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      if (!file.endsWith('.keep')) {
        // eslint-disable-next-line no-await-in-loop
        await fs.unlink(path.join(dir, file))
      }
    }
  } catch (err) {
    throw err
  }
}

async function copyFonts(file) {
  await fse.copy(`${folderFonts}/${file}`, `${outputFolderFonts}/${file}`)
}

async function fromTTF(fontName) {
  fonts.ttf.convert.woff2(
    `${folderFonts}/${fontName}.ttf`,
    `${outputFolderFonts}/${fontName}.woff2`
  )
  fonts.ttf.convert.woff(`${folderFonts}/${fontName}.ttf`, `${outputFolderFonts}/${fontName}.woff`)

  if (mode === 'recent') {
    await fse.copy(`${folderFonts}/${fontName}.ttf`, `${outputFolderFonts}/${fontName}.ttf`)
  }

  if (mode === 'oldie') {
    const fontmin = new Fontmin()
      .use(Fontmin.ttf2eot())
      .src(`${folderFonts}/${fontName}.ttf`)
      .dest(outputFolderFonts)

    fontmin.run()
  }
}

async function fromSVG(fontName) {
  fonts.svg.convert.ttf(`${folderFonts}/${fontName}.svg`, `${folderFonts}/${fontName}.ttf`)
  await fromTTF(fontName)
  await fs.rm(`${folderFonts}/${fontName}.svg`)
}

async function fromOTF(fontName) {
  fonts.otf.convert.svg(`${folderFonts}/${fontName}.otf`, `${folderFonts}/${fontName}.svg`)
  await fromSVG(fontName)
  await fs.rm(`${folderFonts}/${fontName}.otf`)
}
