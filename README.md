# kbme
Gather kanban metrics from your JIRA instance:

- Lead time
- Cycle time
- Throughput

## Installation

`npm install -g kbme`

## Usage

`kbme --csv >> metrics.csv`

### Options

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

### Automatic environment variables detection

You can create a `.env` file from which `kbme` will read environment variables, use this to setup a project you want constant metrics from.

#### Sample .env file
````
KBME_JIRA="http://server-url.com"
KBME_USER="Ringo"
KBME_PASS="St4r"
KBME_AUTO=15
KBME_START="2017-01-01"
KBME_FINISH="2017-06-01"
KBME_DONE="Done"
KBME_TODO="In Progress"
KBME_KEYS="ELEMENTS"
KBME_TYPES="NOT IN (Epic)"
KBME_QUERY="project IN (%keys) AND status IN (%done) AND resolutiondate > %start AND resolutiondate < %finish AND issuetype %types"
KBME_ENDPOINT="%jira/jira/rest/api/2/search?jql=%jql&expand=changelog"
````

Pay special attention to the query and endpoint options, they have special characters (%opt) that
can be used as a template to replace by another option value.

## Contribute
Feel free to fill an issue and submit a pull request if you find any problems.
