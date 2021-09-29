####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####

from typing import Optional

from terminusdb_client.woqlschema import DocumentTemplate


class Grades(DocumentTemplate):
    final: Optional[float]
    first_name: Optional[str]
    grade: Optional[str]
    last_name: Optional[str]
    ssn: Optional[str]
    test1: Optional[float]
    test2: Optional[float]
    test3: Optional[float]
    test4: Optional[float]
