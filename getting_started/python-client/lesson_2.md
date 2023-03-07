# Lesson 2 - Importing a CSV file into the database

> **_NOTE:_** from version 10.1.0 the CLI command is `tdbpy` instead of `terminusdb`

## The `tdbpy importcsv` Command

In this lesson, we will import a CSV file with the `tdbpy importcsv` command. It provides a very simple way to import a CSV. There are a few things that you can control with the `tdbpy importcsv` command, such as setting the separator character, how to handle NAs, and linking columns using a key columns. For more complicated data handling, a Python script is needed and we will demonstrate that in lesson 5: [Importing data form Python script](lesson_3.md)

The example below enables you to see all the available options in `tdbpy importcsv`:

```
$ tdbpy importcsv --help
Usage: tdbpy importcsv [OPTIONS] CSV_FILE [KEYS]...

  Import CSV file into pandas DataFrame then into TerminusDB, with
  read_csv() options. Options like chunksize, sep etc

Options:
  --classname TEXT            Customize the class name that data from the
                              CSV will be imported as

  --chunksize INTEGER         Large files will load into the database in
                              chunks, size of the chunks  [default: 1000]

  --schema                    Specify if the schema is to be updated if it exists,
                              default False

  --na [skip|optional|error]  Specify how to handle NAs: 'skip' will skip
                              entries with NAs, 'optional' will make all
                              properties optional in the database, 'error'
                              will just throw an error if there are NAs

  --id TEXT                   Specify the column to be used as ids instead of
                              generated ids

  -e, --embedded TEXT         Specify embedded columns
  -m, --message TEXT          Commit message for the import
  --sep TEXT                  Specify separator character in the CSV
                              [default: ,]

  --help                      Show this message and exit.
```

## Importing CSV

We will continue working with the phonebook example. We will import the [Employees.csv](Employees.csv) file. Which looks like this:

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 001         | Destiny Norris | Marketing Manager   | Marketing   |             |
| 002         | Darci Prosser  | Creative Writer     | Marketing   | 001         |
| 003         | Alanah Bloggs  | Frontend Developer  | IT          | 004         |
| 004         | Fabian Dalby   | Web Service Manager | IT          |             |

As you see there is `Employee id` used as a key to link to the `Manager` field showing who the employee's manager is.

To link them, we must first install the `pandas` library.
```sh
$ pip install pandas
```
We can then import the CSV file with the following command:

```
$ tdbpy importcsv Employees.csv --classname EmployeesFromCSV --id "Employee id" -e Manager -m "Import Employees from CSV"
0it [00:00, ?it/s]
Schema object EmployeesFromCSV created with Employees.csv being imported into database.
1it [00:00,  1.27it/s]
Records in Employees.csv inserted as type EmployeesFromCSV into database with specified ids.
```

We have imported the CSV file with the class as `EmployeesFromCSV`. There is a new class object in `schema.py` that was created along with the import:

```python
class EmployeesFromCSV(DocumentTemplate):
    employee_id: str
    manager: Optional["EmployeesFromCSV"]
    name: Optional[str]
    team: Optional[str]
    title: Optional[str]
```

Now we can verify our data:

```
$ tdbpy alldocs
[{'@id': 'EmployeesFromCSV/001', '@type': 'EmployeesFromCSV', 'employee_id': '001', 'name': 'Destiny Norris', 'team': 'Marketing', 'title': 'Marketing Manager'}, {'@id': 'EmployeesFromCSV/002', '@type': 'EmployeesFromCSV', 'employee_id': '002', 'manager': 'EmployeesFromCSV/001', 'name': 'Darci Prosser', 'team': 'Marketing', 'title': 'Creative Writer'}, {'@id': 'EmployeesFromCSV/003', '@type': 'EmployeesFromCSV', 'employee_id': '003', 'manager': 'EmployeesFromCSV/004', 'name': 'Alanah Bloggs', 'team': 'IT', 'title': 'Frontend Developer'}, {'@id': 'EmployeesFromCSV/004', '@type': 'EmployeesFromCSV', 'employee_id': '004', 'name': 'Fabian Dalby', 'team': 'IT', 'title': 'Web Service Manager'}]
```

In [chapter 5](lesson_5.md) we will learn how to query this data and/ or export data into CSV.

---

[Move on to Lesson 3 - Importing data form Python script](lesson_3.md)
