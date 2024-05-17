// main.ts
import { registerables } from 'chart.js';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

// Other imports and bootstrap logic...
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
