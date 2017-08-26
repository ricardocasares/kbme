module.exports = {
  pad,
  csv,
  toJSON,
  date_ago,
  days_between,
  num_reducer,
  replace,
  format,
  generate_dates
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
function csv(data) {
  if (!Array.isArray(data)) {
    return Object.values(data).join(', ')
  }

  return data.map(csv).join('\n')
}

/**
 * Returns a prettified JSON string
 * @param {Array} data
 */
function toJSON(data) {
  return JSON.stringify(data, null, 2)
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
 * Generates an array of dates
 * @param {Number} interval
 * @param {Number} period
 */
function generate_dates(interval = 15, period = 365) {
  let top = 0
  let bottom = 0
  const dates = []
  const limit = Math.ceil(period / interval)

  for (let i = 0; i < limit; i++) {
    top += interval
    bottom = top - interval

    dates.push({
      start: date_ago(top),
      finish: date_ago(bottom)
    })
  }

  return dates
}

function format(opt) {
  if (opt.csv) return data => csv(data)

  return data => toJSON(data)
}
