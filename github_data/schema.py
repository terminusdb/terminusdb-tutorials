####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####
from typing import Optional

from terminusdb_client.woqlschema import DocumentTemplate


class User(DocumentTemplate):
    _subdocument = []
    id: Optional[int]


class stargazers(DocumentTemplate):
    _sdc_repository: str
    starred_at: Optional[str]
    user: Optional["User"]
    user_id: Optional[int]
