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

const dateFormat = require('dateformat');
const express = require('express');
const path = require('path');
const program = require('commander');

function now() { return dateFormat(new Date(), '[yyyy-mm-dd hh:MM:ss.l]') }
function log() { console.log.apply(this, [now(), ...arguments]) }
function allowAnyOrigin(res, path, stat) { res.set('Access-Control-Allow-Origin', '*') }

program
  .option('-p, --port <port>', 'which port to use [default: 5000]')
  .option('-H, --host <host>', 'which address to listen on [default: 127.0.0.1]')
  .option('-d, --dir  <dir>',  "which directory's content to serve [default: cwd]")
  .parse(process.argv);

const cwd = process.cwd();
const port = Number(program.port) || 5000;
const host = program.host || '127.0.0.1';
const root = program.dir ? path.resolve(cwd, program.dir) : cwd;
const app = express();
app.use((req, res, next) => { log(host + req.url); next() });
app.use(express.static(root, { setHeaders: allowAnyOrigin }));
app.get('/', (req, res) => { res.sendFile(root + '/index.html') });
app.listen(port, host, () => {
  log(`Listening on http://${host}:${port}`);
  log(`Serving files from ${root}/`);
});
