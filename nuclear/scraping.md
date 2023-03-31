# Scraping and Validating Data

The current data product is now more complete, but we still have no
information about reactors. It would be nice if, instead of simply
having the power plant, we also had the individual reactors that make
up the plant.

We can improve our data by making use of *scraping*.

## Preliminaries

We're going to use BeautifulSoup 4 to do our scraping. How
BeautifulSoup works is beyond the scope of this tutorial, but as
you'll see from the examples, it's fairly straightforward.

```python
#!/usr/bin/python3
from terminusdb_client import Client
import requests
import re
import os
import urllib
import json
import datetime as dt
from bs4 import BeautifulSoup
```

## Data lineage and Scraping

Since we're going to be enriching our data from another data source,
we might want to keep track of the fact that we are doing so. With the
use of inheritance we can add a bit of metadata to our ontology by
subclassing `Quantity`.  We then add the `source` field, and define a
type of source.

One can imagine defining a host of different sources, each with
meaningful information of where and how to obtain them to cross-check
data during validation.

```javascript
[
    { "@type" : "Class",
      "@id" : "SourcedQuantity",
      "@documentation" : {
          "@comment" : "A data point which has a recorded source",
          "@properties" : { "source" : "The source from which the quantity was found."}
      },
      "@inherits" : "Quantity",
      "@key" : { "@type" : "Lexical",
                 "@fields" : ["unit", "quantity"] },
      "@subdocument" : [],
      "source" : "Source" },

    { "@type" : "Class",
      "@id" : "Source",
      "@documentation" : {
          "@comment" : "The Source of some data."
      }
    },

    { "@type" : "Class",
      "@id" : "ScrapedSource",
      "@documentation" : {
          "@comment" : "Source of data scraped from a URL on the internet.",
          "@properties" : { "name" : "Name of the scraped source.", }
      },

      "@key" : { "@type" : "Lexical",
                 "@fields" : ["url", "scraped_at"] },
      "@inherits" : "Source",
      "name" : "xsd:string",
      "url" : "xsd:string",
      "scraped_at" : "xsd:dateTime" }
]
```

We will load this in with the following schema update:

```python
def import_source(client):
    # Opening JSON file
    schema = open('source.json',)
    schema_objects = json.load(schema)

    client.message = "Adding Source Schema"
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added source schema: {results}")
```

## Scraping

The main idea behind our scraper is to try to find wikipedia pages
which have info about our reactors. We try to guess the name of the
nuclear power plant by using the name field from those already entered
in our database. Wikipedia has naming conventions which make this
fairly straight forward. We can use `pretty_name = name.capitalize()`
and string interpolation to build up our url.

We then use the requests library to get the page. If it doesn't exist
we report it to standard out. In a real application you'd probably
want to log the failure and maybe come up with a more robust guessing
approach or maybe use the wikipedia search function with a "I'm
feeling lucky" option.

After we obtain the page with a status code of 200, we try to grab the
infobox table. From the table we go through every row, testing for the
`Units operational` header, and then pull out the data. We then add
each reactor core discovered back into our nuclear power plant data.

```python
def update_reactors(client):
    reactors = client.query_document({ '@type' : 'Reactor' })
    for reactor in reactors:
        rid = reactor['@id']
        print(f"Deleting document '{rid}'")
        client.delete_document([rid], commit_msg="Removing old reactors")

    plants = client.query_document({ '@type' : 'NuclearPowerPlant' })
    for plant in plants:
        name = plant['name']
        pretty_name = name.capitalize()
        print(pretty_name)
        url=f"https://en.wikipedia.org/wiki/{pretty_name}_Nuclear_Power_Plant"
        response = requests.get(
	        url=url,
        )
        # Current time
        now = dt.datetime.now().isoformat()
        reactors = []
        if response.status_code == 200:
            print(f"Found page for {pretty_name}")

            soup = BeautifulSoup(response.content, 'html.parser')


            table = soup.find('table', {'class' : "infobox"})
            infobox_rows = table.find_all('tr') if table else []

            for row in infobox_rows:
                if row.find('th'):
                    if row.find('th').text == 'Units operational':
                        reactor_powers = row.find('td')
                        for br in reactor_powers.find_all("br"):
                            br.replace_with("\n")
                        reactor_power_list = reactor_powers.text.split('\n')
                        count = 1
                        for reactor_power in reactor_power_list:
                            print(reactor_power)
                            lst = re.split(' (x|×) ', reactor_power)
                            if len(lst) == 3:
                                [number, x, power_mw] = lst
                                m = re.match('(\d*).MW', power_mw)
                                for i in range(count, count+int(number)):
                                    if m:
                                        source = { '@type' : "ScrapedSource",
                                                   'url' : url,
                                                   'scraped_at' : now,
                                                   'name' : 'Wikipedia'
                                                 }
                                        reactor = { '@type' : 'PowerReactor',
                                                    'name' : f"{pretty_name} {count}",
                                                    'capacity' : { '@type' : 'SourcedQuantity',
                                                                   'unit' : 'Unit/MWe',
                                                                   'source' : source,
                                                                   'quantity' : m[1] }}
                                        reactors.append(reactor)
                                    count += 1

            if reactors != []:
                print(json.dumps(reactors, indent=4, sort_keys=True))
                plant['reactors'] = reactors
                try:
                    client.update_document(plant)
                except Exception as e:
                    print(str(e))
        else:
            print(f"Can't find page for {pretty_name}")

    return True
```

The `reactor = { '@type' : 'PowerReactor', ... }` information also
elaborates the `SourcedQuantity` with the source data, including the
url and time of scraping.

## Running the script

Of course we need to go ahead and run the whole thing. We connect to
the database as usual, run the schema import and begin firing away
updating our reactors.

```python
if __name__ == "__main__":

    team = os.environ['TERMINUSDB_TEAM']
    team_quoted = urllib.parse.quote(team)
    client = Client(f"https://cloud.terminusdb.com/{team_quoted}/")
    dbid = 'nuclear'
    client.connect(db=dbid,team=team, use_token=True)

    import_source(client)
    update_reactors(client)
```
