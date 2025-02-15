import { Module } from '@nestjs/common';
import { StorageModule } from './boundedContexts/storage/storage.module';
import { DBModule } from './infrastructure/db/db.module';

@Module({
  imports: [StorageModule, DBModule],
})
export class AppModule {}
