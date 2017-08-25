module.exports = {
  pad,
  csv,
  date_ago,
  days_between,
  num_reducer,
  replace,
  validate,
  handle_error
}

/**
 * Pads a two digit number with a leading zero
 * @param {number} n Number to pad
 */
function pad(n) {
  return ('0' + n).slice(-2)
}

/**
 * Converts object values to an array
 * @param {Object} res Object
 */
function csv(res) {
  return Object.values(res).join(', ')
}

/**
 * Returns the date for given days back
 * @param {number} days
 */
function date_ago(days) {
  const now = new Date()
  const last = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
  return `${last.getFullYear()}-${pad(last.getMonth() + 1)}-${pad(last.getDate())}`;
}

/**
 * Returns the amount of days between two dates
 * @param {Date} a
 * @param {Date} b
 */
function days_between(a, b) {
  const diff = Math.abs(a.getTime() - b.getTime())
  return Math.ceil(diff / (1000 * 3600 * 24));
}

/**
 * Reduces an array to the sum of its items
 * @param {number} a Accumulator
 * @param {number} b Current value
 */
function num_reducer(a, b) {
  a += b
  return a
}

/**
 * Replaces instances of options in the template for the option value
 * @param {string} target
 * @param {Object} options
 */
function replace(target, options) {
  for (let key in options) {
    target = target.replace(`%${key}`, options[key]);
  }

  return target;
}

/**
 * Validates program options and exits the process in case of errors
 * @param {Object} opt Program options
 */
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

/**
 * Formats error messages
 * @param {Error} err
 */
function handle_error(err) {
  const envelope = {}
  envelope.name = err.name || 'Unknown Error',
  envelope.code = err.statusCode || err.code || 1000
  envelope.message = err.statusMessage || 'An error has occurred'

  console.error(envelope)
}
