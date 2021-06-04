const parser = new DOMParser()

/**
 * Replace Img To Picture
 *
 * @param html
 */
export function replaceImgToPicture(html) {
  const dom = parser.parseFromString(html, 'text/html')
  const images = dom.querySelectorAll('img')

  function __setAttribute(source, img, attr, newAttr) {
    const value = img.getAttribute(attr)
    if (value) {
      source.setAttribute(newAttr || attr, value.replace(/\.(jpe?g|png|gif)/gi, '.webp'))
    }
  }

  for (let i = 0; i < images.length; i += 1) {
    let img = images[i]
    if (img.parentElement && img.parentElement.tagName === 'PICTURE') {
      // eslint-disable-next-line no-continue
      continue
    }
    const picture = document.createElement('picture')
    const source = document.createElement('source')
    source.setAttribute('type', 'image/webp')
    __setAttribute(source, img, 'sizes')
    __setAttribute(source, img, 'srcset')
    __setAttribute(source, img, 'media')

    if (!source.hasAttribute('srcset')) {
      __setAttribute(source, img, 'src', 'srcset')
    }

    img.parentElement.insertBefore(picture, img)
    picture.appendChild(source)
    picture.appendChild(img)
  }

  return dom.documentElement.outerHTML
}
