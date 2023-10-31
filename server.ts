import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { environment } from 'src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  let production = environment.production

  const server = express();
  let distFolder  = join(process.cwd(), 'dist/dineouthalal/browser');

  if (production) {
    distFolder = join(process.cwd(), 'build/browser');
  } 
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    inlineCriticalCss: false,
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req, providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: 'REQUEST', useValue: req },
        { provide: 'RESPONSE', useValue: res },]
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 3001;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log('Application is listening on port', port)
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
