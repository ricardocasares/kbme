exports.issues = require('./issues.json')
exports.got = async function() {
  return await new Promise((res, rej) => {
    res({
      body: exports.issues
    })
  })
}
