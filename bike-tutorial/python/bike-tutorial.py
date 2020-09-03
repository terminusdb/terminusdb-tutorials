import terminusdb_client as woql
from terminusdb_client import WOQLQuery
from csvs import csvs

import pprint
pp = pprint.PrettyPrinter(indent=4)

def create_schema(client, commit_msg):
    """The query which creates the schema
        Parameters - it uses variables rather than the fluent style as an example
        ==========
        client : a WOQLClient() connection

    """
    station_dt = WOQLQuery().doctype("Station",
                            label="Bike Station",
                            description="A station where bikes are deposited")
    bicycle_dt = WOQLQuery().doctype("Bicycle", label="Bicycle")
    journey_dt = (
            WOQLQuery().doctype("Journey", label="Journey").
            property("start_station", "Station", label="Start Station").
            property("end_station", "Station", label="End Station").
            property("duration", "integer", label="Journey Duration").
            property("start_time", "dateTime", label="Time Started").
            property("end_time", "dateTime", label="Time Ended").
            property("journey_bicycle", "Bicycle", label="Bicycle Used")
            )
    schema = station_dt + bicycle_dt + journey_dt
    return schema.execute(client, commit_msg)


def get_csv_variables(url):
    """Extracting the data from a CSV and binding it to variables
       Parameters
       ==========
       client : a WOQLClient() connection
       url : string, the URL of the CSV
       """
    csv = WOQLQuery().get(
        WOQLQuery().woql_as("Start station", "v:Start_Station").
        woql_as("End station", "v:End_Station").
        woql_as("Start date", "v:Start_Time").
        woql_as("End date", "v:End_Time").
        woql_as("Duration", "v:Duration").
        woql_as("Start station number", "v:Start_ID").
        woql_as("End station number", "v:End_ID").
        woql_as("Bike number", "v:Bike").
        woql_as("Member type", "v:Member_Type")
    ).remote(url)
    return csv


def get_wrangles():
    wrangles = [
        WOQLQuery().idgen("doc:Journey", [
            "v:Start_ID", "v:Start_Time", "v:Bike"], "v:Journey_ID"),
        WOQLQuery().idgen("doc:Station", [
            "v:Start_ID"], "v:Start_Station_URL"),
        WOQLQuery().cast("v:Duration", "xsd:integer", "v:Duration_Cast"),
        WOQLQuery().cast("v:Bike", "xsd:string", "v:Bike_Label"),
        WOQLQuery().cast("v:Start_Time", "xsd:dateTime", "v:Start_Time_Cast"),
        WOQLQuery().cast("v:End_Time", "xsd:dateTime", "v:End_Time_Cast"),
        WOQLQuery().cast("v:Start_Station", "xsd:string", "v:Start_Station_Label"),
        WOQLQuery().cast("v:End_Station", "xsd:string", "v:End_Station_Label"),
        WOQLQuery().idgen("doc:Station", ["v:End_ID"], "v:End_Station_URL"),
        WOQLQuery().idgen("doc:Bicycle", ["v:Bike_Label"], "v:Bike_URL"),
        WOQLQuery().concat("Journey from v:Start_ID to v:End_ID at v:Start_Time", "v:Journey_Label"),
        WOQLQuery().concat("Bike v:Bike from v:Start_Station to v:End_Station at v:Start_Time until v:End_Time",
                           "v:Journey_Description")
    ]
    return wrangles


def get_inserts():
    inserts = WOQLQuery().woql_and(
        WOQLQuery().insert("v:Journey_ID", "Journey",
            label="v:Journey_Label",
            description="v:Journey_Description").
            property("start_time", "v:Start_Time_Cast").
            property("end_time", "v:End_Time_Cast").
            property("duration", "v:Duration_Cast").
            property("start_station", "v:Start_Station_URL").
            property("end_station", "v:End_Station_URL").
            property("journey_bicycle", "v:Bike_URL"),
        WOQLQuery().insert("v:Start_Station_URL", "Station",
            label="v:Start_Station_Label"),
        WOQLQuery().insert("v:End_Station_URL", "Station",
            label="v:End_Station_Label"),
        WOQLQuery().insert("v:Bike_URL", "Bicycle",
            label="v:Bike_Label")
    )
    return inserts


def load_csvs(client, csvlist, wrangl, insert):
    """Load the CSVs as input
       Parameters
       ==========
       client : a WOQLClient() connection
       csvs : a dict of all csvs to be input
    """
    for url in csvlist:
        csv = get_csv_variables(url)
        inputs = WOQLQuery().woql_and(csv, *wrangl)
        answer = WOQLQuery().when(inputs, insert)
        answer.execute(client, f"loading {url} into the graph")


if __name__ == "__main__":
    db_id = "pybike"
    client = woql.WOQLClient(server_url = "https://127.0.0.1:6364", insecure=True)
    client.connect(key="root", account="admin", user="admin")
    existing = client.get_database(db_id, client.uid())
    if not existing:
        client.create_database(db_id, accountid="admin", label = "Bike Graph", description = "Create a graph with bike data")
    else:
        client.db(db_id)
    create_schema(client, "Creating bike schema")
    load_csvs(client, csvs, get_wrangles(), get_inserts())
