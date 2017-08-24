const { pad, date_ago, days_between, by_status, num_reducer, replace } = require('./util')

module.exports = {
    request,
    metrics
}

function request({jira, user, pass, endpoint}) {
    const got = require('got')

    return async (jql) =>
        await got(replace(endpoint, {jira, jql}), {
            json: true,
            auth: `${user}:${pass}`
        }).then(res => res.body.issues)
}

function lead({fields, changelog, done}) {
    let start = new Date(fields.created)
    let finish = new Date(date_to_status(done, changelog.histories))

    return days_between(finish, start)
}

function cycle({fields, changelog, progress, done}) {
    let start = new Date(date_to_status(progress, changelog.histories))
    let finish = new Date(date_to_status(done, changelog.histories))

    return days_between(finish, start)
}

function date_to_status(status, histories) {
    let filt = h => h.items.filter(by_status(status))
    let date = histories
        .filter(filt)
        .map(f => f.created)
        .pop()

    return date || new Date();
}

function metrics(opts, issues) {
    const leadTimeAggregate = issues
        .map(issue => lead({
            fields: issue.fields,
            changelog: issue.changelog,
            done: opts.done
        }))
        .reduce(num_reducer, 0)
    
    const cycleTimeAggregate = issues
        .map(issue => cycle({
            fields: issue.fields,
            changelog: issue.changelog,
            done: opts.done,
            progress: opts.progress
        }))
        .reduce(num_reducer, 0)
    
    if (opts.auto) {
        opts.auto = parseInt(opts.auto, 10)
        opts.start = date_ago(opts.auto)
        opts.finish = date_ago(0)
    }

    const period = opts.auto || days_between(new Date(opts.start), new Date(opts.finish))
    const throughput = (issues.length / period)

    return {
        issues: issues.length,
        throughput,
        leadTimeAggregate,
        cycleTimeAggregate,
        start: opts.start,
        finish: opts.finish
    }
}
