import { Inject, Injectable } from '@nestjs/common'
import type { Browser } from 'puppeteer'

@Injectable()
export class MangaService {
  @Inject('puppeteer')
  puppeteer: Browser

  async mangaInfo(link: string) {
    const pupPage = await this.puppeteer.newPage()
    await pupPage.goto(link)

    const title = await pupPage.$eval(
      'h1',
      (el) => el.childNodes[0].textContent,
    )
    const cover = await pupPage.$eval(
      'img[data-astro-cid-uh2r2g5t]',
      (el) => el.src,
    )

    // 拿到漫本介绍
    const desc = await pupPage.$eval(
      'p.text-medium.line-clamp-4.my-unit-md',
      (el) => el.textContent?.replaceAll('\n', ''),
    )

    // 作者
    const author = await pupPage.$$eval(
      '.text-small.py-1.pb-2 a.p-1 span',
      (els) => els.map((el) => el.textContent?.trim()),
    )

    // 最后更新的章节
    const lastChapt = await pupPage.$eval('#lastchap', (el) => el.textContent)

    // 前往章节页面
    const morechap = await pupPage.$('#morechap [data-astro-cid-ljkzbozy]')

    // 解决页面跳转的不同步
    await Promise.all([
      morechap?.click(),
      pupPage.waitForNavigation({
        timeout: 10000,
        waitUntil: 'networkidle2',
      }),
    ])

    console.log('导航到新页面成功')

    // 等待新页面加载完成
    const pageTitle = await pupPage.$$('div.chapteritem')
    console.log('当前页面标题:', pageTitle)

    // 拿到所有章节的信息
    const allChapts = await pupPage.$$eval('div.chapteritem ', (els) => {
      return els.map((el) => {
        const chaptLink = el.querySelector('a')?.href
        const chaptText = el.querySelector('a div>span')?.textContent

        return {
          chaptLink,
          chaptText,
        }
      })
    })

    pupPage.close()
    return {
      message: '',
      content: {
        title,
        cover,
        desc,
        author,
        lastChapt,
        allChapts,
      },
    }
  }

  async mangachapteInfo(link: string) {
    const pupPage = await this.puppeteer.newPage()
    await pupPage.goto(link)

    const title = await pupPage.$eval('h1', (el) => el.textContent)

    // 获取图片
    const imgSrc = await pupPage.$$eval(
      '.w-full.text-center.touch-manipulation#chapcontent img',
      (imgs) => {
        return imgs
          .map((img) => {
            const src = img.src

            if (src.includes('https')) {
              return img.src
            }
          })
          .filter((src) => src)
      },
    )

    pupPage.close()

    return {
      message: '',
      data: {
        title: title,
        img: imgSrc,
      },
    }
  }
}
