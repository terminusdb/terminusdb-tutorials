/**
 * This is a tutorial script for TerminusDB which demonstrates
 * the creation of a database from CSV files representing information about bicycle trips
 * on an urban program in Washington DC
 */
const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();


/**
 * The list of CSV files that we want to import
 */
const csvs = {
    OverallSimilarity: "https://terminusdb.com/t/data/council/weighted_similarity.csv"    
};

/**
 * 
 * @param {WOQLClient} client 
 * @param {String} id 
 * @param {String} title 
 * @param {String} description 
 */
function createDatabase(client, id, title, description){
    title = title || "Council Voting Data";
    description = description || "A Database for the Terminus Politics Tutorial";
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
 * The query which creates the schema - alternative syntax - 733 chars
 * @param {WOQLClient} client
 */
function createSchema(client){
    var schema = WOQL.when(true).and(
        WOQL.doctype("Party")
            .label("Party")
            .description("Political Party"),
        WOQL.doctype("Representative")
            .label("Representative")
            .description("An elected member of the US congress")
            .property("member_of", "Party")
                .label("Member of").cardinality(1),
        WOQL.doctype("Similarity")
            .label("Similarity")
            .property("similarity", "decimal")
                .label("Similarity")
            .property("similar_to", "Representative")
                .label("Similar To").cardinality(2)
   );
   return schema.execute(client);
}       

function getInserts(relation){
    const inserts = WOQL.and(
        WOQL.insert("v:Party_A_ID", "Party")
            .label("v:Party_A"),
        WOQL.insert("v:Party_B_ID", "Party")
            .label("v:Party_B"),
        WOQL.insert("v:Rep_A_ID", "Representative")
            .label("v:Rep_A")
            .property("member_of", "v:Party_A_ID"),
        WOQL.insert("v:Rep_B_ID", "Representative")
            .label("v:Rep_B")
            .property("member_of", "v:Party_B_ID"),
        WOQL.insert("v:Rel_ID", "Similarity")
            .label("v:Rel_Label")
            .property("similar_to", "v:Rep_A_ID")
            .property("similar_to", "v:Rep_B_ID")
            .property("similarity", "v:Similarity")
    );
    return inserts;
}

/**
 * 
 * @param {WOQLClient} client 
 * @param {[String]} arr - array of URLs to load CSVs from 
 */
function loadCSVs(client, queue, obj){
    if(typeof resp == "undefined") resp = false;
    if(relation = queue.pop()){
        const url = obj[relation];
        const csv = getCSVVariables(url);
        console.log("loading relation", relation, url);
        const wrangles = getWrangles(relation);
        const inputs = WOQL.and(csv, ...wrangles); 
        const inserts = getInserts(relation);
        var answer = WOQL.when(inputs, inserts);
        resp = answer.execute(client)
        .then(() => loadCSVs(client, queue, obj))
        .catch(() => {console.log("failed to load csv", relation, url); loadCSVs(client, queue, obj)});
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
        WOQL.as("councillor_a","v:Rep_A")
        .as("councillor_b", "v:Rep_B")
        .as("party_a", "v:Party_A")
        .as("party_b", "v:Party_B")
        .as("distance", "v:Distance")
    ).remote(url);
    return csv;
}

function getWrangles(relation){
    const wrangles = [
         WOQL.idgen("doc:Party", ["v:Party_A"], "v:Party_A_ID"),
         WOQL.idgen("doc:Party", ["v:Party_B"], "v:Party_B_ID"),
         WOQL.idgen("doc:Representative", ["v:Rep_A"], "v:Rep_A_ID"),
         WOQL.idgen("doc:Representative", ["v:Rep_B"], "v:Rep_B_ID"),
         WOQL.typecast("v:Distance", "xsd:decimal", "v:Similarity"),
         WOQL.idgen("doc:Similarity", ["v:Rep_A", "v:Rep_B"], "v:Rel_ID"),
         WOQL.concat("v:Rep_A similarity v:Distance to v:Rep_B", "v:Rel_Label")
     ];
     return wrangles;
}
 
function getView(url, key, dbid){
    var client = new TerminusClient.WOQLClient();
    client.connect(url, key).then(() => {
        client.connectionConfig.dbid = dbid;
        showView(client);
    });
}

function showView(client){
    const WOQL = TerminusClient.WOQL;
    const View = TerminusClient.View;
    var woql = WOQL.limit(1000).and(
        WOQL.triple("v:Subject","similar_to","v:Value"),
        WOQL.triple("v:Subject","similar_to","v:Value2"),
        WOQL.triple("v:Subject","similarity","v:Similarity"),
        WOQL.triple("v:Value","member_of","v:Party"),
        WOQL.triple("v:Value2","member_of","v:Party2"),
        WOQL.not().eq("v:Value","v:Value2"),
        WOQL.opt().triple("v:Value2","label","v:Lab2"),
        WOQL.opt().triple("v:Value","label","v:Lab1"),
        WOQL.eval(WOQL.divide(1,WOQL.exp("v:Similarity",4)),"v:Distance")
    );
    const view = View.graph();
    view.node("v:Subject", "v:Lab2", "v:Lab1", "v:Party2", "v:Party", "v:Similarity", "v:Distance").hidden(true)
    view.node("v:Similarity").hidden(true)
    view.edge("v:Value", "v:Value2").distance("v:Distance").text("v:Distance").weight(0.04)
    view.node("v:Value").text("v:Lab1").icon({ label: true})
    view.node("v:Value2").text("v:Lab2").icon({ label: true})
    view.node("v:Value", "v:Value2").charge(-4999).collisionRadius(30)
    view.node("v:Value").v("v:Party").in("doc:PartySolidarity").color([5, 25, 22])
    view.node("v:Value2").v("v:Party2").in("doc:PartySolidarity").color([5, 25, 22])
    view.node("v:Value").v("v:Party").in("doc:PartySocial%20Democrats").color([25, 25, 225])
    view.node("v:Value2").v("v:Party2").in("doc:PartySocial%20Democrats").color([25, 25, 225])
    view.node("v:Value").v("v:Party").in("doc:PartySinn%20F%C3%A9in").color([25, 225, 25])
    view.node("v:Value2").v("v:Party2").in("doc:PartySinn%20F%C3%A9in").color([25, 225, 25])
    view.node("v:Value").v("v:Party").in("doc:PartyLabour%20Party").color([255, 0, 0])
    view.node("v:Value2").v("v:Party2").in("doc:PartyLabour%20Party").color([255, 0, 0])
    view.node("v:Value2").v("v:Party2").in("doc:PartyFine%20Gael").color([0, 0, 255])
    view.node("v:Value").v("v:Party").in("doc:PartyFine%20Gael").color([0, 0, 255])
    view.node("v:Value").v("v:Party").in("doc:PartyFianna%20F%C3%A1il").color([100, 200, 100])
    view.node("v:Value2").v("v:Party2").in("doc:PartyFianna%20F%C3%A1il").color([100, 200, 100])
    view.node("v:Value").v("v:Party").in("doc:PartyGreen%20Party").color([25, 225, 125])
    view.node("v:Value2").v("v:Party2").in("doc:PartyGreen%20Party").color([225, 225, 125])
    view.node("v:Value").v("v:Party").in("doc:PartyIndependent").color([25, 25, 25])
    view.node("v:Value2").v("v:Party2").in("doc:PartyIndependent").color([25, 25, 25])
    view.node("v:Value").v("v:Party").in("doc:PartyPeople%20Before%20Profit").color([225, 25, 25])
    view.node("v:Value2").v("v:Party2").in("doc:PartyPeople%20Before%20Profit").color([225, 25, 25])
    view.node("v:Value").v("v:Party").in("doc:PartyWorkers'%20Party").color([225, 225, 225])
    view.node("v:Value2").v("v:Party2").in("doc:PartyWorkers'%20Party").color([225, 225, 225])
    var tv = new TerminusDashboard.TerminusViewer(client);
    const res = tv.getResult(woql, view);
    document.getElementById('target').appendChild(res.getAsDOM());
    res.load();
}



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
            .then(() => loadCSVs(client, Object.keys(csvs), csvs))
            .then(() => showView(client));
        })         
    }).catch((error) => console.log(error));
}

