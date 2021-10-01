# Lesson 2 - Importing a CSV into the database

## The `terminusdb importcsv` Command

In this lesson, we will try to import a CSV with the `terminusdb importcsv` command. It provide a very simple way to import a CSV with less manual effort. There are a few things that you can control with the `terminusdb importcsv` command, like setting the separator character, how to handle NAs and linking columns using a key columns etc. For more complicated data handling, a Python script will be needed and we will demonstrate that the next lesson: [Importing data form Python script](lesson_3.md)

To see all the available options in `terminusdb importcsv`:

```
$ terminusdb importcsv --help
Usage: terminusdb importcsv [OPTIONS] CSV_FILE [KEYS]...

  Import CSV file into pandas DataFrame then into TerminusDB, with
  read_csv() options. Options like chunksize, sep etc

Options:
  --classname TEXT            Customize the class name that the data from the
                              CSV will be import as

  --chunksize INTEGER         Large files will be load into database in
                              chunks, size of the chunks  [default: 1000]

  --schema                    Specify if schema to be updated if existed,
                              default False

  --na [skip|optional|error]  Specify how to handle NAs: 'skip' will skip
                              entries with NAs, 'optional' will make all
                              properties optional in the database, 'error'
                              will just throw an error if there's NAs

  --id TEXT                   Specify column to be used as ids instead of
                              generated ids

  -e, --embedded TEXT         Specify embedded columns
  -m, --message TEXT          Commit message for the import
  --sep TEXT                  Specify separator character in the CSV
                              [default: ,]

  --help                      Show this message and exit.
```

## Importing CSV

Continue working with the phonebook example. We can now try to import the [Employees.csv](Employees.csv). Which looks like this:

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 001         | Destiny Norris | Marketing Manager   | Marketing   |             |
| 002         | Darci Prosser  | Creative Writer     | Marketing   | 001         |
| 003         | Alanah Bloggs  | Frontend Developer  | IT          | 004         |
| 004         | Fabian Dalby   | Web Service Manager | IT          |             |

As you see there are `Employee id` which are used as a key to link the `Manager` field to the person that is the manager of that employee.

To link them, we will do the following command to import the CSV:

```
$ terminusdb importcsv Employees.csv --classname EmployeesFromCSV --id "Employee id" -e Manager -m "Import Employees from CSV"
0it [00:00, ?it/s]
Schema object EmployeesFromCSV created with Employees.csv being imported into database.
1it [00:00,  1.27it/s]
Records in Employees.csv inserted as type EmployeesFromCSV into database with specified ids.
```

We have imported the CSV with the class as `EmployeesFromCSV` you can see that there is a new class object in `schema.py` that is created as well:

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
$ terminusdb alldocs
[{'@id': 'EmployeesFromCSV/001', '@type': 'EmployeesFromCSV', 'employee_id': '001', 'name': 'Destiny Norris', 'team': 'Marketing', 'title': 'Marketing Manager'}, {'@id': 'EmployeesFromCSV/002', '@type': 'EmployeesFromCSV', 'employee_id': '002', 'manager': 'EmployeesFromCSV/001', 'name': 'Darci Prosser', 'team': 'Marketing', 'title': 'Creative Writer'}, {'@id': 'EmployeesFromCSV/003', '@type': 'EmployeesFromCSV', 'employee_id': '003', 'manager': 'EmployeesFromCSV/004', 'name': 'Alanah Bloggs', 'team': 'IT', 'title': 'Frontend Developer'}, {'@id': 'EmployeesFromCSV/004', '@type': 'EmployeesFromCSV', 'employee_id': '004', 'name': 'Fabian Dalby', 'team': 'IT', 'title': 'Web Service Manager'}]
```

In [later chapters](lesson_4.md) we will also learn how to query this data and/ or export data into CSV ([or using Singer.io to export data into other data products](https://github.com/terminusdb/terminusdb-tutorials/tree/master/google_sheets/README.md)).

---

[Move on to Lesson 3 - Importing data form Python script](lesson_3.md)
