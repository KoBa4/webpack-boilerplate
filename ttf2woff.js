const fs = require('fs').promises
const path = require('path')
const fonts = require('@hayes0724/web-font-converter/src/lib/fonts')
// const { convertAllFonts } = require('@hayes0724/web-font-converter')

const srcFonts = path.resolve(__dirname, 'src/styles/base/_fonts.scss')
const folderFonts = path.resolve(__dirname, 'src/assets/fonts')
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
    await fs.writeFile(srcFonts, '', 'utf-8')
    const files = await fs.readdir(folderFonts)
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
          `@include font-face("${font}", "../assets/fonts/${fontname}", ${weight}, ${style}, "modern");\r\n`,
          undefined
        )

        if (file.endsWith('.ttf')) {
          fonts.ttf.convert
            .woff2(`${folderFonts}/${fontname}.ttf`, `${folderFonts}/${fontname}.woff2`)
          fonts.ttf.convert
            .woff(`${folderFonts}/${fontname}.ttf`, `${folderFonts}/${fontname}.woff`)
          // eslint-disable-next-line no-await-in-loop
          await fs.rm(`${folderFonts}/${file}`)
        }
      }
      cFontName = fontname
    }
  } catch (e) {
    console.log(e)
  }
}())

// convertAllFonts({
//   pathIn: folderFonts,
//   pathOut: folderFonts,
//   outputFormats: ['.woff', '.woff2'],
//   inputFormats: ['.ttf'],
//   debug: false,
// })
