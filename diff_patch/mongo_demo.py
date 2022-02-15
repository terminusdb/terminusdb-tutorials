import datetime as dt
import os
from pprint import pprint
from terminusdb_client import WOQLClient

from pymongo import MongoClient
import pymongo

# Provide the mongodb atlas url in env variable to connect python to mongodb using pymongo
# Create a connection using MongoClient.

client = MongoClient(os.environ["MONGO_CONNECTION_STRING"])

# Create the database for our example (we will use the same database throughout the tutorial
connection = client['user_shopping_list']

collection_name = connection["user_1_items"]

item_1 = {
"_id" : "U1IT00001",
"item_name" : "Blender",
"max_discount" : "10%",
"batch_number" : "RR450020FRG",
"price" : 340,
"category" : "kitchen appliance"
}

item_2 = {
"_id" : "U1IT00002",
"item_name" : "Egg",
"category" : "food",
"quantity" : 12,
"price" : 36,
"item_description" : "brown country eggs"
}
collection_name.insert_many([item_1,item_2])

expiry_date = '2021-07-13T00:00:00.000'
expiry = dt.datetime.fromisoformat(expiry_date)
item_3 = {
"item_name" : "Bread",
"quantity" : 2,
"ingredients" : "all-purpose flour",
"expiry_date" : expiry
}
collection_name.insert_one(item_3)

# Now I want to change up item 1

new_item_1 = {
"_id" : "U1IT00001",
"item_name" : "Blender",
"max_discount" : "50%",
"batch_number" : "RR450020FRG",
"price" : 450,
"category" : "kitchen appliance"
}

# But before we update it in Mongo, I want to review the changes first

# Create a TerminusX client (see https://dashboard.terminusdb.com/profile)
tbd_endpoint = WOQLClient("http://localhost:6363/")

# Find the item back from database in case someone already changed it
item_1 = collection_name.find_one({"item_name" : "Blender"})
patch = tbd_endpoint.diff(item_1, new_item_1)

pprint(patch.content)

# If we apprive, then proceed
collection_name.update_one(patch.before, {"$set": patch.update})

# Working on more complicated objects

expiry_date = '2021-07-15T00:00:00.000'
expiry = dt.datetime.fromisoformat(expiry_date)
new_item_3 = {
"item_name" : "Bread",
"quantity" : 5,
"ingredients" : "all-purpose flour",
"expiry_date" : expiry
}

item_3 = collection_name.find_one({"item_name" : "Bread"})
item_id = item_3.pop('_id') # We wnat to pop it out and optionally we can add it back
patch = tbd_endpoint.diff(item_3, new_item_3)

pprint(patch.content)

# Add _id back, though it still works without
before = patch.before
before['_id'] = item_id

collection_name.update_one(before, {"$set": patch.update})
