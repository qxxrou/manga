import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 开启cors
  app.enableCors()

  // 设置公共前缀
  app.setGlobalPrefix('/v1/api')

  await app.listen(process.env.PORT ?? 31025, '0.0.0.0', () => {
    console.log('服务启动成功')
  })
}
bootstrap()
