#!/usr/bin/env node
const mri = require('mri')
const opt = require('./options')
const { request, metrics } = require('./lib')
const { replace, csv } = require('./util')

const flags = mri(process.argv.slice(2), {
  alias: {
    c: 'csv',
    k: 'keys',
    t: 'types',
    a: 'auto',
    d: 'done',
    t: 'todo',
    u: 'user',
    p: 'pass',
    j: 'jira',
    e: 'endpoint',
    q: 'query',
    h: 'help'
  },
  default: opt
});

validate(flags)

if (flags.help) {
  console.log(require('./help'))
  process.exit(0);
}

run(flags)
  .then(console.log)
  .catch(handle_error);

async function run(opt) {
  const api = request(opt);
  const query = replace(opt.query, opt)
  const issues = await api(query)
  const res = metrics(opt, issues)

  if (opt.csv) {
    return csv(res)
  }

  return res;
}

function validate(opt) {
  let error = false

  if (!opt.jira) {
    error = true
    console.error('Please configure your JIRA URL environment variable')
  }

  if (!opt.user) {
    error = true
    console.error('Please configure your JIRA user environment variable')
  }

  if (!opt.pass) {
    error = true
    console.error('Please configure your JIRA password environment variable')
  }

  if (opt.auto) {
    opt.auto = parseInt(opt.auto, 10)
    opt.start = date_ago(opt.auto)
    opt.finish = date_ago(0)
  }

  if (error) process.exit(1)
}

function handle_error(err) {
  const envelope = {}
  envelope.name = err.name || 'Unknown Error',
  envelope.code = err.statusCode || err.code || 1000
  envelope.message = err.statusMessage || 'An error has occurred'

  console.error(envelope)
  process.exit(1)
}
