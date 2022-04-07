####
# This is the script for storing the schema of your TerminusDB
# database for your project.
# Use 'terminusdb commit' to commit changes to the database and
# use 'terminusdb sync' to change this file according to
# the exsisting database schema
####
"""
Title: Netflix
Description: Example to show how to use Netflix data
Authors: TerminusDB team
"""
from typing import List, Optional, Set

from terminusdb_client.woqlschema import (
    DocumentTemplate,
    EnumTemplate,
    LexicalKey,
)

class Content(DocumentTemplate):
    title: str
    type_of: "Content_Type"
    director: Optional[str]
    cast: Optional[str]
    country_of_origin: Optional[str]
    release_year: int
    rating: "Rating"
    duration: str
    listed_in: str
    description: str
    date_added: Optional[str]

class User(DocumentTemplate):
    _key = LexicalKey(keys="id")
    _base = "User"
    id : str
    watched_contents: Set["Content"]

class Content_Type(EnumTemplate):
    TV_Show = "TV Show"
    Movie = "Movie"

class Rating(EnumTemplate):
    TV_MA = "TV-MA"
    R = ()
    PG_13 = "PG-13"
    TV_14 = "TV-14"
    TV_PG = "TV-PG"
    NR = ()
    TV_G = "TV-G"
    TV_Y = "TV-Y"
    TV_Y7 = "TV-Y7"
    TY = ()
    TY_7 = "TY-7"
    PG = ()
    G = ()
    NC_17 = "NC-17"
    TV_Y7_FV = "TV-Y7-FV"
    UR = ()
