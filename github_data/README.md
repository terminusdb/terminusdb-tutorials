# Putting GitHub Data into TerminusDB/ TerminusX

In this tutorial, we will use a GitHub [Singer tap](https://www.singer.io/) to pull the stargazers from our repo and put it in TerminusDB/ TerminusX.

## Check your endpoint is running

You can download the TerminusDB docker image to work locally (recommended to use [Bootstrap here](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, get the information of the endpoint, team, and API token ready (it should be accessible in the [TerminusX dashboard](https://dashboard.terminusdb.com/) under profile.)


## Install and set up the GitHub tap

It is highly recommended to install different singer.io tap and targets in different python environments. To install the tap-github tap from the into a new `venv` environment, do the following:

```
$ python3 -m venv ~/.virtualenvs/tap-github
$ source ~/.virtualenvs/tap-github/bin/activate
$ python3 -m pip install tap-github
$ deactivate
```

Then we need to set up the config files, we also need a [Personal Access Tokens](https://github.com/settings/tokens) from GitHub. For details see [step 2 here](https://github.com/singer-io/tap-github#quick-start). Then, we have to set up a `target-config.json` like this:

```
{"access_token": "your-access-token",
 "repository": "terminusdb/terminusdb",
 "start_date": "2021-01-01T00:00:00Z"}
```

Then, the next step is to generate a `properties.json` which store all the available streams from this tap:

```
$ ~/.virtualenvs/tap-github/bin/tap-github --config tap-config.json --discover > properties.json
```

In the `properties.json`, select the streams that we want to import. In this case, we want the stargazers. Look for that stream and add `"selected": true,` to it like this:

```
...
"stream": "stargazers",
"tap_stream_id": "stargazers",
"schema": {
  "selected": true,
  "type": [
    "null",
    "object"
  ],
...
```

Now the tap is ready to use.

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

`$ cd ../github_data`

In the project directory start a TerminusDB project:

`$ terminusdb startproject`

You will be prompt with a few questions. Pick a project name and if you are running the localhost server with default port you can just press Enter. You have to provide the endpoint and other login information if you are using TerminusX or otherwise.

This is what I did:

```
Please enter a project name (this will also be the database name): github_star
Please enter a endpoint location (press enter to use localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```

## Import the COVID-19 Public Data into TerminusDB/ TerminusX

`$ ~/.virtualenvs/tap-github/bin/tap-github -c tap-config.json --properties properties.json | ~/.virtualenvs/target-terminusdb/bin/target-terminusdb -c config.json`

## Varify the data is in TerminusDB/ TerminusX

Check if the documents are looking good by using the following command to get 10 documents to inspect:

`$ terminusdb alldocs -h 10`

You can also see if the insert are successful by inspecting the log:

```
$ terminusdb log


commit 6xc1vc96gb6grox4q8rqwqv8nuy0bhy
Author: admin
Date: 2021-10-08 16:25:44

    Dcouments insert by Singer.io target. (inserts)

commit 2dcpmqwatj4zmaeuidoi3kpa3vh47t7
Author: admin
Date: 2021-10-08 16:25:35

    Dcouments insert by Singer.io target. (inserts)

commit 3vv6m18no9i84hx1j8hnvcd4kzog3jr
Author: admin
Date: 2021-10-08 16:25:20

    Schema objects insert by Singer.io target. (inserts)

```

Here we see that the data are inserted in 2 batches. This is because we have 1.5k stargazers for our repo at the time of writing this tutorial and the default buffer size is 1000. You can change it (for example to 5000) by adding `"buffer_size": 5000` in the `config.json`. Or use the command:

`$ terminusdb config buffer_size=5000`

Choosing the right buffer size is important when you have large amount of data to process. If the buffer is too small, the time to process will be too long and if the buffer is too big, many data will be lost together if one of the data is contaminated and not being able to process.
