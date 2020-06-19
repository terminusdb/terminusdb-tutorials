//const TerminusTutorial = TerminusDashboard.TerminusViewer().TerminusTutorial();
const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQLclient = new TerminusClient.WOQLClient();
const WOQL = TerminusClient.WOQL;
const View = TerminusClient.View;
const Viewer = new TerminusDashboard.TerminusViewer(WOQLclient);

let seshat = {};
seshat.tutorialdb = "seshat";

function getCreateSchemaElementsWOQL(woq){
    return WOQL.when(true, woq);
}

function Tutorial(){
    this.stages = [];
}

Tutorial.prototype.run = function(st){
    if(this.stages.length){
        var ns = this.stages.shift();
        var res = ns.run(this.run);
        if(res.then) return res.then(() => this.run())
    }
}


Tutorial.prototype.addStage = function(st){
    this.stages.push(st);
}

function TutorialStage(){
    this.queries = [];
}

TutorialStage.prototype.setUpdate = function(u){
    this.update = u;
} 


TutorialStage.prototype.setInput = function(i){
    let vr = "" + i;
    this.input = this.clipWOQLFunction(vr);
} 

TutorialStage.prototype.setTitle = function(t){
    this.title = t;
} 

TutorialStage.prototype.setText = function(t){
    this.text = t;
} 

TutorialStage.prototype.addQuery = function(q, views){
    this.queries.push([q, views]);
}

TutorialStage.prototype.run = function(after){
    var sdom = document.createElement("div")
    var hdom = document.createElement("h2");
    hdom.appendChild(document.createTextNode(this.title));
    sdom.appendChild(hdom);
    var p = document.createElement("P");
    p.appendChild(document.createTextNode(this.text));
    var qp = Viewer.getQueryPane(false, false, false, false, {showQuery: "always", saved: false});
    sdom.appendChild(p);
    if(this.input){
        sdom.appendChild(qp.getAsDOM());
        qp.setInput(this.input);
        var up = Viewer.getQueryPane(this.update, false, false, false, {showQuery: false});
    }
    else {
        var up = Viewer.getQueryPane(this.update, false, false, false, {showQuery: "always", saved: false});
    }
    sdom.appendChild(up.getAsDOM());
    up.load().then(() => {
        if(this.queries.length){
            this.runResultQueries(after);
        }
    })
    document.getElementById("tutorialContent").appendChild(sdom);
    return up;
}

TutorialStage.prototype.clipWOQLFunction = function(f){
    let start = f.indexOf("WOQL");
    if(start != -1){
        let end = f.lastIndexOf("}")
        f = f.substring(start, end)
    }
    return f;
}


TutorialStage.prototype.runResultQueries = function(after){
    var res = document.createElement("div");
    for(var i = 0; i<this.queries.length; i++){
        let q = this.queries[i][0];
        //resultConfigs, results, resultPaneConfigs, queryPaneConfig
            var rq = Viewer.getQueryPane(q, this.queries[i][1], false, false, {showQuery: false});
            let rd = rq.getAsDOM();
            res.appendChild(rd);
            rq.load()
    }
    document.getElementById("tutorialContent").appendChild(res);
    if(after) after();

}

seshat.createDocumentClasses = function(){
    var creategen = new TutorialStage();
    creategen.setUpdate(
        getCreateSchemaElementsWOQL(
            WOQL.and(seshat.complexity.documentClasses(), seshat.complexity.thematicClasses())
        )
    );
    creategen.setTitle("Create Document Classes");
    creategen.setText("Document classes and topical classes. Document classes define the primary types of data objects that are stored in the database, while thematic classes are used to classify things in hierarchies");
    let cgview = View.table();
    creategen.addQuery(WOQL.query().classMetadata(), cgview);
    return creategen;
}


function getQuery(part, index){
    if(part == "complexity"){
        let parts = [
            getCreateSchemaElementsWOQL(
                WOQL.and(
                    seshat.complexity.documentClasses(),    
                    seshat.complexity.thematicClasses("scm:Topic")
                )
            ),
            seshat.rdf.rdfLoad(seshat.rdf.urls.main, seshat.rdf.getImportPolityWOQL()),
            getCreateSchemaElementsWOQL(
                seshat.complexity.choices()
            ),
            getCreateSchemaElementsWOQL(
                seshat.complexity.scoping(), 
            ),
            seshat.rdf.rdfLoad(seshat.rdf.urls.notes, seshat.rdf.writePolityAnnotations()),
            WOQL.and(
                WOQL.add_class("Box").label("Box Class").description("A class that represents a boxed datatype").abstract(),
                getCreateSchemaElementsWOQL(WOQL.libs("xdd", "box")),
            ),
            WOQL.boxClasses("scm:", ["tcs:Document", "scm:Enumerated"], ["scm:Confidence"]),
            getCreateSchemaElementsWOQL(seshat.complexity.structuralClasses()),        
            getCreateSchemaElementsWOQL(
                WOQL.and(
                    seshat.complexity.unscopedProperties(),
                    seshat.complexity.scopedProperties()
                )
            ),
            seshat.rdf.rdfLoad(seshat.rdf.urls.main, seshat.complexity.importData()),           
        ]
        return parts[index];
    }
}


function createScopedProperty(npid, nptype, parents, label, description, domain){
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

function showResult(segment){
    if(segment == "CreateBoxClasses"){
        showBoxClasses();
    }
}

function showError(response, segment){

}

function showBoxClasses(){
    var q = WOQL.and(
        WOQL.sub("v:Class", "scm:EnumeratedType", "")
    );
    TerminusViewer.getQueryPane()
    //TerminusViewer.prototype.getQueryPane = function(query, resultConfigs, results, resultPaneConfigs, queryPaneConfig){
    
}




function runSegment(segment){
    var res = loadSegmentQuery(segment);
    if(res){
        res.then(() => showResult(segment));
        res.catch((response) => showError(response, segment));
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
    return WOQLclient.connect(terminus_server_url, terminus_server_key, dbid);    
}

//

function runTutorial(){
    connectToServer("http://localhost:6363/", "root", "poo")
    .then(() => {        
        //createDatabase(seshat.tutorialdb)
        //.then(() => {
            var tut = new Tutorial();
            tut.addStage(seshat.createDocumentClasses())
            //tut.addStage(seshat.createThematicClasses())
            tut.run();
/*
            let woql = getQuery("complexity", 0);
            woql.execute(WOQLclient).then(() => {
                alert(1);
                woql = getQuery("complexity", 1);
                woql.execute(WOQLclient).then(() => {
                    alert(2);
                    woql = getQuery("complexity", 2);
                    woql.execute(WOQLclient).then(() => {
                        alert(3);
                        woql = getQuery("complexity", 3);
                        woql.execute(WOQLclient).then(() => {
                            alert(4);
                            woql = getQuery("complexity", 4);
                            woql.execute(WOQLclient).then(() => {
                                alert(5);
                                woql = getQuery("complexity", 5);
                                woql.execute(WOQLclient).then(() => {
                                    alert(6);
                                    woql = getQuery("complexity", 6);
                                    woql.execute(WOQLclient).then(() => {
                                        alert(7);
                                        woql = getQuery("complexity", 7);
                                        woql.execute(WOQLclient).then(() => {
                                            alert(8);
                                            woql = getQuery("complexity", 8);
                                            woql.execute(WOQLclient).then(() => {
                                                alert("made it 9")
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })*/
        //}).catch((error) => console.log(error));
    })
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
/*

Tutorial.prototype.addStage = function(id, text, query, views, action){
    var stg = {id: id, text: text, query: query, views: views, action: action};
    this.stages.push(stg);
}

let tut = new Tutorial();
tut.setIntro("The Global History Databank", "Building and analysing an integrated knowledge graph describing world history from diverse sources in a single query");
//problem description stage
//create document hierarchy
//create topic hieararchy
//import polities
//creating properties 
//creating enumerated types
//Digression into scoping 
//creating scoped object
//creating datatype boxes
//creating document & enumerated boxes
//Social Complexity Data
//creating properties
//importing properties
//importing annotations
Presence of Iron CSV
//create property
//import data
Resilience Dataset
//import schema
//import data
Shapefile CSV dumps
//import all
Conflict Dataset
//import Conflict Def
//import HPI ontology

}
*/