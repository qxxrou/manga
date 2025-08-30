import { Controller, Get, Query } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('tag')
  async tag() {
    const allTag = await this.categoryService.tag()

    return allTag
  }

  @Get('tagInfo')
  async tagInfo(@Query('link') link: string, @Query('page') page: number) {
    console.log(link)

    const linkInfo = await this.categoryService.tagInfo(link, page)

    return linkInfo
  }
}
