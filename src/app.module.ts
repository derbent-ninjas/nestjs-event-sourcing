import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot(), StorageModule],
})
export class AppModule {}
