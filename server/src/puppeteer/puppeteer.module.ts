import { Global, Module } from '@nestjs/common'
import { PuppeteerController } from './puppeteer.controller'
import puppeteer from 'puppeteer'

@Global()
@Module({
  controllers: [PuppeteerController],
  providers: [
    {
      provide: 'puppeteer',
      async useFactory(options: any) {
        const browser = await puppeteer.launch({
          headless: false,
          timeout: 10000,
          defaultViewport: {
            width: 1080,
            height: 1024,
          },
        })

        return browser
      },
    },
  ],
  exports: ['puppeteer'],
})
export class PuppeteerModule {}
