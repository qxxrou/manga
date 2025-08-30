import { Inject, Injectable } from '@nestjs/common'
import type { Browser } from 'puppeteer'

@Injectable()
export class CategoryService {
  @Inject('puppeteer')
  puppeteer: Browser

  async tag() {
    const page = await this.puppeteer.newPage()
    await page.goto('https://manhuafree.com/manga')

    const tagBrand = await page.$$(
      '.overflow-x-auto.gap-unit-xs.flex.scrollbar-hide',
    )

    // 匹配第二个标签里的内容
    const content = await tagBrand[1]?.$$eval('a', (els) => {
      return els.map((el) => {
        const link = el.href
        const button = el.querySelector('button')
        const text = button?.textContent?.replace('\n', '').trimStart()

        return {
          link,
          text,
        }
      })
    })

    page.close()

    return {
      message: '',
      content: content,
    }
  }

  async tagInfo(link: string, page: number) {
    const pupPage = await this.puppeteer.newPage()
    // 处理一下如果是带上了page页码的情况下
    // https://manhuafree.com/manga-tag/gufeng/page/2
    // https://manhuafree.com/manga-tag/gufeng

    const linkUrl = page ? link + `/page/${page}` : link

    const currentPage = await pupPage.goto(linkUrl)

    if (currentPage?.status() === 200) {
      const content = await pupPage.$$eval('.pb-2', (els) => {
        return els.map((el) => {
          const link = el.querySelector('a')?.href
          const imgSrc = el.querySelector('img')?.src
          const text = el.querySelector('h3')?.textContent

          return {
            link,
            imgSrc,
            text,
          }
        })
      })

      return {
        message: '',
        data: content,
      }
    } else {
      return {
        message: '数据获取失败',
        data: [],
      }
    }
  }
}
