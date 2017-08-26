#!/usr/bin/env node
const mri = require('mri')
const { query, report } = require('./lib')
const { replace, csv, date_ago, format } = require('./lib/util')

const flags = mri(process.argv.slice(2), require('./lib/config'));

validate(flags)

if (flags.help) {
  console.log(require('./lib/help'))
  process.exit(0);
}

if (flags.report) {
  report(flags)
    .then(format(flags))
    .then(console.log)
    .catch(handle_error)
}

if (!flags.report) {
  query(flags)
    .then(format(flags))
    .then(console.log)
    .catch(handle_error)
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
