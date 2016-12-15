import {Injectable} from '@angular/core';
import cfg from './config.json';


const CONFIG = JSON.parse(cfg);
console.debug("AppConfig:", CONFIG);

@Injectable()
export class AppConfig {
    public static VERSION: string = CONFIG.APP_VERSION;
    public static PROXY_BASE: string = CONFIG.APP_PROXY_BASE;
    public static DEBUG: boolean = CONFIG.APP_DEBUG_ENABLED;
}