# Supply Chain Data Ingestion

The following example shows how you can perform an ingestion using
python from an Excel spreadsheet.

## Preparation

First, create a virtual environment:

```shell
$ python3 -m venv ~/.virtualenvs/terminusdb
$ source ~/.virtualenvs/terminusdb/bin/activate
```

Now we can install the TerminusDB Python Client:

```shell
$ python3 -m pip install terminusdb-client
```

Finally, we will need to install the supporting libraries for reading
Excel files.

```shell
$ pip install openpyxl
```

## Schema Inference

The first step is to build a schema, however, since we already have a
well structured Excel file which contains data type information and
column names, it makes sense to try to produce on automatically.

We do this by invocing the file `infer_schema.py`:

```shell
$ python infer_schema.py
```

This program opens the notebook, and iterates over each sheet, taking
the column names and inferring a data type for the column. The heart
of this inference is in the function `infer_schema`:

```python
def infer_schema(wb_obj):
    schema = []
    for sheet_name in wb_obj.sheetnames:
        schema_obj = { '@type' : 'Class', '@id' : sheet_name }
        object_type = sheet_name
        sheet_obj = wb_obj[sheet_name]
        # Collect header
        for i in itertools.count(start=1):
            cell = sheet_obj.cell(row = 1, column = i)
            property_name = cell.value
            if property_name == None:
                break
            else:
                schema_obj[property_name] = infer_type(sheet_obj, i)

        schema.append(schema_obj)
    return schema
```

The type inference takes the sheet and the current column number and
tries to take a stab at the correct type.

```python
def infer_type(sheet_obj, j):
    ty = None
    for i in range(2, 2+MAX_ROW_SEARCH):
        val = sheet_obj.cell(row = i, column = j).value
        if val == None:
            break
        else:
            ty = type_map(sheet_obj.cell(row = i, column = j))
    return ty
```

In the actual implementation, `MAX_ROW_SEARCH` is set to 1, but in
general, it might be useful to look at more cells to see if there are
empty cells (an optional) or if there are a very small limited number
of options (a potential enum).

The type map translates Excel data types into xsd data types using the
following function:

```python
def type_map(cell):
    value = cell.value
    ty = cell.data_type
    if ty == 'n':
        return "xsd:decimal"
    elif ty == 's':
        matches = re.match(OID_REGEXP, value)
        if matches:
            matchdict = matches.groupdict()
            for key in matchdict:
                if matchdict[key]:
                    return key
            None
        else:
            return "xsd:string"
    elif ty == 'd':
        return "xsd:dateTime"
```

Here there is one additional fold. The objects in the tables are
represented using an identifier prefixed with some code. We use a
regexp to match these as IDs, along with a group name which happens to
be the class we will use to hold the identifiers.

```regexp
^(?P<Port>PORT\d*)|(?P<Plant>(PLANT|CND)\d*)|(?P<Customer>V(\d|_)*)$
```

And that's basically it! Once you've run this program, you'll get a
JSON output of the schema.

## Ingesting the data

Once you've done the schema inference you can run the ingest as
follows:

```shell
$ python ingest.py
```

If you are using TerminusCMS you should replace the client connection
information with the snippet obtained from your profile.

Here again, the ingest heavy-lifting is done by a single function
which iterates over the workbook and inserts one object type per
table.

```python
def import_data(client,schema):
    objects = []
    stubs = {}
    wb_obj = openpyxl.load_workbook(path)
    for sheet_name in wb_obj.sheetnames:
        print(f"Processing objects {sheet_name}")
        object_type = sheet_name
        sheet_obj = wb_obj[sheet_name]
        cls = schema[object_type]
        property_types = []
        # Collect header
        for i in itertools.count(start=1):
            property_type = sheet_obj.cell(row = 1, column = i).value
            if property_type == None:
                break
            else:
                property_types.append(property_type)
        for j in itertools.count(start=2):
            obj = { '@type' : object_type }
            value = None
            for i, property_type in enumerate(property_types, 1):
                #print(f"{i} {j}")
                value_cell = sheet_obj.cell(row = j, column = i)
                value = value_cell.value
                if value == None:
                    break
                else:
                    rng = cls[property_type]
                    #print(rng)
                    #print(f"property_type: {property_type} range: {rng} value: {value}")
                    if base_type(rng):
                        if 'xsd:dateTime' == rng:
                            obj[property_type] = value.isoformat()
                        else:
                            obj[property_type] = value
                    else:
                        matches = re.match(infer_schema.OID_REGEXP, value)
                        if matches:
                            matchdict = matches.groupdict()
                            for key in matchdict:
                                # print(f"matchdict[{key}] = {matchdict[key]}")
                                if matchdict[key]:
                                    stubs[value] = key
                            # print(stubs)
                            if value not in stubs:
                                print(matchdict)
                                print(f"value: {value}")
                                exit(0)
                            obj[property_type] = { '@ref' : value }
            if value == None:
                break
            objects.append(obj)
        # print(objects[-1])
    for oid in stubs:
        object_type = stubs[oid]
        objects.append({'@type' : object_type, '@capture' : oid, 'id' : oid })
    with open('objects.json', 'w') as f:
        f.write(json.dumps(objects))
    client.insert_document(objects)
```

Most of this marshalling is straight-foward, however, there are a few
things of interest to note.

Our date type needs to be converted to one that is in ISO 8601.in
order to be understood by TerminusDB. This is a straigtforward process
of calling the `isoformat` function.

Those columns that point to object identifiers add a `@ref`, which
allows the foreign object id reference to be used as if it were an
internal terminusdb ID reference. TerminusDB will assign its own id,
but we're allowed to use this one for the purposes of our
transaction. This is extremely convenient when importing from foreign
sources.

Finally, at the end of ingestion, we need to put in object stubs for
each kind of object which is referred to as a reference in our
tables. These tables all represent relationships between objects who
have nothing but an object identifier, which is a fairly standard
approach to relational database management.

## Conclusion

Schema inference is often less trouble than writing a schema from
scratch, and can provide a baseline model which can be altered later
as more information becomes available from other sources. In this case
the schema inference was only about 70 lines of code.

Hopefully this tutorial gives some ideas about how to attack ingestion
problems from traditional database, csv and excel sources.
