#!/usr/bin/python3
from terminusdb_client import WOQLClient
import re
import csv
import json
import math

team = "TerminatorsX"
client = WOQLClient("https://cloud.terminusdb.com/TerminatorsX/")
# make sure you have put the token in environment variable
# https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
client.connect(team=team, use_token=True)

dbid = "nuclear"
label = "Nuclear"
description = "A knowledge graph of nuclear power."
prefixes = {'@base' : 'http://lib.terminusdb.com/nuclear/',
            '@schema' : 'http://lib.terminusdb.com/nuclear#'}


try:
    client.delete_database(dbid, team=team, force=True)
except Exception as E:
    print(E.error_obj)

def import_geo(client):
    # Opening JSON file
    schema = open('geo_schema.json',)
    schema_objects = json.load(schema)

    client.message = "Adding Geo Schema"
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added geo schema: {results}")

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

def nuclear_schema(client):
    # Opening JSON file
    schema = open('nuclear_schema.json',)

    schema_objects = json.load(schema)
    client.message="Adding Units Schema."
    results = client.insert_document(schema_objects,
                                     graph_type="schema")
    print(f"Added Units: {results}")

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

            #reactors.append(reactor)
    #client.message="Adding Civilian Power Reactors from the Global Power Plant Database."
    #client.insert_document(reactors)


if __name__ == "__main__":

    exists = client.get_database(dbid)

    if not exists:
        client.create_database(dbid,
                               team,
                               label=label,
                               description=description,
                               prefixes=prefixes)
    else:
        pass

    client.author="Gavin Mendel-Gleason"
    import_geo(client)
    import_units(client)
    elements_schema(client)
    load_elements(client)
    nuclear_schema(client)
    import_nuclear(client)
