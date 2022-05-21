import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './zone-async-stack-tagging';

if (environment.production) {
  enableProdMode();
}

const AsyncStackTaggingZoneSpec = (Zone as any)['AsyncStackTaggingZoneSpec'];
Zone.current
  .fork(new AsyncStackTaggingZoneSpec('testAsyncStackTagging'))
  .run(() => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });
