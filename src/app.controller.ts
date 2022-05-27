import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	async getProxy(@Query() query): Promise<string> {
		return await this.appService.getProxy(query);
	}
}
