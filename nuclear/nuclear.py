#!/usr/bin/python3
from terminusdb_client import WOQLClient

team = "TerminatorsX"
client = WOQLClient("https://cloud.terminusdb.com/TerminatorsX/")
# make sure you have put the token in environment variable
# https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
client.connect(team=team, use_token=True)

# team = "admin"
# client = WOQLClient("http://127.0.0.1:6363")
# client.connect()

dbid = "elements"
label = "A knowledge graph of the elements."
description = "A nuclear reactor knowledge graph"
try:
    client.delete_database(dbid, team=team, force=True)
except Exception as E:
    print(E.error_obj)

import re
import csv


def create_schema(client):
    context = {'@type' : '@context',
               '@base' : 'http://example.com/elements/',
               '@schema' : 'http://example.com/elements#',
               '@documentation' :
               { '@title' : 'Periodic Table of the Elements',
                 '@description' : 'This collection gives the periodic table of the elements with all isotopes together with their names, symbols and masses',
                 '@authors' : ["Gavin Mendel-Gleason"]
                }
               }
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
    isotope = {'@type' : 'Class',
               '@id' : 'Isotope',
               'isotope_name' : 'IsotopeName',
               'abundance' : { "@type" : "Optional",
                               "@class" : 'xsd:decimal'},
               'mass' : 'xsd:decimal'}
    element = {'@type' : 'Class',
               '@id' : 'Element',
               'atomic_number' : 'xsd:nonNegativeInteger',
               'element_name' : 'ElementName',
               'element_symbol' : 'ElementSymbol',
               'isotopes' : {'@type' : 'Set',
                             '@class' : 'Isotope'}}

    classes = [element_names_enum,
               element_symbols_enum,
               isotope_names_enum,
               isotope,
               element]

    try:
        documents = client.get_all_documents(graph_type="schema")
        print(list(documents))
        results = client.insert_document(classes,
                                         graph_type="schema")
        print(f"success on classes! {results}")
    except Exception as E:
        print(E)
        print(E.error_obj)


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
                           'atomic_number' : z_int,
                           'isotopes' : [],
                           'element_name' : name}

                m = re.match('(\d+)*',symbol)
                if m:
                    element['element_symbol'] = m[0]
                elements[z] = element

            isotope = {'@type' : 'Isotope',
                       '@id' : f'Isotope/{symbol}',
                       'isotope_name' : symbol}

            if not abundance == '*':
                isotope['abundance'] = float(abundance)

            mass_match = re.match('[^\d]*((\d|\.)+)[^\d]*', mass)
            if mass_match:
                isotope['mass'] = float(mass_match[1])

            elements[z]['isotopes'].append(isotope)

    elements = list(elements.values())
    objects = elements + isotopes

    try:
        client.insert_document(objects)
    except Exception as E:
        print(E)
        print(E.error_obj)

if __name__ == "__main__":

    exists = client.get_database(dbid)

    if not exists:
        client.create_database(dbid,team,label=label, description=description,
                               prefixes={'@base' : 'http://example.com/elements/',
                                         '@schema' : 'http://example.com/elements#'})
    else:
        pass
        #client.connect(team=team,db=dbid,use_token=True)
        #client.connect(team=team,db=dbid)
    create_schema(client)
    load_elements(client)
