# Nuclear Reactor Data Product

In this tutorial we will be building a knowledge graph of nuclear
reactors. This will incorporate information about units,
geocoordinates and elements, all of which are required to fully
understand our reactors.

## Running the Tutorial

This is a literate programming tutorial. This means you can either
copy-paste the snippets and run them yourself, but you can also clone
the repository and run this file directly using
[pweave](https://mpastell.com/pweave/).

To clone the repository and run it, first you'll need a [key from
TerminusX](https://docs.terminusdb.com/v10.0/#/terminusx/get-your-api-key).

You will also need to copy your team name into the enviornment variable

If you have [pip](https://pypi.org/project/pip/) already installed you
can run this tutorial automatically with:

```shell
$ pip install pweave
$ git clone https://github.com/terminusdb/terminusdb-tutorials/
$ cd terminusdb-tutorials/nuclear
$ TERMINUSDB_TEAM="my team here" TERMINUSDB_ACCESS_TOKEN="my API key here" pweave nuclear.md -o output.md
```

## Preliminaries

To get started we first have to import a few python libraries that
we'll need...


```python
#!/usr/bin/python3
from terminusdb_client import WOQLClient
import re
import csv
import json
import math
import os
import urllib.parse
```



We also need to connect to TerminusX, where we are going to store our
data. Once we have a client, we run connect which will throw an error
if there is a problem getting into our account.


```python
team = os.environ['TERMINUSDB_TEAM']
team_quoted = urllib.parse.quote(team)
client = WOQLClient(f"https://cloud.terminusdb.com/{team_quoted}/")
# make sure you have put the token in environment variable
# https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
client.connect(team=team, use_token=True)
```

Once we are in, we can start to build our data product. A data product
is composed of a unique identifier (which will be used in URIs), a
label, which will be the pretty name used, and a description which can
be a long (or short) introduction to the data product.

We also have to describe our prefixes. These are going to be the base
of the URI used for identifiers for data (`@base`) or for schema
elements (`@schema`). These are important in a world of interconnected
data products so that we don't step on other peoples toes and make
things interoperable. But don't worry, the URIs do not have to resolve
to a resource in a browser so just make sure that it is unique.


```python
dbid = "nuclear"
label = "Nuclear"
description = "A knowledge graph of nuclear power."
prefixes = {'@base' : 'http://lib.terminusdb.com/nuclear/',
            '@schema' : 'http://lib.terminusdb.com/nuclear#'}
```



Now we get to the meat. We will want to describe *where* our reactors
are. In order to do that we need a geo-coordinate. Hence we've created
a small schema called `geo_schema.json`, which has (among other
things), the following definition:

```json
{ "@type" : "Class",
  "@id" : "GeoCoordinate",
  "@subdocument" : [],
  "@key" : { "@type" : "Lexical",
             "@fields" : ["latitude", "longitude"] },
  "latitude" : "xsd:decimal",
  "longitude" : "xsd:decimal"
}
```

This describes a JSON document which should have a `latitude` and
`longitude`, both of which are numbers. It also describes itself as a
subdocument, which means it will be contained in our owning document,
and it will generate a unique key for its id automatically from the
latitude and longitude.

In order to insert this information, we will load the json as a list
of dictionaries using the `json` library, and then we will submit it
to the server with `client.insert_document(schema_objects,
graph_type="schema")`.  This allows us to insert a number of schema
objects which may refer to eachother, in a single transaction which
will be commited to our data product.


```python
def import_geo(client):
    # Opening JSON file
    schema = open('geo_schema.json',)
    schema_objects = json.load(schema)

    client.message = "Adding Geo Schema"
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added geo schema: {results}")
```



Once we have run this we will print out the *ids* of the resulting
inserted objects. We can then get started on the next section. Loading
our *units*.

Things such as area, power, atomic weight, etc. which might be
relevant to a reactor data product, all require quantities which are
expressed in terms of units. And these units in turn are built to
describe certain *dimensions* such as *length*, *area*, *charge*
etc. It is useful to avoid confusion by specifying what kind of units
we are actually storing.

You can take a look in the `unit_schema.json` file to see the schema,
and then check out some of the pre-defined units which we will be
importing as data in `units.json`.


```python

def import_units(client):
    # Opening JSON file
    schema = open('unit_schema.json',)
    instance = open('units.json',)

    schema_objects = json.load(schema)
    instance_objects = json.load(instance)

    client.message = "Adding Unit Schema."
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added unit schema: {results}")
    client.message = "Adding Units."
    results = client.insert_document(instance_objects)
    print(f"Added units: {results}")
```



The next stage is importing the elements. Here we are actually going
to build up a custom schema from a csv file which incorporates all of
the elements and their isotopes as enumerated types. Since there are a
small number of these, and they don't move around much, it makes sense
to give them fixed ids.

You can see that we just open a CSV file, and then do a bit of data
wrangling in order to get lists which we will submit using the
`client.insert_documents` function again.

```python
def elements_schema(client):
    isotope_names = []
    element_names_dict = {}
    element_symbols = {}
    with open('elements.csv', newline='') as csvfile:
        next(csvfile)
        isotope_rows = csv.reader(csvfile, delimiter=',')
        for row in isotope_rows:
            z,name,symbol,mass,abundance = row
            isotope_names.append(symbol)
            element_names_dict[name] = True
            m = re.match('\d+([^\d]*)',symbol)
            if m:
                element_symbols[m[1]] = True

    element_names = list(element_names_dict.keys())
    element_symbols = list(element_symbols.keys())

    element_symbols_enum = {'@type' : 'Enum',
                            '@id' : 'ElementSymbol',
                            '@value' : element_symbols}
    element_names_enum = {'@type' : 'Enum',
                          '@id' : 'ElementName',
                          '@value' : element_names}
    isotope_names_enum = {'@type' : 'Enum',
                          '@id' : 'IsotopeName',
                          '@value' : isotope_names}
    substance = { '@type' : 'Class',
                  '@id' : 'Substance',
                  'name' : 'xsd:string' }
    compound = { '@type' : 'Class',
                 '@id' : 'Compound',
                 '@inherits' : ["Substance"],
                 'formula' : 'xsd:string',
                 'elements' : { "@type" : "Set",
                                "@class" : "Element"} }
    isotope = {'@type' : 'Class',
               '@id' : 'Isotope',
               '@inherits' : ["Substance"],
               'isotope_name' : 'IsotopeName',
               'abundance' : { "@type" : "Optional",
                               "@class" : 'Quantity'},
               'mass' : 'Quantity'}
    element = {'@type' : 'Class',
               '@id' : 'Element',
               "@inherits" : ["Substance"],
               'atomic_number' : 'xsd:nonNegativeInteger',
               'element_name' : 'ElementName',
               'element_symbol' : 'ElementSymbol',
               'isotopes' : {'@type' : 'Set',
                             '@class' : 'Isotope'}}

    classes = [
        # context,
        element_names_enum,
        element_symbols_enum,
        isotope_names_enum,
        substance,
        compound,
        isotope,
        element
    ]

    documents = client.get_all_documents(graph_type="schema")

    client.message = "Adding Elements Schema"
    results = client.insert_document(classes,
                                     graph_type="schema")
    print(f"Added elements: {results}")

```

Once our schema is loaded, we can load the actual element data. We
will be able to point to these now when we are interested in
describing substances such as our moderator.

```python
def load_elements(client):
    isotopes = []
    elements = {}
    with open('elements.csv', newline='') as csvfile:
        next(csvfile)
        isotope_rows = csv.reader(csvfile, delimiter=',')
        for row in isotope_rows:
            z,name,symbol,mass,abundance = row
            z_int = int(z)
            if not (z in elements):
                element = {'@type' : 'Element',
                           '@id' : f'Element/{name}',
                           'name' : name,
                           'atomic_number' : z_int,
                           'isotopes' : [],
                           'element_name' : name}

                m = re.match('\d+([^\d]*)',symbol)
                if m:
                    element['element_symbol'] = m[1]
                elements[z] = element

            isotope = {'@type' : 'Isotope',
                       '@id' : f'Isotope/{symbol}',
                       'name' : symbol,
                       'isotope_name' : symbol}

            if not abundance == '*':
                isotope['abundance'] = {'@type' : 'Quantity',
                                        'unit' : 'Unit/appm',
                                        'quantity' : float(abundance) * 1000 }

            mass_match = re.match('[^\d]*((\d|\.)+)[^\d]*', mass)
            if mass_match:
                isotope['mass'] = { '@type' : 'Quantity',
                                    'unit' : 'Unit/u',
                                    'quantity' : float(mass_match[1]) }

            elements[z]['isotopes'].append(isotope)

    elements = list(elements.values())
    objects = elements + isotopes
    client.message = "Adding Elements."
    client.insert_document(objects)
```

Our preliminary nuclear reactor schema is not very elaborate. We
basically just create a few classes and a small hierarchy which we can
fill from the CSV below, but which can also be filled out later by
hand in the TerminusX document editor, or by enriching the data
programmatically.

```python
def nuclear_schema(client):
    # Opening JSON file
    schema = open('nuclear_schema.json',)

    schema_objects = json.load(schema)
    client.message="Adding Units Schema."
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added Units: {results}")
```

And now finally comes the heavy lifting. We import the power reactors
from the [Global Database of Power
Plants](https://datasets.wri.org/dataset/globalpowerplantdatabase)
from the World Resources Institute.

As you can see from the function, we create a list of years of output,
all coded with appropriate units (Gigawatt hours) as well as
geocoordinates and some other information.

```python
def import_nuclear(client):
    with open('nuclear.csv', newline='') as csvfile:
        next(csvfile)
        isotope_rows = csv.reader(csvfile, delimiter=',')
        reactors = []
        for row in isotope_rows:
            country,country_long,name,gppd_idnr,capacity_mw,latitude,longitude,primary_fuel,other_fuel1,other_fuel2,other_fuel3,commissioning_year,owner,source,url,geolocation_source,wepp_id,year_of_capacity_data,generation_gwh_2013,generation_gwh_2014,generation_gwh_2015,generation_gwh_2016,generation_gwh_2017,generation_gwh_2018,generation_gwh_2019,generation_data_source,estimated_generation_gwh_2013,estimated_generation_gwh_2014,estimated_generation_gwh_2015,estimated_generation_gwh_2016,estimated_generation_gwh_2017,estimated_generation_note_2013,estimated_generation_note_2014,estimated_generation_note_2015,estimated_generation_note_2016,estimated_generation_note_2017 = row
            output = []
            if not(generation_gwh_2013 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2013,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2013 }
                               })
            if not(generation_gwh_2014 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2014,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2014 }
                               })
            if not(generation_gwh_2015 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2015,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2015 }
                               })
            if not(generation_gwh_2016 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2016,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2016 }
                               })
            if not(generation_gwh_2017 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2017,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2017 }
                               })
            if not(generation_gwh_2018 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2018,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2018 }
                               })
            if not(generation_gwh_2019 == ''):
                output.append({'@type' : 'AnnualOutput',
                               'year' : 2019,
                               'output' : { '@type' : 'Quantity',
                                            'unit' : 'Unit/GWh',
                                            'quantity' : generation_gwh_2019 }
                               })

            reactor = { '@type' : "PowerReactor",
                        'name' : name,
                        'country' : { '@type' : 'Country',
                                      'name' : country_long },
                        'location' : { '@type' : 'GeoCoordinate',
                                       'latitude' : latitude,
                                       'longitude' : longitude },
                        'capacity' : { '@type' : 'Quantity',
                                       'unit' : 'Unit/MWe',
                                       'quantity' : capacity_mw },
                        'gppd_idnr' : gppd_idnr,
                        'owner' : owner,
                        'url' : url
                       }

            if not(commissioning_year == ''):
                reactor['commissioning_year'] = math.floor(float(commissioning_year))
            if not(output == []):
                reactor['output'] = output

            print(json.dumps(reactor, indent=4, sort_keys=True))
            client.message=f"Adding civilian power reactor {name}"
            client.insert_document(reactor)
```

Now that all of these importation functions are defined, we can go
ahead and run things!

Since we might want to play with this script and run it a few types,
it's handy to delete the database if it already exists.

Now we go ahead and create the database, and presto, you should be
good to go. You can now try logging in to TerminusX and looking at the
data product.

Alternatively you can try getting one of the documents out and having
a read!


```python
if __name__ == "__main__":
    try:
        client.delete_database(dbid, team=team, force=True)
    except Exception as E:
        print("No database exists yet")
    exists = client.get_database(dbid)

    if not exists:
        client.create_database(dbid,
                               team,
                               label=label,
                               description=description,
                               prefixes=prefixes)

    client.author="Gavin Mendel-Gleason"
    import_geo(client)
    import_units(client)
    elements_schema(client)
    load_elements(client)
    nuclear_schema(client)
    import_nuclear(client)

    result = client.get_document('PowerReactor/Armenian-2')
    print(result)

```

Now you've got some data, you can try to enrich it. For more on how
you can proceed, see our [documentation](https://docs.terminusdb.com/v10.0/).
