#!/usr/bin/env node
const mri = require('mri')
const opt = require('./lib/options')
const { request, metrics } = require('./lib')
const { replace, csv, date_ago, generate_dates } = require('./lib/util')
const assign = Object.assign

const flags = mri(process.argv.slice(2), {
  alias: {
    r: 'range',
    i: 'interval'
  },
  default: opt
});

const dates = generate_dates(flags.interval, flags.range)

dates.map(date => assign({}, opt, flags, date))
  .map(opts => run(opts).then(console.log).catch(console.log))

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
