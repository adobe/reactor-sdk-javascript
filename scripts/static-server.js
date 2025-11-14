#!/usr/bin/env node
/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import dateFormat from 'dateformat';
import express from 'express';
import path from 'path';
import { Command } from 'commander';
const program = new Command();

function now() {
  return dateFormat(new Date(), '[yyyy-mm-dd hh:MM:ss.l]');
}
function log() {
  console.log.apply(this, [now(), ...arguments]);
}
function allowAnyOrigin(res) {
  res.set('Access-Control-Allow-Origin', '*');
}

program
  .option('-p, --port <port>', 'which port to use [default: 5000]')
  .option(
    '-H, --host <host>',
    'which address to listen on [default: 127.0.0.1]'
  )
  .option(
    '-d, --dir  <dir>',
    "which directory's content to serve [default: cwd]"
  )
  .parse(process.argv);

const cwd = process.cwd();
const port = Number(program.opts().port) || 5000;
const host = program.opts().host || '127.0.0.1';
const root = program.opts().dir ? path.resolve(cwd, program.opts().dir) : cwd;
const app = express();
app.use((req, res, next) => {
  log(host + req.url);
  next();
});
app.use(express.static(root, { setHeaders: allowAnyOrigin }));

// Add routes for integration tests
app.get('/integration-bundled-sdk/', (req, res) => {
  res.redirect('/integration-bundled-sdk/integration-tests-bundled-sdk.html');
});

app.get('/integration-library-sdk/', (req, res) => {
  res.redirect('/integration-library-sdk/integration-tests-library-sdk.html');
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Static Server</title></head>
      <body>
        <h1>Static Server</h1>
        <p>Serving files from: ${root}</p>
        <p>Server running on: http://${host}:${port}</p>
      </body>
    </html>
  `);
});

const server = app.listen(port, host, () => {
  log(`Static server listening on http://${host}:${port}`);
  log(`Serving files from: ${root}`);
});

function gracefulShutdown(signal) {
  console.log(`\n🛑 Express received ${signal}, shutting down gracefully...`);

  const timeout = setTimeout(function forceKillServer() {
    console.error('✋ Express force-shutdown of the server after 5 seconds.');
    process.exit(1);
  }, 5000);

  server.close(() => {
    clearTimeout(timeout);
    console.log('✅ Express server closed itself.');
    process.exit(0);
  });
  server.closeAllConnections();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
