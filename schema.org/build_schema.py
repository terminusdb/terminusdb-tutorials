from woqlclient import WOQLClient, WOQLQuery
import pandas as pd

server_url="http://localhost:6363"
key="root"
db_id="schema_tutorial"

SIMPLE_TYPE_MAP={"http://schema.org/Boolean": "boolean",
             "http://schema.org/Text": "string",
             "http://schema.org/Date": "dateTime",
             "http://schema.org/DateTime": "dateTime",
             "http://schema.org/URL": "string",
             "http://schema.org/XPathType": "string",
             "http://schema.org/Integer": "integer",
             "http://schema.org/Number": "integer",
             "http://schema.org/Float": "decimal"
             }

# Contruction functions

def construction_schema_objects(series):
    result = WOQLQuery().doctype(series.id).\
             label(series.label).\
             description(series.comment)
    if series.id in SIMPLE_TYPE_MAP:
        result = result.property(series.id+"Value", "xsd:"+SIMPLE_TYPE_MAP[series.id])
    return result

def construction_schema_addon(series, type_list):
    result=[]
    if type(series.subTypes) == str:
        for kid in series.subTypes.split(','):
            kid = kid.strip()
            if kid in list(type_list):
                result.append(WOQLQuery().add_quad(kid, "subClassOf", series.id ,"schema"))
    if type(series.subTypeOf) == str:
        for parent in series.subTypeOf.split(','):
            parent = parent.strip()
            if parent in list(type_list):
                result.append(WOQLQuery().add_quad(series.id, "subClassOf", parent ,"schema"))
    return result

def construct_prop_dr(series):
    result=[]
    if (type(series.domainIncludes) == str) and (',' in series.domainIncludes):
        result.append(WOQLQuery().doctype(series.id+"Domain"))
    if (type(series.rangeIncludes) == str) and (',' in series.rangeIncludes):
        result.append(WOQLQuery().doctype(series.id+"Range"))
    return result

def construction_schema_addon_property(series, type_list):
    result=[WOQLQuery().add_quad(series.id,"rdf:type","owl:ObjectProperty","schema")]
    if (type(series.domainIncludes) == str):
        if (',' in series.domainIncludes):
            for domain in  series.domainIncludes.split(','):
                domain = domain.strip()
                if domain in list(type_list):
                    result.append(WOQLQuery().add_quad(domain, "subClassOf", series.id+"Domain", "schema"))
            result.append(WOQLQuery().add_quad(series.id, "domain", series.id+"Domain", "schema"))
        else:
            if series.domainIncludes in list(type_list):
                result.append(WOQLQuery().add_quad(series.id, "domain", series.domainIncludes, "schema"))
    if (type(series.rangeIncludes) == str):
        if (',' in series.rangeIncludes):
            for range in series.rangeIncludes.split(','):
                range = range.strip()
                if range in list(type_list):
                    result.append(WOQLQuery().add_quad(range, "subClassOf", series.id+"Range", "schema"))
            result.append(WOQLQuery().add_quad(series.id, "range", series.id+"Range", "schema"))
        else:
            if series.rangeIncludes in list(type_list):
                result.append(WOQLQuery().add_quad(series.id, "range", series.rangeIncludes, "schema"))
    if len(result) < 3:
        return []
    return result

# Excution funstions

def create_schema_objects(client, queries):
    result_query = WOQLQuery().when(True).woql_and(*queries)
    return result_query.execute(client)

def create_schema_add_ons(client, queries):
    new_queries = []
    for query_list in queries:
        if len(query_list) > 1:
            new_queries.append(WOQLQuery().woql_and(*query_list))
        elif len(query_list) == 1:
            new_queries.append(query_list[0])
    result_query = WOQLQuery().when(True).woql_and(*new_queries)
    return result_query.execute(client)



types = pd.read_csv("all-layers-types.csv")
types["QueryObjects"] = types.apply(construction_schema_objects, axis=1)
types["QueryAddOnObj"] = types.apply(construction_schema_addon, axis=1, type_list=types["QueryObjects"])

propteries = pd.read_csv("all-layers-properties.csv")
propteries["QueryObjects"] = propteries.apply(construction_schema_objects, axis=1)
propteries["QueryObjects_DR"] = propteries.apply(construct_prop_dr, axis=1)
propteries["QueryAddOnObj"] = propteries.apply(construction_schema_addon_property, axis=1, type_list=types["QueryObjects"])

client = WOQLClient()
client.connect(server_url, key)
client.deleteDatabase(db_id)
client.createDatabase(db_id, "Schema.org")

# crete schema for types
create_schema_objects(client, list(types["QueryObjects"]))
# crete schema add on for types
create_schema_add_ons(client, list(types["QueryAddOnObj"]))
# crete schema for properties
create_schema_objects(client, list(propteries["QueryObjects"]))
# create schema for DR objects
create_schema_add_ons(client, list(propteries["QueryObjects_DR"]))
# crete schema add on for properties
create_schema_add_ons(client, list(propteries["QueryAddOnObj"]))
