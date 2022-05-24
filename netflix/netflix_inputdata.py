from terminusdb_client import WOQLClient

import pandas as pd
from tqdm import tqdm
import tempfile
import random

from schema import Content, User

def insert_content_data(client, url):
    df = pd.read_csv(url, chunksize=1000)
    for chunk in tqdm(df, desc='Transfering data'):
        csv = tempfile.NamedTemporaryFile()
        chunk.to_csv(csv)
        netflix_content = read_data(csv.name)
        client.insert_document(netflix_content, commit_msg="Adding all Netflix content")

# We will generate and insert random 50 users using following function
def insert_user_data(contents):
    users = []
    for i in range(0,50):
        randomlist = random.sample(range(1, 50), i%10)
        watched_contents = set()
        for index in randomlist:
            watched_contents.add(schema.import_objects(contents[index]))

        users.append(User(id=str(i), watched_contents = watched_contents))

    client.insert_document(users, commit_msg="Adding users")

def read_data(csv):
    records = []
    df = pd.read_csv(csv)
    for index, row in df.iterrows():

        type_of = row['type'].replace(" ", "_")
        rating = "NR" if pd.isna(row['rating']) else row['rating'].replace("-", "_")

        records.append(Content(title=row['title'], type_of=Content_Type[type_of], director=str(row['director']), cast=str(row['cast']), country=str(row['country']), release_year=row['release_year'], rating=Rating[rating], duration=row['duration'], listed_in=row['listed_in'], description=row['description'], date_added=str(row['date_added'])))

    return records

def query_documents(client):
    documents = client.get_all_documents()

    # documents comes back as a iterable that can be convert into a list
    print("\nAll documents\n")
    print(list(documents))

    matches = client.query_document({"@type"  : "Content",
                                 "type_of": "Movie",
                                 "release_year": "2020"})

    # matches comes back as a iterable that can be convert into a list
    print("\nDocuments matches\n")
    print(list(matches))

    # If you want to get a specific number of records, just add count=number when calling both functions:
    documents = client.get_all_documents(count=5)
    matches = client.query_document({"@type"  : "Content",
                                    "type_of": "Movie",
                                    "release_year": "2020"}, count=5)

def branches(client):
    #You can create a new branch by calling the create_branch method
    client.create_branch("some_branch", empty=False)

    # When empty is set to False, a new branch will be created,
    # containing the schema and data inserted into the database previously.
    # If set to True, an empty branch will be created.
    client.create_branch("some_branch1", empty=True)

    # You can delete a branch by calling the delete and passing the name of the branch as parameter.
    client.delete_branch("some_branch")

    # You can switch to a different branch by setting the branch variable
    client.branch = "some_branch1"

    # List all branches
    branches = client.get_all_branches()

    print(branches)

def time_travel(client):
    # Reset the current branch HEAD to the specified commit path.
    # more info: https://terminusdb.github.io/terminusdb-client-python/woqlClient.html#terminusdb_client.WOQLClient.reset
    # eg:
    # client.reset('hvatquoq9531k1u223v4azcdr1bfyde')

    # Squash the current branch HEAD into a commit
    # more info: https://terminusdb.github.io/terminusdb-client-python/woqlClient.html#terminusdb_client.WOQLClient.squash
    commit_res = client.squash('This is a squash commit message!',"username")
    # reset to the squash commit
    client.reset(commit_res, use_path=True)

    # Rebase the current branch onto the specified remote branch
    # more info: https://terminusdb.github.io/terminusdb-client-python/woqlClient.html#terminusdb_client.WOQLClient.rebase
    client.rebase("main")


if __name__ == "__main__":
    db_id = "Netflix"
    url = "netflix.csv"

    client = WOQLClient("http://127.0.0.1:6363/")
    client.connect(db=db_id)

    insert_content_data(client, url)

    contents = client.query_document({"@type"  : "Content"}, count=50)

    insert_user_data(list(contents))

    print("\nQUERING DOCUMENTS\n")
    query_documents(client)

    print("\nBranches\n")
    branches(client)

    # Get the whole commit history:
    commit_history = client.get_commit_history()
    print("\nCOMMIT HISTORY\n",commit_history)

    # Manipulate the commit history
    print("\nTime Travel\n")
    time_travel(client)
