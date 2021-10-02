#!/usr/bin/env python3

from terminusdb_client import WOQLClient
import json
import ast
import urllib
import sys
import os

def code_to_json(code):
    result = ast.parse(code)
    return ast_to_json(result)

def json_to_code(json):
    result = json_to_ast(json)
    return ast.unparse(result)

def ast_to_json(tree):
    if tree == None:
        return None
    elif isinstance(tree, list):
        res = []
        for tr in tree:
            res.append(ast_to_json(tr))
        return res
    elif isinstance(tree, str):
        return { '@type' : 'Value',
                 'string' : tree }
    elif isinstance(tree, int):
        return { '@type' : 'Value',
                 'integer' : tree }
    elif isinstance(tree, bool):
        return { '@type' : 'Value',
                 'boolean' : tree }
    elif isinstance(tree, float):
        return { '@type' : 'Value',
                 'float' : tree }
    else:
        cls = tree.__class__.__name__
        if cls in ['Load', 'Store', 'Del']:
            return cls
        obj = {'@type' : cls}
        for field in tree._fields:
            obj[field] = ast_to_json(getattr(tree,field))
        return obj

def json_to_ast(tree):
    """We need to do the inverse of above"""
    pass

def import_schema(client):
    with open('python-schema.json', 'r') as f:
        python_schema = json.load(f)
    results = client.insert_document(python_schema,
                                     graph_type="schema",
                                     full_replace="true")
    print(f"Added Classes: {results}")

def import_program(client, code):
    result = ast.parse(code)
    #print(ast.dump(result, indent=4))
    js = code_to_json(result)
    #print(json.dumps(js, indent=4))
    results = client.insert_document(js)
    print(f"Added Program: {results}")

if __name__ == "__main__":
    dbid = "python-ast"
    label = "python-ast"
    description = "AST schema for python"
    base = 'iri://terminusdb.com/python/'
    schema = 'iri://terminusdb.com/python#'
    prefixes = {'@base' : base,
                '@schema' : schema }

    team = os.environ['TERMINUSDB_TEAM']
    team_quoted = urllib.parse.quote(team)
    client = WOQLClient(f"https://cloud.terminusdb.com/{team_quoted}/")
    # make sure you have put the token in environment variable
    # https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
    client.connect(team=team, use_token=True)

    exists = client.get_database(dbid)
    if True or not exists:
        print(f"Recreating {dbid}")
        client.delete_database(dbid, team=team, force=True)
        client.create_database(dbid,
                           team,
                           label=label,
                           description=description,
                           prefixes=prefixes)
        import_schema(client)
    else:
        print(f"Connecting to {dbid}")
        client.connect(db=dbid,team=team,use_token=True)

    with open('hello-world.py', 'r') as f:
        hello_world = f.read()

    import_program(client,hello_world)
    modules = client.query_document({'@type' : 'Module'})
    print(json.dumps(modules, indent=4))
