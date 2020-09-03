#!/usr/bin/python3
from terminusdb_client import WOQLQuery as WQ
from terminusdb_client import WOQLClient

server_url="https://localhost:6363"
key="root"
user="admin"
account="admin"
db="wordnet"
client = WOQLClient(server_url)
client.connect(db=db, key=key, account=account, user=user , insecure=True)


def lookup_definition(Word):
    result = WQ().woql_and(
        WQ().triple("v:_Blank", "ontolex:writtenRep", {'@value' : Word,
                                                       '@language' : 'en'}),
        WQ().triple("v:X", "ontolex:canonicalForm", "v:_Blank"),
        WQ().triple("v:X", "ontolex:sense", "v:Lemma"),
        WQ().triple("v:Lemma", "ontolex:isLexicalizedSenseOf", "v:PWN"),
        WQ().triple("v:PWN", "wn:definition", "v:_Blank2"),
        WQ().triple("v:_Blank2", "rdf:value", "v:Definition"),
    ).execute(client)
    bindings = result['bindings']
    definitions = []
    for binding in bindings:
        definitions.append(binding['Definition'])
    return definitions

def lookup_antonym(Word):
    result = WQ().woql_and(
        WQ().triple("v:_Blank", "ontolex:writtenRep", {'@value' : Word,
                                                       '@language' : 'en'}),
        WQ().triple("v:Base_Lemma", "ontolex:canonicalForm", "v:_Blank"),
        WQ().triple("v:Base_Lemma", "ontolex:sense", "v:Lemma"),
        WQ().triple("v:Lemma", "wn:antonym", "v:Anto_Lemma"),
        WQ().triple("v:Anto_Base_Lemma", "ontolex:sense", "v:Anto_Lemma"),
        WQ().triple("v:Anto_Base_Lemma", "ontolex:canonicalForm", "v:_Blank_2"),
        WQ().triple("v:_Blank_2", "ontolex:writtenRep", "v:Antonym"),

    ).execute(client)
    bindings = result['bindings']
    antonyms = []
    for binding in bindings:
        antonyms.append(binding['Antonym']['@value'])
    return antonyms


print(lookup_definition("fruit"))
