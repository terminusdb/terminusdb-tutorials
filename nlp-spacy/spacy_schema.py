from terminusdb_client import WOQLClient, WOQLQuery

def build_schema(client):
    spacy_doc = WOQLQuery().doctype("SpaCyDoc", label="SpaCy Document", description="The Document object in SpaCy")
    token_dt = (WOQLQuery().doctype("SpaCyToken", label="SpaCy Tokens")
                .property("lemma", "string")
                .property("pos", "string")
                .property("tag", "string")
                .property("dep", "string")
                .property("shape", "string")
                .property("is_alpha", "boolean")
                .property("is_stop", "boolean")
                .property("head", "SpaCyToken")
                .property("doc", "SpaCyDoc")
               )
    schema = spacy_doc + token_dt
    return schema.execute(client, "Create a schema for SpaCy Tokens")

if __name__ == "__main__":
    db_id = "nlp_spacy"
    client = WOQLClient(server_url = "https://127.0.0.1:6363")
    client.connect(key="root", account="admin", user="admin")
    existing = client.get_metadata(db_id, client.uid())
    if not existing:
        client.create_database(db_id, accountid="admin", label = "Spacy Tokens", description = "Storing tokenization result form SpaCy")
    else:
        client.delete_database(db_id) # delete the original database if the sechema is updated
        client.create_database(db_id, accountid="admin", label = "Spacy Tokens", description = "Storing tokenization result form SpaCy")
        #client.db(db_id)
    build_schema(client)