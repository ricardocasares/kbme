const { pad, date_ago, days_between, num_reducer, replace } = require('./util')

module.exports = {
  request,
  metrics
}

/**
 * Returns an API request function used to execute JQL
 * @param {Object} config  API configuration options
 */
function request({jira, user, pass, endpoint}) {
  const got = require('got')

  return async (jql) =>
    await got(replace(endpoint, {jira, jql}), {
      json: true,
      auth: `${user}:${pass}`
    }).then(res => res.body.issues)
}

/**
 * Lead time
 *
 * t1 = issue.fields.created
 * t2 = issue.changelog.histories[].created // histories[].items[].toString = 'Done'
 *
 * cT = t2 - t1
 *
 * @param {Object} issue  Issue
 * @param {string} done   Done status
 */
function lead({fields, changelog}, status) {
  const start = new Date(fields.created)
  const finish = new Date(date_to_status(status, changelog))

  return days_between(finish, start)
}
/**
 * Cycle time
 *
 * t1 = issue.changelog.histories[].created // histories[].items[].toString = 'ToDo'
 * t2 = issue.changelog.histories[].created // histories[].items[].toString = 'Done'
 *
 * cT = t2 - t1
 *
 * @param {Object} issue  Issue
 * @param {string} todo   Pending status
 * @param {string} done   Done status
 */
function cycle({fields, changelog}, todo, done) {
  const start = new Date(date_to_status(todo, changelog))
  const finish = new Date(date_to_status(done, changelog))

  return days_between(finish, start)
}

/**
 * Returns the date for a given status transition
 *
 * Issue structure reference
 * =========================
 * {
 *   key: 'SFC-123',
 *   fields: {
 *     // ...
 *     created: '2017-04-07T11:05:12.010+0000'
 *   },
 *   changelog: {
 *     // ...
 *     histories: [
 *       {
 *         // ...
 *         created: '2017-08-07T11:56:53.090+0000',
 *         items: [
 *           {
 *             // ...
 *             field: 'status',
 *             toString: 'ToDo'
 *           }
 *         ]
 *       }
 *     ]
 *   }
 *   // ...
 * }
 *
 * @param {string} status     Issue status
 * @param {Object} histories  Issue changelog histories
 */
function date_to_status(status, {histories}) {
  const date = histories
    .filter(
      ({ items }) => items.filter(
        ({ field, toString }) =>
          (field === 'status' && toString === status)
      ).length > 0
    )
    .map(f => f.created)
    .pop()

  return date;
}

/**
 * Returns the metrics object
 * @param {Object} opts    Options
 * @param {Array}  issues  Issues array
 */
function metrics(opts, issues) {
  const leadTimeAvg = issues
    .map(issue => lead(issue, opts.done))
    .reduce(num_reducer, 0) / issues.length

  // @TODO: this is not working well
  const cycleTimeAvg = issues
    .map(issue => cycle(issue, opts.todo, opts.done))
    .reduce(num_reducer, 0) / issues.length

  const period = opts.auto || days_between(new Date(opts.start), new Date(opts.finish))
  const throughput = (issues.length / period)

  return {
    issues: issues.length,
    throughput,
    leadTimeAvg,
    cycleTimeAvg,
    start: opts.start,
    finish: opts.finish
  }
}
