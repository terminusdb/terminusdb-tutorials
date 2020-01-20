function getGetWOQLs(url, a, b, c, d, e, f){
    var left = c || "v:O";
    var right = d || "v:S2";
    let pieces = [
        tripleGet(url, a, b, c),
        tripleGet(url, d, e, f),
        WOQL.eq(left, right)
    ];
    return pieces;
}

function tripleGet(url, a, b, c){
    a = a || "v:S";
    b = b || "v:P";
    c = c || "v:O";
    return WOQL.get(
        WOQL.as(a)
            .as(b)
            .as(c)
    ).remote(url,{"type":"turtle"})
}

function getImportIDWOQL(url){
    return WOQL.and(
        WOQL.get(
            WOQL.as("v:S")
                .as("v:P")
                .as("v:O")
        ).remote(url,{"type":"turtle"}),
        getImportDocID(),
        WOQL.eq("http://dacura.scss.tcd.ie/seshat/ontology/seshat#Polity", "v:O")
    );
 }

 function getImportLabelWOQL(url){
    return WOQL.and(
        WOQL.get(
            WOQL.as("v:S")
                .as("v:P")
                .as("v:O")
        ).remote(url,{"type":"turtle"}),
        getImportDocID(),
        WOQL.eq("rdfs:label", "v:P")
    );
 }

 function getImportCommentWOQL(url){
    return WOQL.and(
        WOQL.get(
            WOQL.as("v:S")
                .as("v:P")
                .as("v:O")
        ).remote(url,{"type":"turtle"}),
        getImportDocID(),
        WOQL.eq("rdfs:comment", "v:P")
    );
 }

 function getImportDocID(inp, out){
    inp = inp || "v:S";
    out = out || "v:DocID";
    return WOQL.and(
        WOQL.re(".*/candidate/(\\w*)",inp,["v:All","v:URL_Extension"]),
        WOQL.idgen("doc:",["v:URL_Extension"], out),
    )
}

function getValueProperty(inp, out){
    inp = inp || "v:P";
    out = out || "v:ValueProperty";
    return WOQL.and(
        WOQL.re(".*#(.*)",inp,["v:All","v:URL_Extension"]),
        WOQL.concat(["v:URL_Extension", {"@value": "_Value", "@type": "xsd:string"}], "v:Temp"),
        WOQL.idgen("scm:",["v:Temp"], out)
    )
}

function getImportValueType(inp, out){
    inp = inp || "v:P";
    out = out || "v:ValueType";
    return WOQL.and(
        WOQL.concat([inp, {"@type": "xsd:string", "@value": "_Value"}], "v:Extended"),
        WOQL.idgen("scm:",["v:Extended"], out)
    )
}


function getPropertyMap(ignore, inp, out){
    inp = inp || "v:P";
    out = out || "v:WriteProperty";
    var pm = WOQL.and(
        WOQL.re(".*/ontology/seshat#(.*)",inp,["v:All","v:Local_ID"]),
        WOQL.idgen("scm:",["v:Local_ID"], out)
    )
    if(ignore && ignore.length()){
        pm.and(getIgnoreWOQL("v:Local_ID", ignore));
    }
    return pm;    
}


function getImportWOQL(url, ignore){
    return WOQL.and(
        ...getGetWOQLs(url, "v:S", "v:P", "v:O", "v:S2", "v:P2", "v:O2"),
        getValueProperty(),
        getImportDocID(),
        getImportValueType(),
        getPropertyMap(ignore),
        getImportValueID(),
        getImportValueType(),
        getImportValue(),
    )
}



function importProperties(url){
    return WOQL.when( 
        getImportWOQL(url), 
        getWriteValue("v:DocID", "v:WriteProperty", "v:ValueID", "v:ValueType", "v:ValueProperty", "v:Value")
    )
}/

function importRDFData(client, url){
    importPolities(client, url).then(() => importProperties(url).execute(client));
}

function importRDFAnnotations(client, url){
    var woqls = WOQL.and(
        tripleGet(url),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:P"),
        getImportValueID("v:O"),
        getImportConfidence(url),
        getImportLifespan(url)
    );
    return woqls.execute(client);
    //dacura:annotates irnelm2:fq2pc86jb9 ;
    //dacura:lifespan irnelm2:fq2pc86j5f ;
        //dacura:start "-0743"^^xdd:gYearRange ;
        //dacura:end "-0647"^^xdd:gYearRange ;
    //dacura:confidence dacura:uncertain ;
}

function getImportConfidence(url){
    var input = WOQL.and(
        tripleGet(url, "v:Anot", "v:Prop", "v:Value"),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#confidence", "v:Prop")
    );
    return WOQL.when(input, WOQL.add_triple("v:ValueID", "scm:confidence", "v:Value"));
}

function importLifespan(url){
    var start = WOQL.and(
        ...getGetWOQLs(url, "v:AID", "v:Lifespan", "v:LID", "v:Start", "v:Stime"),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:Lifespan"),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#start", "v:Start"),
        WOQL.typecast("v:Stime", "v:StartValue")
    );
    var end = WOQL.and(
        ...getGetWOQLs(url, "v:ANID", "v:Lifespan", "v:LID2", "v:End", "v:Etime"),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:Lifespan"),
        WOQL.eq("http://dacura.scss.tcd.ie/ontology/dacura#end", "v:End"),
        WOQL.typecast("v:Etime", "v:EndValue")
    );
    var woqls = WOQL.and(
        WOQL.when(start, WOQL.add_triple("v:S", "scm:start", "v:StartValue")),
        WOQL.when(end, WOQL.add_triple("v:S", "scm:end", "v:EndValue"))
    );
    return woqls;
}


function importPolities(client, url){
    var first = getImportIDWOQL(url);
    var w1 = WOQL.when(first, WOQL.insert("v:DocID", "scm:Polity"));
    var second = getImportLabelWOQL(url);
    var w2 = WOQL.when(second, WOQL.add_triple("v:DocID", "rdfs:label", "v:O"));
    var third = getImportCommentWOQL(url);
    var w3 = WOQL.when(third, WOQL.add_triple("v:DocID", "rdfs:comment", "v:O"));
    return w1.execute(client).then(() => w2.execute(client).then(() => w3.execute(client)));    
}

function getIgnoreWOQL(local, ignores){
    var wignores = [];
    for(var i = 0; i<ignores.length; i++){
        var wug = ignores[i];
        wignores.push(WOQL.eq(local, {"@value": wug, "@type": "xsd:string"});
    }
    return WOQL.and(...wignores);
}


function getImportValue(inp, out){
    inp = inp || "v:O2";
    out = out || "v:Value";
    return WOQL.eq(inp, out);//WOQL.and(
        //WOQL.concat([inp, {"@type": "xsd:string", "@value": "_Value"}], "v:Extended"),
        //WOQL.idgen("scm:",["v:Extended"], out)
    //)
}


function getImportValueID(mvar, rvar){
    mvar = mvar || "v:S";
    rvar = rvar || "v:ValueID";
    return WOQL.and(
        WOQL.re(".*/candidate/(.*)",mvar,["v:All","v:URL_Extension"]),
        WOQL.idgen("doc:",["v:URL_Extension"], rvar),
    )
}


function getWriteValue(docid, prop, valueid, valuetype, valprop, val){
    return WOQL.and(
        WOQL.add_triple(docid, prop, valueid), 
        WOQL.insert(valueid, valuetype)
            .property(valprop, val)
    )
}

/* query to ingest RDF turtle files */
