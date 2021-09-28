# The COVID-19 Public Data with Singer.io

In this tutorial, we will pull the COVID-19 Public Data from a [Singer tap](https://www.singer.io/) and put it in TerminusDB/ TerminusX.

## Check your endpoint is running

You can download the TerminusDB docker image to work locally (recommended to use Bootstrap here) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, git the information of the endpoint, team, and API token ready (it should be accessible in the TerminusX dashboard under profile.)

## Clone the COVID-19 Public Data repo

Clone the COVID-19 Public Data from [this GitHub repo](https://github.com/singer-io/tap-covid-19)

`$ git clone git@github.com:singer-io/tap-covid-19.git`

go into the `tap-covid-19` directory

`$ cd tap-covid-19/`

## Install the COVID-19 Public Data tap

It is highly recommended to install different singer.io tap and targets in different python environments. To install the COVID-19 Public Data tap from the `setup.py` in the repo into a new `venv` environment.

```
$ python3 -m venv ~/.virtualenvs/tap-covid-19
$ source ~/.virtualenvs/tap-covid-19/bin/activate
$ python3 -m pip install .
$ deactivate
```

## Install TerminusDB target

With similar principal as installing the tap, we install `target-terminusdb` from PyPI in another `venv` environment:

```
$ python3 -m venv ~/.virtualenvs/target-terminusdb
$ source ~/.virtualenvs/target-terminusdb/bin/activate
$ python3 -m pip install target-terminusdb
```

we don't deactivate the environment this time as we can use the `terminusdb` command if we are in this environment

## start the project

Now go to the project directory (or start a new one):

`$ cd ../covid_data`

In the project directory start a TerminusDB project:

`$ terminusdb startproject`

You will be prompt with a few questions. Pick a project name and if you are running the localhost server with default port you can just press Enter. You have to provide the endpoint and other login information if you are using TerminusX or otherwise.

This is what I did:

```
Please enter a project name (this will also be the database name): covid_data
Please enter a endpoint location (press enter to use localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```


## Create a tap config file

Create the tap's config file `tap_config.json` with the example. This tap connects to GitHub with a [GitHub OAuth2 Token](https://developer.github.com/v3/#authentication). This may be a [Personal Access Token](https://github.com/settings/tokens).

```
{
    "api_token": "YOUR_GITHUB_API_TOKEN",
    "start_date": "2021-01-01T00:00:00Z",
    "user_agent": "tap-covid-19 <api_user_email@your_company.com>"
}
```

Put in your `api_token`, `user_agent` and `start_date`.

More about how to use the [tap-covid-19 can be found here](https://github.com/singer-io/tap-covid-19/#quick-start).

## Create a catalog file for the COVID-19 Public Data

`$ ~/.virtualenvs/tap-covid-19/bin/tap-covid-19 -c tap_config.json --discover > catalog.json`

To selected the stream that we want to import, we have to mark it in the `catalog.json`. We select `eu_daily` stream. In it's `metadata`, added `"selected" : true`.

```
...
"stream": "eu_daily",
"metadata": [
  {
    "breadcrumb": [],
    "metadata": {
      "selected" : true,
      "table-key-properties": [
        "git_path",
        "__sdc_row_number"
      ],
      "forced-replication-method": "INCREMENTAL",
      "valid-replication-keys": [
        "git_last_modified"
      ],
      "inclusion": "available"
    }
  },
...
]
},
...
```

## Import the COVID-19 Public Data into TerminusDB/ TerminusX

`$ ~/.virtualenvs/tap-covid-19/bin/tap-covid-19 -c tap_config.json --catalog catalog.json | ~/.virtualenvs/target-terminusdb/bin/target-terminusdb -c config.json >> state.json`

## Varify the data is in TerminusDB/ TerminusX

Check if the documents are looking good by using the following command to get 10 documents to inspect:

`$ terminusdb alldocs -h 10`

## Query the data and export it to a CSV

Now the data is in TerminusDB/ TerminusX, you can query the data and export it as CSV for investigation later by using the `terminusdb` command. For example, I want to get all the data on a particular date:

`$ terminusdb alldocs -t eu_daily -q datetime=2020-04-07T00:00:00Z -e --filename eu_2020-04-07.csv`
