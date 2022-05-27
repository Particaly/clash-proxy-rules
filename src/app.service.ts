import { Injectable, Query } from '@nestjs/common';
import { cloneDeep } from 'lodash'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as fs from 'fs'
import axios from 'axios'

const defResource = path.resolve(__dirname, './assets/default.yml')

@Injectable()
export class AppService {
	async getProxy(@Query() query): Promise<string> {
		const { url } = query;
		if (!url) {
			// 没有订阅地址
			return ''
		}
		const data = await axios({
			url,
			method: 'get',
			params: {
				...query,
				url: undefined
			}
		}).then(d => {
			return d.data
		});

		const { proxies } = yaml.load(data)


		const def = yaml.load(fs.readFileSync(defResource, 'utf8'))

		const rules = def.rules;
		const proxiesName = proxies.map(item => item.name);

		const groups = cloneDeep(def['proxy-groups'])
		const allGroups = groups.map(item => item.name);
		allGroups.push('DIRECT')

		groups.forEach(item => {
			item.proxies = item.proxies.filter(which => allGroups.includes(which))
			item.proxies = [...item.proxies, ...proxiesName]
		})

		const obj = { proxies, 'proxy-groups': groups, rules }
		const result = yaml.dump(obj);
		// fs.writeFileSync(path.resolve(__dirname, './source.yml'), result, 'utf8')
		return result;
	}
	getHello(): string {
		return 'Hello World!';
	}
}
