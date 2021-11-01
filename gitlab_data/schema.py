####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####
from terminusdb_client.woqlschema import DocumentTemplate


class gitlab_data(DocumentTemplate):
    author_email: str
    author_name: str
    authored_date: str
    committed_date: str
    committer_email: str
    committer_name: str
    created_at: str
    id: str
    message: str
    short_id: str
    title: str
    web_url: str
