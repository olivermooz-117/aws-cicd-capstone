const express = require('express');
const os = require('os');
const pkg = require('./package.json');

const app = express();

app.get('/', (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>AWS CI/CD Capstone</title></head>
  <body style="font-family: sans-serif; text-align: center; margin-top: 15vh;">
    <h1>Hello from AWS CI/CD Capstone Project!</h1>
    <p>Version ${pkg.version} &middot; served by container ${os.hostname()}</p>
  </body>
</html>`);
});

// Used by the load balancer and ECS health checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: pkg.version });
});

module.exports = app;
