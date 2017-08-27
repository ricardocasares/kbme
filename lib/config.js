const { join } = require('path')
const { date_ago } = require('./util')

require('dotenv').config({
  path: join(process.cwd(), '.env')
})

module.exports = {
  alias: {
    c: 'csv',
    k: 'keys',
    t: 'types',
    a: 'auto',
    d: 'done',
    t: 'todo',
    s: 'start',
    f: 'finish',
    u: ['user', 'username'],
    p: ['pass', 'password'],
    j: ['url', 'jira'],
    e: 'endpoint',
    q: 'query',
    r: 'report',
    i: 'interval',
    x: 'period',
    h: 'help'
  },
  boolean: [
    'csv',
    'help',
    'report'
  ],
  string: [
    'keys',
    'done',
    'todo',
    'start',
    'finish',
    'user',
    'pass',
    'jira',
    'query',
    'types',
    'endpoint'
  ],
  default: {
    csv: to_bool(process.env.KBME_CSV) || false,
    jira: process.env.KBME_JIRA,
    user: process.env.KBME_USER,
    pass: process.env.KBME_PASS,
    report: to_bool(process.env.KBME_REPORT) || false,
    period: parseInt(process.env.KBME_PERIOD, 10) || 90,
    interval: parseInt(process.env.KBME_INTERVAL, 10) || 15,
    start: process.env.KBME_START || date_ago(15),
    finish: process.env.KBME_FINISH || date_ago(0),
    done: process.env.KBME_DONE || 'Done',
    todo: process.env.KBME_TODO || 'Pending',
    keys: process.env.KBME_KEYS || 'ELEMENTS',
    types: process.env.KBME_TYPES || 'NOT IN (Epic)',
    query: process.env.KBME_QUERY || 'project IN (%keys) AND status IN (%done) AND resolutiondate > %start AND resolutiondate < %finish AND issuetype %types',
    endpoint: process.env.KBME_ENDPOINT || '%jira/search?jql=%jql&expand=changelog'
  },
  unknown: function(flag) {
    console.log(`Unknown option ${flag}`)
    process.exit(1)
  }
}

function to_bool(val) {
  return val === 'false' ? false : Boolean(val)
}
