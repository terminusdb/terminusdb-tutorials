const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQLclient = new TerminusClient.WOQLClient();
const WOQL = TerminusClient.WOQL;
let seshat = {};
seshat.tutorialdb = "seshat";

loadAllData = function(){
    return seshat.importRDFData()
    .then(() => seshat.importShapefileCSVs()
    .then(() => seshat.importIronCSV()));
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

function createUnscopedProperty(npid, nptype, label, description, domain){
    domain = domain || "scm:PoliticalAuthority";
    nptype = normaliseID(nptype, "type");
    npid = normaliseID(npid, "id");
    return WOQL.add_property(npid, nptype)
        .label(label)
        .description(description)
        .domain(domain);
}

function generateClasses(){
    return WOQL.when(true, seshat.getClasses());
}

function generateProperties(){
    return WOQL.when(true, seshat.createProperties());
}

function generateBoxClasses(){
    const filter = WOQL.and(
        WOQL.quad("v:Cid", "rdf:type", "owl:Class", "db:schema"),
        WOQL.not().eq("v:Cid", "tcs:Enumerated"),
        WOQL.not().eq("v:Cid", "scm:Confidence"),
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
function createDatabase(id, title, description){
    title = title || "Seshat";
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
    return WOQLclient.createDatabase(id, dbdetails);
}

/**
 * The query which creates the schema - alternative syntax - 733 chars
 * @param {WOQLClient} client
 */
function createSchema(){
    return loadLibraries().then(() => {
        //return WOQL.and(generateBoxClasses(), generateClasses(), generateProperties()).execute(client);
        return generateBoxClasses().execute(WOQLclient).then(() => {
            return generateClasses().execute(WOQLclient).then(() => {
                return generateProperties().execute(WOQLclient).then(() => {
                    alert("all done");
                })
            })    
        })
    });
}       

function loadLibraries(){
    let owl = "@prefix scm: <" + WOQLclient.connectionConfig.schemaURL() + "#> .\n";
    owl += "@prefix doc: <" + WOQLclient.connectionConfig.docURL() + "> .\n";
    owl += seshat_libs;
    return WOQLclient.updateSchema(false, owl, {"terminus:encoding": "terminus:turtle"});
    /*return fetch("libs.owl").then(response => {
        owl += response.text(); 
        alert(owl);
        return fetch("choices.owl").then(resp2 => {
            owl += resp2.text(); 
            return fetch("boxes.owl").then(resp3 => {
                owl += resp3.text(); 
                return client.updateSchema(false, owl, {"terminus:encoding": "terminus:turtle"});
            }) 
        })
    })*/
}

function runSegment(segment){
    var res = loadSegmentQuery(segment);
    if(res){
        res.then(() => alert("Success " + segment));
        res.catch(() => alert("Failed " + segment));
    }
}

function loadSegmentQuery(segment){
    if(segment == "CreateDB") return createDatabase(seshat.tutorialdb);
    else if(segment == "LoadLibraries") return loadLibraries();
    else if(segment == "CreateProperties") return generateProperties().execute(WOQLclient);
    else if(segment == "CreateBoxClasses") return generateBoxClasses().execute(WOQLclient);
    else if(segment == "CreateClasses") return generateClasses().execute(WOQLclient);
    else if(segment == "CreatePolities") return seshat.importPolities(WOQLclient);
    else if(segment == "ImportProperties") return seshat.importProperties("basic").execute(WOQLclient);
    else if(segment == "ImportProperties2") return seshat.importProperties("booleans").execute(WOQLclient);
    else if(segment == "ImportProperties3") return seshat.importProperties("extended").execute(WOQLclient);
    else if(segment == "ImportAnnotations") return seshat.importRDFAnnotations(WOQLclient, "polity");
    else if(segment == "ImportAnnotations2") return seshat.importRDFAnnotations(WOQLclient, "values");
    else if(segment == "ImportIronSchema") return seshat.extendSeshatSchema(WOQLclient);
    else if(segment == "ImportIronData") return seshat.importSeshatCSV(WOQLclient);
    else if(segment == "ImportConflictSchema") return seshat.importConflictSchema(WOQLclient);
    else if(segment == "ImportShapes") return seshat.importShapefileCSVs();
}

function connectToServer(terminus_server_url, terminus_server_key, dbid){
    seshat.tutorialdb = dbid;
    WOQLclient.connect(terminus_server_url, terminus_server_key, dbid).then(() => cleanup());    
}

function runTutorial(){
    createDatabase(seshat.tutorialdb)
    .then(() => {
        createSchema()
            .then(() => loadAllData())         
    }).catch((error) => console.log(error));
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

function cleanup(){
    //WOQLclient.deleteDatabase("seshat");
    //WOQLclient.deleteDatabase("seshat3");
    //WOQLclient.deleteDatabase("seshat_tutorial");
    //WOQLclient.deleteDatabase("seshat_two");
}