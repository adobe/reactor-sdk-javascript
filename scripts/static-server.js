#!/usr/bin/env node

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
