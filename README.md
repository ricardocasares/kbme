# kbme
[![Build Status](https://travis-ci.org/ricardocasares/kbme.svg?branch=master)](https://travis-ci.org/ricardocasares/kbme)
[![codecov](https://codecov.io/gh/ricardocasares/kbme/branch/master/graph/badge.svg)](https://codecov.io/gh/ricardocasares/kbme)

Gather kanban metrics from your JIRA instance:

- Lead time
- Cycle time
- Throughput

## Installation

`npm install -g kbme`

## Usage

`kbme --csv >> metrics.csv`

### Options

    -c, --csv         Outputs comma separated values [false]
    -k, --keys        Comma separated list of projects keys
    -t, --types       Issue types filter [NOT IN (Epic)]
    -d, --done        Done status [Done]
    -t, --todo        ToDo status [ToDo]
    -s, --start       Period start [2017-08-01]
    -f, --finish      Period finish [2017-08-15]
    -a, --auto        Automatic period dates based on days ago []
    -q, --query       JIRA JQL Query [project IN (%keys) AND status IN (%done) AND resolutiondate > %start AND resolutiondate < %finish AND issuetype %types]
    -u, --user        JIRA username []
    -p, --pass        JIRA password
    -j, --jira        JIRA REST API URL [https://server-name.com]
    -e, --endpoint    JIRA JQL /search endpoint [%jira/jira/rest/api/2/search?jql=%jql&expand=changelog&maxResults=1000]

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
