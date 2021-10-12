#!/usr/bin/env python3

from terminusdb_client import WOQLClient
import json
import ast
import astunparse
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
        elif cls == 'Constant':
            const_obj = { '@type' : 'Constant',
                           'kind' : tree.kind }
            if tree.value == None:
                const_obj['value'] = { '@type' : 'Value',
                                       'none' : [] }
            else:
                const_obj['value'] = ast_to_json(tree.value)
            return const_obj
        else:
            obj = {'@type' : cls}
            for field in tree._fields:
                obj[field] = ast_to_json(getattr(tree,field))
            return obj

def json_to_ast(tree):
    if isinstance(tree, dict):
        ty = tree['@type']
        if ty == 'Value':
            # print(tree)
            if 'none' in tree:
                return None
            elif 'integer' in tree:
                return tree['integer']
            elif 'boolean' in tree:
                return tree['boolean']
            elif 'float' in tree:
                return tree['float']
            elif 'string' in tree:
                return tree['string']
            else:
                # Dubious!
                return None
        else:
            Cls = getattr(ast, ty)
            obj = Cls()
            for field in tree.keys():
                if field in ['@id', '@type']:
                    pass
                else:
                    setattr(obj, field, json_to_ast(tree[field]))

            return obj
    elif isinstance(tree, list):
        asts = []
        for elt in tree:
            asts.append(json_to_ast(elt))
        asts.reverse()
        return asts

def import_schema(client):
    with open('python-schema.json', 'r') as f:
        python_schema = json.load(f)
    results = client.insert_document(python_schema,
                                     graph_type="schema")
    print(f"Added Classes: {results}")

def import_program(client, code):
    result = ast.parse(code)
    #print(ast.dump(result, indent=4))
    js = code_to_json(result)
    #print("-----------------------------------")
    #print(json.dumps(js, indent=4))
    #print("-----------------------------------")
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

    # team = os.environ['TERMINUSDB_TEAM']
    team = "admin"
    team_quoted = urllib.parse.quote(team)
    client = WOQLClient('http://localhost:6363')
    #    client = WOQLClient(f"https://cloud.terminusdb.com/{team_quoted}/")
    # make sure you have put the token in environment variable
    # https://docs.terminusdb.com/beta/#/terminusx/get-your-api-key
    client.connect(team=team) # , use_token=True)

    exists = client.get_database(dbid)

    if exists:
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
        client.create_database(dbid,
                               team,
                               label=label,
                               description=description,
                               prefixes=prefixes)
        import_schema(client)
        client.connect(db=dbid) # ,team=team) # ,use_token=True)

    with open('hello-world.py', 'r') as f:
        hello_world = f.read()

    import_program(client,hello_world)
    [my_module] = list(client.query_document({'@type' : 'Module'}))
    res = json_to_ast(my_module)
    print(astunparse.unparse(res))
