#!/usr/bin/env node
const mri = require('mri')
const opt = require('./options')
const { validate, replace, csv } = require('./util')
const { request, metrics} = require('./lib')

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

main().then(console.log).catch(console.log);

async function main() {
  const api = request(flags);
  const query = replace(flags.query, flags)
  const issues = await api(query)
  const res = metrics(flags, issues)

  if (flags.csv) {
    return csv(res)
  }

  return res;
}
