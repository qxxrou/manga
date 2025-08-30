import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { HomeModule } from './home/home.module'
import { PuppeteerModule } from './puppeteer/puppeteer.module'
import { CategoryModule } from './category/category.module'
import { MangaModule } from './manga/manga.module'

@Module({
  imports: [PuppeteerModule, HomeModule, CategoryModule, MangaModule],
  controllers: [AppController],
})
export class AppModule {}
