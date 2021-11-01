# Putting GitLab Data into TerminusDB/TerminusX

In this tutorial, we will use [GitLab Rest API](https://docs.gitlab.com/ee/api/) to pull commits from our repo and put it in TerminusDB/TerminusX.

## Check your endpoint is running

You can download the TerminusDB docker image to work locally (recommended to use [Bootstrap here](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, get the information of the endpoint, team, and API token ready (it should be accessible in the [TerminusX dashboard](https://dashboard.terminusdb.com/) under profile.

## Clone this repository

Clone this repository

```
$ git clone git@github.com:terminusdb/terminusdb-tutorials.git
```

Go into the `gitlab_data` directory

```
$ cd gitlab_data/
```

## Install TerminusDB target

It is highly recommended to install different singer.io tap and targets in different python environments. Install `target-terminusdb` from PyPI in a venv environment:

```
$ python3 -m venv ~/.virtualenvs/target-terminusdb
$ source ~/.virtualenvs/target-terminusdb/bin/activate
$ python3 -m pip install target-terminusdb tqdm requests
```

`tqdm` and `requests` are also required.

## Start the project

In the project directory start a TerminusDB project:

```
$ terminusdb startproject
```

You will be prompt with a few questions. Pick a project name and if you are running the localhost server with default port you can just press Enter. You have to provide the endpoint and other login information if you are using TerminusX or otherwise.

This is what I did:

```bash
Please enter a project name (this will also be the database name): nobel_prize
Please enter a endpoint location (press enter to use localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```

## Get Commits
```python
import singer
from tqdm import tqdm
import requests

schema = {
    'properties': {
        'id': {'type': 'string'},
        'short_id': {'type': 'string'},
        'created_at': {'type': 'string'},
        'title': {'type': 'string'},
        'message': {'type': 'string'},
        'author_name': {'type': 'string'},
        'author_email': {'type': 'string'},
        'authored_date': {'type': 'string'},
        'committer_name': {'type': 'string'},
        'committer_email': {'type': 'string'},
        'committed_date': {'type': 'string'},
        'web_url': {'type': 'string'},
    }
}

singer.write_schema('gitlab_data', schema, 'id')
response = requests.get('https://gitlab.com/api/v4/projects/ID/repository/commits')
df = response.json()
for item in tqdm(df, desc='Transfering data'):
    singer.write_records('gitlab_data', [{'id': item['id'], 'short_id': item['short_id'], 'created_at': item['created_at'], 'title': item['title'], 'message': item['message'], 'author_name': item['author_name'], 'author_email': item['author_email'], 'authored_date': item['authored_date'], 'committer_name': item['committer_name'], 'committer_email': item['committer_email'], 'committed_date': item['committed_date'], 'web_url': item['web_url']}])
```

We'll use `requests` to get commits from our repo sending a `GET` request to GitLab Rest API, `tqdm` to put a progress bar. Don't forget to replace `ID` in the URL with the ID of your project. GitLab Rest API will return 20 items by default, we can get more items by modifying our request as follows:

```python
response = requests.get('https://gitlab.com/api/v4/projects/ID/repository/commits?per_page=100')
```

For getting items since a specific date, we can set the `since` variable in our request:

```python
response = requests.get('https://gitlab.com/api/v4/projects/ID/repository/commits?since2018-03-01T00:00:00Z&per_page=100')
```

Check the [documentation](https://docs.gitlab.com/ee/api/commits.html) if you want to get any other data from your repo.

Then, we create the schema of the data we'll be writing to the stream formatted as a JSON Schema.

Note: For public repositories is not required to get an access token to use the API.

## Import the GitLab data into TerminusDB/ TerminusX

```
$ python gitlab_data.py | target-terminusdb -c config.json
```

## Verify the data is in TerminusDB/TerminusX

Check if the documents are looking good by using the following command to get 10 documents to inspect:

```
$ terminusdb alldocs -h 10