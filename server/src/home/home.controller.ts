import { Controller, Get, Inject } from '@nestjs/common'
import { HomeService } from './home.service'

@Controller('home')
export class HomeController {
  @Inject(HomeService)
  HomeService: HomeService

  constructor() {}

  @Get()
  async home() {
    const recentUpdate = await this.HomeService.recentUpdate()
    const homeHotUpdate = await this.HomeService.homeHotUpdate()

    const data = [recentUpdate, ...(homeHotUpdate as any)]
    return {
      message: '',
      content: data,
    }
  }
}
