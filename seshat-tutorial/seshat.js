const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQL = TerminusClient.WOQL;

function loadData(client){
    return importRDFData(client)
    .then(() => importShapefileCSVs(client)
    .then(() => importIronCSV(client)));
}       

function importRDFData(client) {
    var mgurl = "https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl";
    var agurl = "https://terminusdb.com/t/data/seshat/seshat_notes_export_graph.ttl";
    return importRDFData(client, mgurl).then(() => importRDFAnnotations(client, agurl));
}

function loadCSVs(client, queue){
    if(typeof resp == "undefined") resp = false;
    if(url = queue.pop()){
        resp = loadShapefileCSV(client, url).then( () => loadCSVs(client, queue))
    }
    if(resp) return resp;
}

function importShapefileCSVs(client){
    var files = [
        "https://terminusdb.com/t/data/seshat/csvs/0CE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/200AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/300AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/400AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/500AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/600AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/700AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/800AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/900AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1000AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1100AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1200AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1200BCE.gpkg.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1300AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1400AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1500AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1600AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1700AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1800AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1900AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3900BCE.csv",        
        "https://terminusdb.com/t/data/seshat/csvs/4000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/5000BCE.csv"
    ];
    return loadCSVs(client, files);   
}

function importIronCSV(client){
    let url = "http://seshatdatabank.info/wp-content/uploads/2020/01/Iron-Updated.csv";
    return extendSeshatSchema(client).then(() => importSeshatCSV(client, url));
}

function normaliseID(raw, type){
    if(type == "id"){
        var bits = raw.split(":");
        return (bits.length > 1 ? raw : "scm:" + raw);
    }
    if(type == "type"){
        var bits = raw.split(":");
        if(bits.length > 1) {
            var nr = bits[1];
            return "scm:" + nr.charAt(0).toUpperCase() + nr.slice(1)  
        }
        else {
            return "scm:" +  raw.charAt(0).toUpperCase() + raw.slice(1);
        }
    }
    if(type == "parents"){
        var npars = [];
        if(Array.isArray(raw) && raw.length){
            for(var i = 0 ; i<raw.length; i++){
                var nr = raw[i].split(":");
                if(nr.length > 1) npars.push(nr);
                else {
                    npars.push("scm:" + nr);
                }
            }
        }
        return npars;
    }
    return raw;
}

function createSeshatProperty(npid, nptype, parents, label, description, domain){
    domain = domain || "scm:PoliticalAuthority";
    parents = normaliseID(parents, "parents");
    parents.push("scm:ScopedValue");
    npid = normaliseID(npid, "id");
    nptype = normaliseID(nptype, "type");
    parents.push(nptype);
    let newclass = npid + "_Value";
    return WOQL.and(
        WOQL.add_class(newclass)
            .label(label)
            .description(description)
            .parent(...parents),
        WOQL.add_property(npid, newclass)
            .label(label)
            .description(description)
            .domain(domain)
    );
}

function generateBoxClasses(){
    const filter = WOQL.and(
        WOQL.quad("v:Cid", "rdf:type", "owl:Class", "db:schema"),
        WOQL.not().eq("v:Cid", "tcs:Enumerated"),
        WOQL.sub("v:Cid", "tcs:Enumerated"),
        WOQL.quad("v:Cid", "rdfs:label", "v:ClassLabel", "db:schema"),
        WOQL.quad("v:Cid", "rdfs:comment", "v:Desc", "db:schema"),
        WOQL.re(".*#(.)(.*)", "v:Cid", ["v:All", "v:First", "v:Rest"]),
        WOQL.lower("v:First", "v:Lower"),
        WOQL.concat(["v:Lower","v:Rest"], "v:Propname"),
        WOQL.concat([{"@value":"Scoped", "@type": "xsd:string"}, "v:First", "v:Rest"], "v:Cname"),
        WOQL.idgen("scm:", ["v:Cname"], "v:ClassID"),
        WOQL.idgen("scm:", ["v:Propname"], "v:PropID")
    )

    return WOQL.when(filter, WOQL.and(
        WOQL.add_class("v:ClassID")
                .label("v:ClassLabel")
                .description("v:Desc"),
        WOQL.add_property("v:PropID", "v:Cid")
            .label("v:ClassLabel")
            .description("v:Desc")
		    .domain("v:ClassID")
    ));
}


/**
 * 
 * @param {WOQLClient} client 
 * @param {String} id 
 * @param {String} title 
 * @param {String} description 
 */
function createDatabase(client, id, title, description){
    title = title || "Seshat Global History Databank";
    description = description || "Seshat global history databank";
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

/**
 * The query which creates the schema - alternative syntax - 733 chars
 * @param {WOQLClient} client
 */
function createSchema(client){
    return loadLibraries(client).then(() => {
        //return WOQL.and(generateBoxClasses(), createClasses(), createProperties()).execute(client);
        return generateBoxClasses().execute(client).then(() => {
            return createClasses().execute(client).then(() => {
                return createProperties().execute(client).then(() => {
                    alert("all done");
                })
            })    
        })
    });
}       

function loadLibraries(client){
    let owl = "@prefix scm: <" + client.connectionConfig.schemaURL(); "#> .\n";
    owl += "@prefix doc: <" + client.connectionConfig.docURL() + "> .\n";
    return fetch("libs.owl").then(response => {
        owl += response.text(); 
        alert(owl);
        return fetch("choices.owl").then(resp2 => {
            owl += resp2.text(); 
            return fetch("boxes.owl").then(resp3 => {
                owl += resp3.text(); 
                return client.updateSchema(false, owl, {"terminus:encoding": "terminus:turtle"});
            }) 
        })
    })
}

function runSegment(terminus_server_url, terminus_server_key){
    var client = new TerminusClient.WOQLClient();
    client.connect(terminus_server_url, terminus_server_key, "seshat")
    .then(() => {
        return createProperties().execute(client);
        //createSchema(client)
    });
}

function runTutorial(terminus_server_url, terminus_server_key){
    var client = new TerminusClient.WOQLClient();
    client.connect(terminus_server_url, terminus_server_key)
    .then(() => {
        createDatabase(client, "seshat")
        .then(() => {
            createSchema(client)
            .then(() => loadData(client, Object.keys(csvs), csvs))
        })         
    }).catch((error) => console.log(error));
}
