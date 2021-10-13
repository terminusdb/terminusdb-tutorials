# Data Product Enrichment

In this tutorial we will look at data product enrichment - adding new
or derived information to an existing data product.

## Preliminaries

Of course we need the client so we can talk to the server...

```python
#!/usr/bin/python3
from terminusdb_client import WOQLClient
import os
import json
import urllib.parse

team = os.environ['TERMINUSDB_TEAM']
team_quoted = urllib.parse.quote(team)
client = WOQLClient(f"https://cloud.terminusdb.com/{team_quoted}/")
client.connect(db="nuclear", team=team, use_token=True)
```

## Calculated Values

Our power plants have information about their capacity, and they have
information about their annual production, but they don't give us
their capacity factor.

We can actually calculate this with a little work!

First we'll add a bit of data verification code - just so we know that
our calculations are working with the right units when we make manipulations.

```python
def quantity_of(quantity,unit):
    if quantity['unit'] == unit:
        return quantity['quantity']
    else:
        raise Exception(f"Need quantity in {unit}")
```

With this we can extract the values safely, knowing they are what we
think they are.

## Safety first

But we are modifying the core database with enriched data. This might
not be a good idea. It's very possible that we mess something up in
our calculations, and people might be using the production database.

We are also deriving data - and sometimes when you derive data its a
good idea to keep it segregated from the underived data. This way you
know what is "ground truth" and you can re-run your processes to
obtain the derived facts later.

Luckily, we have an easy way of doing this: *branching*.

```python
branch = "capacity_factors"
try:
    client.delete_branch(branch)
except Exception as E:
    print(E.error_obj)
    print("Branch did not yet exist")

client.create_branch(branch)
client.branch = branch
```

We have created a safe space in which to do our experiments. If we
mess it up, we can just delete the branch.

Next, we will actually do the calculation. We loop over every power
plant in the database, we loop over each year for which we have
calculated data, then we enrich the document with the calculated
capacity factor for a given year, and return it to the database!

```python

plants = client.query_document({ '@type' : 'NuclearPowerPlant' })
for plant in plants:
    capacity = quantity_of(plant['capacity'],'Unit/MWe')
    print(f"capacity {capacity}")
    if 'output' in plant:
        output = plant['output']
        capacity_factors = []
        for output_year in output:
            year = output_year['year']
            GWh = quantity_of(output_year['output'],'Unit/GWh')
            if not(GWh == 0):
                capacity_factor = GWh * 1000 / (capacity * 24 * 365)
                capacity_factors.append({ '@type' : 'AnnualCapacityFactor',
                                          'year' : year,
                                          'capacity_factor' : capacity_factor })
        plant['capacity_factor'] = capacity_factors
        try:
            result = client.update_document(plant)
            plant_id = plant['@id']
            print(f"Updated... {plant_id}")
        except Exception as E:
            if hasattr(E,'error_obj'):
                print(json.dumps(E.error_obj, indent=4, sort_keys=True))
            else:
                print("Unknown error")
                print(E)

```

Now that we've seen some enrichment based on inference from data which
we already have, you might be interested in how to further improve our
data in [Part 3: Scraping Data](./scraping.md).
