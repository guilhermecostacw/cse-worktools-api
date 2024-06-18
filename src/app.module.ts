import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { LinkModule } from './link/link.module';
import { QueryParamsModule } from './query_params/query_params.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { OcrModule } from './ocr/ocr.module';

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    LinkModule,
    QueryParamsModule,
    UserModule,
    AuthModule,
    MailerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
