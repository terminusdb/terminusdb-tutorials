# Nobel Prize Winners (1900 - 2020)

In this tutorial, we will pull the Nobel Prize winners data from a [CSV file](https://www.kaggle.com/rishidamarla/nobel-prize-winners-19002020) and put it in TerminusDB/TerminusX.

## Check your endpoint is running

You can download the TerminusDB docker image to work locally (recommended to use [Bootstrap here](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, get the information of the endpoint, team, and API token ready (it should be accessible in the [TerminusX dashboard](https://dashboard.terminusdb.com/) under profile.

## Clone this repository

Clone this repository

```
$ git clone git@github.com:terminusdb/terminusdb-tutorials.git
```

Go into the `nobel_prize` directory

```
$ cd nobel_prize/
```

## Install TerminusDB target

It is highly recommended to install different singer.io tap and targets in different python environments. Install `target-terminusdb` from PyPI in a venv environment:

```
$ python3 -m venv ~/.virtualenvs/target-terminusdb
$ source ~/.virtualenvs/target-terminusdb/bin/activate
$ python3 -m pip install target-terminusdb pandas tqdm tempfile
```

`pandas`, `tqdm` and `tempfile` are also required.

## Start the project

In the project directory start a TerminusDB project:

```
$ tdbpy startproject
```

You will be prompt with a few questions. Pick a project name and if you are running the localhost server with default port you can just press Enter. You have to provide the endpoint and other login information if you are using TerminusX or otherwise.

This is what I did:

```bash
Please enter a project name (this will also be the database name): nobel_prize
Please enter a endpoint location (press enter to use localhost default) [http://127.0.0.1:6363/]:
config.json and schema.py created, please customize them to start your project.
```

## Reading CSV

```python
import singer
import pandas as pd
from tqdm import tqdm
import tempfile

schema = {
    'properties': {
        'firstname': {'type': 'string'},
        'surname': {'type': 'string'},
        'born': {'type': 'string'},
        'died': {'type': 'string'},
        'bornCountry': {'type': 'string'},
        'bornCountryCode': {'type': 'string'},
        'bornCity': {'type': 'string'},
        'diedCountry': {'type': 'string'},
        'diedCountryCode': {'type': 'string'},
        'diedCity': {'type': 'string'},
        'gender': {'type': 'string'},
        'year': {'type': 'string'},
        'category': {'type': 'string'},
        'overallMotivation': {'type': 'string'},
        'share': {'type': 'string'},
        'motivation': {'type': 'string'},
        'name': {'type': 'string'},
        'city': {'type': 'string'},
        'country': {'type': 'string'},
    }
}

def read_data(url):
    df = pd.read_csv(url, encoding='latin1', chunksize=500)
    singer.write_schema('nobel_prize', schema, 'firstname')
    for chunk in tqdm(df, desc='Transfering data'):
        csv = tempfile.NamedTemporaryFile()
        chunk.to_csv(csv)
        write_data(csv.name)

def write_data(csv):
    df = pd.read_csv(csv)
    selection = df.fillna('')
    for index, row in selection.iterrows():
        singer.write_records('nobel_prize', [{'firstname': row['firstname'], 'surname': row['surname'], 'born': row['born'], 'died': row['died'], 'bornCountry': row['bornCountry'], 'bornCountryCode': row['bornCountryCode'], 'bornCity': row['bornCity'], 'diedCountry': row['diedCountry'], 'diedCountryCode': row['diedCountryCode'], 'diedCity': row['diedCity'], 'gender': row['gender'], 'year': str(row['year']), 'category': row['category'], 'overallMotivation': row['overallMotivation'], 'share': str(row['share']), 'motivation': row['motivation'], 'name': row['name'], 'city': row['city'], 'country': row['country']}])

url='nobel_prize.csv'
read_data(url)
```

We'll use `pandas` to read the CSV file, `tqdm` to put a progress bar and `tempfile` to create temporary CSV files, required as we're reading data chunks. This is a small dataset and reading data in chunks is optional.

We create the schema of the data we'll be writing to the stream formatted as a JSON Schema.

Records in the dataset are read by calling `read_data` function and written to the stream by calling `write_data`.

## Import the Nobel Prize winners data into TerminusDB/ TerminusX

```
$ python nobel_prize.py | target-terminusdb -c config.json
```

## Verify the data is in TerminusDB/TerminusX

Check if the documents are looking good by using the following command to get 10 documents to inspect:

```
$ tdbpy alldocs -h 10
```
