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


def lookup_definitions(Word):
    result = WQ().distinct("v:Definition").woql_and(
        WQ().triple("v:_Blank", "ontolex:writtenRep", {'@value' : Word,
                                                       '@language' : 'en'}),
        WQ().triple("v:X", "ontolex:canonicalForm", "v:_Blank"),
        WQ().triple("v:X", "ontolex:sense", "v:Lemma"),
        WQ().triple("v:Lemma", "ontolex:isLexicalizedSenseOf", "v:PWN"),
        WQ().triple("v:PWN", "wn:definition", "v:_Blank2"),
        WQ().triple("v:PWN", "wn:partOfSpeech", "v:Part_Of_Speech"),
        WQ().triple("v:_Blank2", "rdf:value", "v:Definition"),
    ).execute(client)
    bindings = result['bindings']
    definitions = []
    for binding in bindings:
        definitions.append({
            'word' : Word,
            'part_of_speech' : binding['Part_Of_Speech'],
            'definition' : binding['Definition']['@value']
        })
    return definitions

def lookup_antonyms(Word):
    result = WQ().distinct("v:Antonym").woql_and(
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
        antonyms.append({ 'word' : Word,
                          'antonym' : binding['Antonym']['@value']})
    return antonyms

def lookup_hyponyms(Word):
    result = WQ().distinct("v:Hyponym").woql_and(
        WQ().triple("v:_Blank", "ontolex:writtenRep", {'@value' : Word,
                                                       '@language' : 'en'}),
        WQ().triple("v:Base_Lemma", "ontolex:canonicalForm", "v:_Blank"),
        WQ().triple("v:Base_Lemma", "ontolex:sense", "v:Lemma"),
        WQ().triple("v:Lemma", "ontolex:isLexicalizedSenseOf", "v:PWN"),
        WQ().triple("v:PWN", "wn:hyponym", "v:Hypo_PWN"),
        WQ().triple("v:Hypo_Lemma", "ontolex:isLexicalizedSenseOf", "v:Hypo_PWN"),
        WQ().triple("v:Base_Hypo_Lemma", "ontolex:sense", "v:Hypo_Lemma"),
        WQ().triple("v:Base_Hypo_Lemma", "ontolex:canonicalForm", "v:_Blank_2"),
        WQ().triple("v:_Blank_2", "ontolex:writtenRep", "v:Hyponym")
    ).execute(client)
    bindings = result['bindings']
    hyponyms = []
    for binding in bindings:
        hyponyms.append({ 'word' : Word,
                          'hyponym' : binding['Hyponym']['@value']})
    return hyponyms

def lookup_hypernyms(Word):
    result = WQ().distinct("v:Hypernym").woql_and(
        WQ().triple("v:_Blank", "ontolex:writtenRep", {'@value' : Word,
                                                       '@language' : 'en'}),
        WQ().triple("v:Base_Lemma", "ontolex:canonicalForm", "v:_Blank"),
        WQ().triple("v:Base_Lemma", "ontolex:sense", "v:Lemma"),
        WQ().triple("v:Lemma", "ontolex:isLexicalizedSenseOf", "v:PWN"),
        WQ().triple("v:PWN", "wn:hypernym", "v:Hyper_PWN"),
        WQ().triple("v:Hyper_Lemma", "ontolex:isLexicalizedSenseOf", "v:Hyper_PWN"),
        WQ().triple("v:Base_Hyper_Lemma", "ontolex:sense", "v:Hyper_Lemma"),
        WQ().triple("v:Base_Hyper_Lemma", "ontolex:canonicalForm", "v:_Blank_2"),
        WQ().triple("v:_Blank_2", "ontolex:writtenRep", "v:Hypernym")
    ).execute(client)
    bindings = result['bindings']
    hypernyms = []
    for binding in bindings:
        hypernyms.append({ 'word' : Word,
                          'hypernym' : binding['Hypernym']['@value']})
    return hypernyms

def part_of_speech(X):
    if X == 'http://wordnet-rdf.princeton.edu/ontology#verb':
        return 'v'
    elif X == 'http://wordnet-rdf.princeton.edu/ontology#noun':
        return 'n'
    elif X == 'http://wordnet-rdf.princeton.edu/ontology#adjective':
        return 'a'
    elif X == 'http://wordnet-rdf.princeton.edu/ontology#adverb':
        return 'av'
    else:
        return '(unknown)'

if __name__ == "__main__":
    wordlist = ["fruit", "hate", "enjoy", "dog", "propel"]
    for word in wordlist:
        print("")
        definitions = lookup_definitions(word)
        for definition in definitions:
            pos = part_of_speech(definition['part_of_speech'])
            definition = definition['definition']
            print(f"{word} ({pos}): {definition}")

        antonyms = lookup_antonyms(word)
        for antonym in antonyms:
            anto_word = antonym['antonym']
            print(f"antonym: {anto_word}")

        hyponyms = lookup_hyponyms(word)
        for hyponym in hyponyms:
            syno_word = hyponym['hyponym']
            print(f"hyponym: {syno_word}")

        hypernyms = lookup_hypernyms(word)
        for hypernym in hypernyms:
            syno_word = hypernym['hypernym']
            print(f"hypernym: {syno_word}")
