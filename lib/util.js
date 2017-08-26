module.exports = {
  pad,
  csv,
  date_ago,
  days_between,
  num_reducer,
  replace
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
