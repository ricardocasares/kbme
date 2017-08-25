#!/usr/bin/env node
const mri = require('mri')
const opt = require('./options')
const { request, metrics } = require('./lib')
const { validate, replace, csv, handle_error } = require('./util')

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
