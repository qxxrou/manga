import { Injectable, Inject } from '@nestjs/common'
import { title } from 'process'
import type { Browser } from 'puppeteer'

@Injectable()
export class HomeService {
  @Inject('puppeteer')
  puppeteer: Browser

  // 近期更新
  async recentUpdate() {
    const page = await this.puppeteer.newPage()
    await page.goto('https://manhuafree.com/')

    // 拿标题
    const title = await page.$eval(
      '.pb-unit-md.pt-unit-xs > h2',
      (el) => el.textContent,
    )
    // 拿内容区域的div
    const homeDiv = await page.$('.mx-2.font-medium.flex.items-center')
    await homeDiv!.click()

    const updateDiv = await page.$('.w-full.overflow-x-auto.scrollbar-hide')

    // 区域里面的每一个子项目
    const updateItem = await updateDiv?.$$eval('.slicarda', (els) => {
      return els.map((el) => {
        const imgSrc = el.querySelector('img')?.src
        const updateTag = el.querySelector('.slicardtagp')
          ?.textContent as string
        const updateNum = el.querySelector('.slicardtitlep')
          ?.textContent as string
        const h3 = el.querySelector('h3')
        // @ts-expect-error
        const link = h3?.parentElement.href

        const updateTitle = h3?.textContent as string

        return {
          bookCover: imgSrc,
          updateTag,
          bookTitle: updateTitle,
          link,
          updateNum,
        }
      })
    })

    page.close()

    return {
      title: title,
      referer: {
        isRferer: true,
        rferer: 'baozimh.org',
      },
      books: updateItem,
    }
  }

  // 首页热门更新
  async homeHotUpdate() {
    const page = await this.puppeteer.newPage()
    await page.goto('https://manhuafree.com/')
    const container = await page.$('.container[data-astro-cid-j7pv25f6]')

    const data = await container?.evaluate((els) => {
      const dataArr: any[] = []
      const lastChild = els.lastElementChild
      const childEl = lastChild?.children
      if (childEl) {
        for (const el of childEl) {
          const obj: Record<string, any> = {}
          dataArr.push(obj)

          const title = el.querySelector('h2')?.textContent

          obj.title = title
          const pb2Arr = el.querySelectorAll(
            'div.pb-2[data-astro-cid-vbjvaon2]',
          )
          const mangaArr: any[] = []
          obj.books = mangaArr
          for (const pb2 of pb2Arr) {
            const mangaObj: Record<string, any> = {}

            const link = pb2.querySelector('a')?.href
            const title = pb2.querySelector('h3')?.textContent
            const imgSrc = pb2.querySelector('img')?.src

            mangaObj.link = link
            mangaObj.bookTitle = title
            mangaObj.bookCover = imgSrc

            mangaArr.push(mangaObj)
          }
        }
      }

      return dataArr
    })

    page.close()
    return data
  }
}
