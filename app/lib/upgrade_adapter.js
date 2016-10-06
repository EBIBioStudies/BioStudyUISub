import {UpgradeAdapter} from '@angular/upgrade';
import {AppModule} from './app.module.ts!ts';

export const upgradeAdapter = new UpgradeAdapter(AppModule);