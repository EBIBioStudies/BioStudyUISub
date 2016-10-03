import {UpgradeAdapter} from 'angular2/upgrade';
import {AppModule} from './app.module.ts';

export const upgradeAdapter = new UpgradeAdapter(AppModule);