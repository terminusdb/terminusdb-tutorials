# Lesson 5 - Query on the database and get result back as CSV or DataFrame

In the past lessons, we have learnt how to build schema and import data. Now the database has all the data we wanted, what we will do after is to get information out of the data we have in the database.

In this lesson, we will learn how to query the database, get the information that we wanted. Then export either to a CSV for later use or to import as Pandas DataFrames for further investigation.

## Query data with the `tdbpy` command

The most direct way to query on data and export it as CSV is to use the `tdbpy` command.

If you are planning to export all documents in a particular type. You can simply use the `tdbpy exportcsv` command. Let's have a look a the command:

```
$ tdbpy exportcsv --help
Usage: tdbpy exportcsv [OPTIONS] CLASS_OBJ

  Export all documents in a TerminusDB class into a flatten CSV file.

Options:
  --keepid          If used, the id of the object and the other meta (@) is to
                    be kept as is in the CSV

  --maxdep INTEGER  Specify the depth of the embedding operation. When maximum
                    is hit, the values will be kept as object ids  [default:
                    2]

  --filename TEXT   File name if the exported file, if not specify it will use
                    the name of the class e.g. 'ClassName.csv'

  --help            Show this message and exit.
```

Now let's try to export all `Employee` to a file named `exported_employees.csv`

`$ tdbpy exportcsv --filename exported_employees.csv Employee`

Inspect [exported_employees.csv](exported_employees.csv) and it look just as what we expected. All 5 employees information is there.

But now, we want to only want the members of the IT team to be export in a CSV, we will have to do a bit of query. Let's try using the `-q` options with `tdbpy alldocs`

```
$ tdbpy alldocs --type Employee -q team=it
[{'@id': 'Employee/003', '@type': 'Employee', 'address': {'@id': 'Address/543050aaa73c4590b38f9aed129b17ff', '@type': 'Address', 'postcode': 'BD18 2PT', 'street': 'Otley Road', 'street_num': 139, 'town': ' Shipley'}, 'contact_number': '(01274) 708080', 'manager': 'Employee/004', 'name': 'Alanah Bloggs', 'team': 'it', 'title': 'Frontend Developer'}, {'@id': 'Employee/004', '@type': 'Employee', 'address': {'@id': 'Address/6665e689224d412aa3a882fcfd287676', '@type': 'Address', 'postcode': 'SK5 6SY', 'street': 'Ansdell Road', 'street_num': 2, 'town': ' Stockport'}, 'contact_number': '(0161) 532 7302', 'name': 'Fabian Dalby', 'team': 'it', 'title': 'Web Service Manager'}, {'@id': 'Employee/005', '@type': 'Employee', 'address': {'@id': 'Address/358ac353adbf494f97100330b504e818', '@type': 'Address', 'postcode': 'IV27 2TG', 'street': 'Shore Street', 'street_num': 84, 'town': 'Stoer'}, 'contact_number': '070 7796 8035', 'manager': 'Employee/004', 'name': 'Ethan Abbott', 'team': 'it', 'title': 'Backend Developer'}]
```

It's a bit hard to see so we are going to export it to [a CSV](exported_it_team.csv):

`$ tdbpy alldocs --type Employee -q team=it -e --filename exported_it_team.csv`

## Query data in Python script

If we want to do something more complicated, for example, see which team has longer names in average. We may have to export the result to a Pandas Dataframe and do more investigation. Let's have a look at [query_data.py](query_data.py).

We can make use of the magic function `result_to_df` to convert a result json to a Pandas DataFrame:

```python
from terminusdb_client.woqldataframe import result_to_df
```

Querying would be done by `query_document`, you will have to provide a template json that has `@type` and the specific requirement(s) (in our case, `"team": "it"` or `"team": "marketing"`).

```python
team_it_raw = client.query_document({"@type": "Employee", "team": "it"})
team_marketing_raw = client.query_document({"@type": "Employee", "team": "marketing"})
```

We can use `reault_to_df` to get DataFrames:

```python
team_it = result_to_df(team_it_raw)
team_marketing = result_to_df(team_marketing_raw)
```

Then, we can do all the data manipulation we love using Pandas:

```python
team_it_avg = team_it["name"].apply(len).sum() / len(team_it)
team_marketing_avg = team_it["name"].apply(len).sum() / len(team_marketing)
```

Print out the results.

```python
print(f"Average name length of IT team is {team_it_avg}")
print(f"Average name length of Marketing team is {team_marketing_avg}")
```

I won't spoil the results for you, you have to find it out yourself :-)

`$ python query_data.py`

---

[Move on to Lesson 6 - Version control: time travel, branching and rebase](lesson_6.md)
