import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/config.typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load Configuration for database - Makes conection to the database
    TypeOrmModule.forRoot(typeOrmConfig), 
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
