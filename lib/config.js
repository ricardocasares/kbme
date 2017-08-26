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
    u: ['user', 'username'],
    p: ['pass', 'password'],
    j: ['url', 'jira'],
    e: 'endpoint',
    q: 'query',
    r: 'report',
    h: 'help'
  },
  boolean: [
    'csv',
    'help',
    'report'
  ],
  default: {
    csv: false,
    jira: process.env.KBME_JIRA,
    user: process.env.KBME_USER,
    pass: process.env.KBME_PASS,
    auto: process.env.KBME_AUTO,
    report: process.env.KBME_REPORT,
    period: process.env.KBME_RANGE || 15,
    interval: process.env.KBME_INTERVAL || 2,
    start: process.env.KBME_START || date_ago(15),
    finish: process.env.KBME_FINISH || date_ago(0),
    done: process.env.KBME_DONE || 'Done',
    todo: process.env.KBME_TODO || 'Pending',
    keys: process.env.KBME_KEYS || 'ELEMENTS',
    types: process.env.KBME_TYPES || 'NOT IN (Epic)',
    query: process.env.KBME_QUERY || 'project IN (%keys) AND status IN (%done) AND resolutiondate > %start AND resolutiondate < %finish AND issuetype %types',
    endpoint: process.env.KBME_ENDPOINT || '%jira/search?jql=%jql&expand=changelog'
  }
}
