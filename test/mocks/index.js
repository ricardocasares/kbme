exports.issues = require('./issues.json')
exports.got = async function() {
  return new Promise((resolve, reject) => {
    resolve({
      body: exports.issues
    })
  })
}
