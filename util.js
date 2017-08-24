module.exports = {
  pad,
  csv,
  date_ago,
  days_between,
  num_reducer,
  by_status,
  by_status_change,
  replace,
  validate,
}

function pad(n) {
  return ('0' + n).slice(-2)
}

function csv(result) {
  return Object.values(result).join(', ')
}

function date_ago(days) {
  const now = new Date()
  const last = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
  return `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;
}

function days_between(a, b) {
  const diff = Math.abs(a.getTime() - b.getTime())
  return Math.ceil(diff / (1000 * 3600 * 24));
}

function num_reducer(a, b) {
  a += b
  return a
}

function by_status(status) {
  return function({field, toString}) {
    return (field === 'status' && toString === status)
  }
}

function by_status_change(status) {
  return h => h.items.filter(by_status(status))
}

function replace(target, options) {
  for (let key in options) {
    target = target.replace(`%${key}`, options[key]);
  }

  return target;
}

function validate(flags) {
  let error = false

  if (flags.help) {
    console.log(require('./help'))
    process.exit(0);
  }

  if (!flags.jira) {
    error = true
    console.log('Please configure your JIRA URL environment variable')
  }

  if (!flags.user) {
    error = true
    console.log('Please configure your JIRA user environment variable')
  }

  if (!flags.pass) {
    error = true
    console.log('Please configure your JIRA password environment variable')
  }

  if (error) process.exit(1)
}
