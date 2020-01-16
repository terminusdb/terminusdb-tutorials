/* query to ingest RDF turtle files */

function importRDF(WOQL, main, annotations, provenance){
    let get = importTriples(WOQL, main);    
    var inserts = WOQL.and(
        WOQL.add_triple("v:S", "v:P", "v:O")
    )
    return WOQL.when(inputs, inserts);
}

function importAllClasses(WOQL, url){
    var constraints = [
        WOQL.eq("v:P","rdf:type")
    ];
    let get = importTriples(WOQL, url);    
    var inputs = WOQL.and(get, ...constraints);
    var inserts = WOQL.and(
        WOQL.add_class("v:O")
    )
    return WOQL.when(inputs, inserts);
}

function importTriples(WOQL, url, s, p, o){
    s = s || "v:S";
    p = p || "v:P";
    o = o || "v:O";
    return WOQL.get(WOQL.as(s).as(p).as(o)).remote(url,{"type":"turtle"});
}

function importSeshat(){
    const triples = WOQL.get(WOQL.as("v:S").as("v:P").as("v:O"))
    .remote("https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",{"type":"turtle"});
    //first call import all Classes 
    //WOQL.when(
    //    WOQL.and(triples, WOQL.eq("v:P","rdf:type")), 
    //    WOQL.add_class("v:O")
    //)
    //then import all properties
    // bst inpuy = woql.and(triples, )
    //WOQL.when(triples, WOQL.and(
    //    WOQL.add_quad("v:P", )
    
    //)
    //then
    //WOQL.when(get, WOQL.add_triple("v:S", "v:P". "v:O"))
}

const triples = WOQL.get(WOQL.as("v:S").as("v:P").as("v:O")).remote("https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",{"type":"turtle"})
//const import_properties = WOQL.when(WOQL.and(triples, WOQL.not().eq("v:P","rdf:type")), WOQL.add_property("v:P").domain("owl:Thing"));

const triples = WOQL.get(WOQL.as("v:S").as("v:P").as("v:O")).remote("https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",{"type":"turtle"})
const import_properties = WOQL.when(
    WOQL.and(triples, 
        WOQL.not().eq("v:P","rdf:type"),
        WOQL.eq("v:NO", {"@value": "v:O"})
    ), WOQL.add_property("v:P", "owl:Thing").domain("owl:Thing"));

const obj_props = WOQL.select("v:P", "v:O", "v:All").and(triples, 
    WOQL.not().eq("v:P","rdf:type"),
    WOQL.re("^http(.*)", "v:O", ["v:All", "v:ObjectProperty"]),							  
    WOQL.not().eq("v:P","http://dacura.scss.tcd.ie/ontology/dacura#string"),
)

const data_props = WOQL.select("v:P", "v:O", "v:All").and(triples, 
    WOQL.not().eq("v:P","rdf:type"),
    WOQL.not().eq("v:P","rdfs:label"),
    WOQL.not().eq("v:P","rdfs:comment"),
    WOQL.not().re("^http(.*)", "v:O", ["v:All", "v:ObjectProperty"])							  
)

const import_classes = WOQL.when(WOQL.and(triples, WOQL.eq("v:P","rdf:type")), WOQL.add_class("v:O"));
const add_obj_props = WOQL.when(obj_props, WOQL.add_property("v:P", "owl:Thing").domain("owl:Thing"))
const add_data_props = WOQL.when(data_props, WOQL.add_property("v:P", "xsd:anySimpleType").domain("owl:Thing"))
const import_all = WOQL.when(triples, WOQL.add_triple("v:S", "v:P", "v:O"));

const triples = WOQL.get(WOQL.as("v:S").as("v:P").as("v:O")).remote("https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",{"type":"turtle"})
//WOQL.when(WOQL.and(triples, WOQL.eq("v:P","rdf:type")), WOQL.add_class("v:O"));

const obj_props = WOQL.select("v:P", "v:O", "v:All").and(triples, 
    WOQL.not().eq("v:P","rdf:type"),
    WOQL.re("^http(.*)", "v:O", ["v:All", "v:ObjectProperty"]),							  
    WOQL.not().eq("v:P","http://dacura.scss.tcd.ie/ontology/dacura#string"),
)

const data_props = WOQL.select("v:P", "v:O", "v:All").and(triples, 
    WOQL.not().eq("v:P","rdf:type"),
    WOQL.not().eq("v:P","rdfs:label"),
    WOQL.not().eq("v:P","rdfs:comment"),
    WOQL.not().re("^http(.*)", "v:O", ["v:All", "v:ObjectProperty"])							  
)

// WOQL.when(data_props, WOQL.add_property("v:P", "xsd:anySimpleType").domain("owl:Thing"))

//WOQL.when(obj_props, WOQL.add_property("v:P", "owl:Thing").domain("owl:Thing"))

const input = WOQL.and(triples, 
		WOQL.not().eq("v:P", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#provenanceNote"),
		WOQL.not().eq("v:P", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#references"),
		WOQL.not().eq("v:P", "http://dacura.scss.tcd.ie/ontology/dacura#string")			  
)

WOQL.when(input, WOQL.add_triple("v:S", "v:P", "v:O"))