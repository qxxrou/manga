import { Body, Controller, Post } from '@nestjs/common'
import { MangaService } from './manga.service'

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Post()
  async mangaInfo(@Body('link') link: string) {
    console.log(link)

    const chapts = await this.mangaService.mangaInfo(link)
    return chapts
  }

  @Post('content')
  async mangachapteInfo(@Body('link') link: string) {
    const content = await this.mangaService.mangachapteInfo(link)

    return content
  }
}
