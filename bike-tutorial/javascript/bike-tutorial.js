/**
 * This is a tutorial script for TerminusDB which demonstrates
 * the creation of a database from CSV files representing information about bicycle trips
 * on an urban program in Washington DC
 */


/**
 * The list of CSV files that we want to import
 */
const csvs = [
    "https://terminusdb.com/t/data/bikeshare/2011-capitalbikeshare-tripdata.csv",            
    "https://terminusdb.com/t/data/bikeshare/2012Q1-capitalbikeshare-tripdata.csv",        
    "https://terminusdb.com/t/data/bikeshare/2010-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2012Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2012Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2012Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2013Q1-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2013Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2013Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2013Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2014Q1-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2014Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2014Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2014Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2015Q1-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2015Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2015Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2015Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2016Q1-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2016Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2016Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2016Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2017Q1-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2017Q2-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2017Q3-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/2017Q4-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201801_capitalbikeshare_tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201802-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201803-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201804-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201805-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201806-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201807-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201808-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201809-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201810-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201811-capitalbikeshare-tripdata.csv",
    "https://terminusdb.com/t/data/bikeshare/201812-capitalbikeshare-tripdata.csv"
];

/**
 * 
 * @param {WOQLClient} client 
 * @param {String} id 
 * @param {String} title 
 * @param {String} description 
 */
function createDatabase(client, id, title, description){
    title = title || "Bike Data";
    description = description || "A Database for the Terminus Bikes Tutorial";
    const dbdetails = {
        "@context" : {
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            terminus: "http://terminusdb.com/schema/terminus#"
        },
        "@type": "terminus:Database",
        'rdfs:label' : { "@language":  "en", "@value": title },
        'rdfs:comment': { "@language":  "en", "@value": description},
        'terminus:allow_origin': { "@type" : "xsd:string", "@value" : "*" }
    };
    return client.createDatabase(id, dbdetails);
}

//shorthand so we don't have to type TerminusClient every time
var WOQL = TerminusClient.WOQL;


/**
 * The query which creates the schema
 * @param client WOQLClient
 */
function createSchema(client){
    var schema = WOQL.when(true).and(
        WOQL.addClass("Station").label("Bike Station").description("A station where municipal bicycles are deposited").entity(),
        WOQL.addClass("Journey").label("Journey").entity(),
        WOQL.addClass("Bicycle").label("Bicycle").entity(),
        WOQL.addProperty("start_station", "Station").label("Start Station").domain("Journey"),
        WOQL.addProperty("end_station", "Station").label("End Station").domain("Journey"),
        WOQL.addProperty("duration", "integer").label("Journey Duration").domain("Journey"),
        WOQL.addProperty("start_time", "dateTime").label("Time Started").domain("Journey"),
        WOQL.addProperty("end_time", "dateTime").label("Time Ended").domain("Journey"),
        WOQL.addProperty("journey_bicycle", "Bicycle").label("Bicycle Used").domain("Journey")
   );
   return schema.execute(client);
}        

/**
 * 
 * @param {WOQLClient} client 
 * @param {[String]} arr - array of URLs to load CSVs from 
 */
function loadCSVs(client, arr){
    if(typeof resp == "undefined") resp = false;
    if(next = arr.pop()){
        const csv = getCSVVariables(next);
        const inputs = WOQL.and(csv, ...wrangles); 
        var answer = WOQL.when(inputs, inserts);
        resp = answer.execute(client)
        .then(() => loadCSVs(client, arr))
        .catch(() => console.log("failed with " + url));
    }
    if(resp) return resp;
}

/**
 * Extracting the data from a CSV and binding it to variables
 * @param {WOQLClient} client 
 * @param {String} url - the URL of the CSV 
 */
function getCSVVariables(url){
    const csv = WOQL.get(
        WOQL.as("Start station","v:Start_Station")
        .as("End station", "v:End_Station")
        .as("Start date", "v:Start_Time")
        .as("End date", "v:End_Time")
        .as("Duration", "v:Duration")
        .as("Start station number", "v:Start_ID")
        .as("End station number", "v:End_ID")
        .as("Bike number", "v:Bike")
        .as("Member type", "v:Member_Type")
    ).remote(url);
    return csv;
}

/**
 * Wrangling the imported data to make it line up nicely
 */
const wrangles = [
    WOQL.idgen("doc:Journey",["v:Start_ID","v:Start_Time","v:Bike"],"v:Journey_ID"),
    WOQL.idgen("doc:Station",["v:Start_ID"],"v:Start_Station_URL"),
    WOQL.idgen("doc:Bicycle",["v:Bike"],"v:Bike_URL"),
    WOQL.typecast("v:Duration", "xsd:integer", "v:Duration_Cast"),
    WOQL.typecast("v:Start_Time", "xsd:dateTime", "v:Start_Time_Cast"),
    WOQL.typecast("v:End_Time", "xsd:dateTime", "v:End_Time_Cast"),
    WOQL.idgen("doc:Station",["v:End_ID"],"v:End_Station_URL"),
    WOQL.concat("Bike v:Bike start at v:Start_Station at v:Start_Time","v:Journey_Label")
];

/**
 * The data to be inserted
 */
const inserts = WOQL.and(
    WOQL.add_triple("v:Journey_ID", "type", "scm:Journey"),
    WOQL.add_triple("v:Journey_ID", "start_time", "v:Start_Time_Cast"),
    WOQL.add_triple("v:Journey_ID", "end_time", "v:End_Time_Cast"),
    WOQL.add_triple("v:Journey_ID", "duration", "v:Duration_Cast"),
    WOQL.add_triple("v:Journey_ID", "start_station", "v:Start_Station_URL"),
    WOQL.add_triple("v:Journey_ID", "end_station", "v:End_Station_URL"),
    WOQL.add_triple("v:Journey_ID", "label", "v:Journey_Label"),
    WOQL.add_triple("v:Journey_ID", "journey_bicycle", "v:Bike_URL"),
    WOQL.add_triple("v:Start_Station_URL", "label", "v:Start_Station"),
    WOQL.add_triple("v:Start_Station_URL", "type", "scm:Station"),
    WOQL.add_triple("v:End_Station_URL", "type", "scm:Station"),
    WOQL.add_triple("v:End_Station_URL", "label", "v:End_Station"),
    WOQL.add_triple("v:Bike_URL", "type", "scm:Bicycle"),
    WOQL.add_triple("v:Bike_URL", "label", "v:Bike")
);

/**
 * Runs the tutorial from start to finish
 * @param {String} terminus_server_url - url of the TerminusDB server
 * @param {String} terminus_server_key - key for access to the server
 * @param {String} terminus_db_id - id of the DB to be created in the tutorial
 */
function runTutorial(terminus_server_url, terminus_server_key, terminus_db_id){
    var client = new TerminusClient.WOQLClient();
    client.connect(terminus_server_url, terminus_server_key)
    .then(() => {
        createDatabase(client, terminus_db_id)
        .then(() => {
            createSchema(client)
            .then(() => loadCSVs(client, csvs));            
        })         
    }).catch((error) => console.log(error));
}

