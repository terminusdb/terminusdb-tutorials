####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####

from typing import Optional

from terminusdb_client.woqlschema import DocumentTemplate


class eu_daily(DocumentTemplate):
    __sdc_row_number: Optional[int]
    cases: Optional[float]
    cases_100k_pop: Optional[float]
    cases_lower: Optional[int]
    cases_upper: Optional[int]
    country: Optional[str]
    date: Optional[str]
    datetime: datetime
    deaths: Optional[float]
    git_file_name: Optional[str]
    git_html_url: Optional[str]
    git_last_modified: datetime
    git_owner: Optional[str]
    git_path: Optional[str]
    git_repository: Optional[str]
    git_sha: Optional[str]
    git_url: Optional[str]
    hospitalized: Optional[float]
    intensive_care: Optional[int]
    lau: Optional[str]
    nuts_1: Optional[str]
    nuts_2: Optional[str]
    nuts_3: Optional[str]
    percent: Optional[float]
    population: Optional[float]
    quarantine: Optional[int]
    recovered: Optional[int]
    tests: Optional[int]
