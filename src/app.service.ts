import { Injectable, OnModuleInit } from '@nestjs/common';
import { SeedService } from './database/seeds/seed.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    await this.seedService.runAllSeeds();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
