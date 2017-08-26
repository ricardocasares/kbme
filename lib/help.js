const pkg = require('./package.json')
const opt = require('./options')

const help =`
${pkg.name} v${pkg.version}
-----------

Options:

    -c, --csv         Outputs comma separated values [${opt.csv}]
    -k, --keys        Comma separated list of projects keys
    -t, --types       Issue types filter [${opt.types}]
    -d, --done        Done status [${opt.done}]
    -t, --todo        ToDo status [${opt.todo}]
    -s, --start       Period start [${opt.start}]
    -f, --finish      Period finish [${opt.finish}]
    -a, --auto        Automatic period dates based on days ago [${opt.period}]
    -q, --query       JIRA JQL Query [${opt.query}]
    -u, --user        JIRA username [${opt.user}]
    -p, --pass        JIRA password
    -j, --jira        JIRA REST API URL [${opt.jira}]
    -e, --endpoint    JIRA JQL /search endpoint [${opt.endpoint}]

    All options can be overriden by setting appropiate environment variable, ie:

        - Override JIRA URL
        > KBME_JIRA="https://jira.com/jira/rest/api/2" KBME_KEYS="SFC, KRK" ${pkg.name} --csv

    Pay special attention to the query and endpoint options, they have special characters (%opt) that
    can be used as a template to replace by another option value.
`

module.exports = help