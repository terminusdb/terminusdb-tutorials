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
        tripleGet(url),
        getImportDocID(),
        WOQL.eq("http://dacura.scss.tcd.ie/seshat/ontology/seshat#Polity", "v:O")
    );
 }

 function getImportLabelWOQL(url){
    return WOQL.and(
        tripleGet(url),
        getImportDocID(),
        WOQL.eq("rdfs:label", "v:P")
    );
 }

 function getImportCommentWOQL(url){
    return WOQL.and(
        tripleGet(url),
        getImportDocID(),
        WOQL.eq("rdfs:comment", "v:P")
    );
 }

 function getImportDocID(inp, out){
    inp = inp || "v:S";
    out = out || "v:DocID";
    return WOQL.and(
        WOQL.re(".*/candidate/(\\w*)",inp,["v:AllDI","v:IDURL_Extension"]),
        WOQL.idgen("doc:",["v:IDURL_Extension"], out),
    )
}

function mp(p_one){
    let parts = [];
    for(var k in p_one){
        var pout = ((p_one[k][0]) ? p_one[k][0] : k);
        var om = onemap(k, pout);
        parts.push(om);
    }
    return WOQL.or(
        ...parts
    )
}

function mv(map){
    let parts = [];
    for(var k in p_one){
        var pout = ((p_one[k][0]) ? p_one[k][0] : k);
        var om = oneval(k, pout);
        parts.push(om);
    }
    return WOQL.or(
        ...parts
    )

}

function onemap(key, val){
    var pref = "http://dacura.scss.tcd.ie/seshat/ontology/seshat#";
    var lhs = pref + key;
    var rhs = val + "_Value";
    return WOQL.and(
        WOQL.eq(lhs, "v:P"),
        WOQL.concat(rhs, "v:TypeX"),
        WOQL.concat(val, "v:WriteX"),
        WOQL.idgen("scm:", ["v:TypeX"], "v:VType"),
        WOQL.idgen("scm:", ["v:WriteX"], "v:WriteProperty")
    );
}


var property_map = {
    "alternativeNames": ["alternative_names", "string"],
    "peak": ["peak_date", "gYearRange"],
    "height": [false, "decimalRange"], 
    "extent": [false, "decimalRange"],
    "cost": [false, "decimalRange"],
    "predecessor": [false, "PoliticalAuthority"],
    "utmZone": ["utm_zone", "string"],
    "centralization": [false, "DegreeOfCentralization"],
    "supraRelations": ["supra_polity_relations", "SupraPolityRelations"],
    "predecessorChange": ["predecessor_relationship", "PoliticalEvolution"],
    "successor": [false, "PoliticalAuthority"],
    "supraculturalEntity": ["supracultural_entity"],
    "supraculturalScale": ["supracultural_scale"],
    "capital": ["capital_city"],
    "references": [],
    "language": ["lang"],
    "linguisticFamily": ["linguistic_family"],
    "population": [],
    "territorialArea": ["territorial_area", "decimalRange"],
    "largestSettlement": ["largest_settlement", "decimalRange"],
    "longestCommunication": ["longest_communication_distance", "decimalRange"],
    "professionalSoldiers": ["professional_soldiers"],
    "priests": [],
    "bureaucrats": [],
    "bureaucratsIncome": ["bureaucrat_income_source"],
    "exams": ["examination_system"],
    "meritPromotion": ["merit_promotion"],
    "govBuildings": ["government_buildings"],
    "legalCode": ["formal_legal_code"],
    "judges": [],
    "courts": [],
    "lawyers": ["professional_lawyers"],
    "publicBuildings": ["public_buildings"],
    "specialHouses": ["special_houses"],
    "symbolicBuilding": ["symbolic_building"],
    "funHouses": ["fun_houses"],
    "libraries": [],
    "utilities": [],
    "irrigation": [],
    "potableWater": ["potable_water"],
    "markets": [],
    "siloes": [],
    "roads": [],
    "bridges": [],
    "canals": [],
    "ports": [],
    "specialSites": ["special_sites"],
    "ceremonialSites": ["ceremonial_sites"],
    "burialSites": ["burial_sites"],
    "emporia": [],
    "enclosures": [],
    "mines": [],
    "altSites": ["other_site"],
    "lengthUnit": ["length_unit"],
    "areaUnit": ["area_unit"],
    "volumeUnit": ["volume_unit"],
    "weightUnit": ["weight_unit"],
    "timeUnit": ["time_unit"],
    "geometricalUnit": ["geometrical_unit"],
    "advancedUnit": ["advanced_unit"],
    "writing": [],
    "mnemonics": [],
    "nonWritten": ["non_written_records"],
    "hasScript": ["script"],
    "writtenRecords": ["written_records"],
    "nonPhonetic": ["non_phonetic"],
    "phonetic": [],
    "hasLists": ["lists"],
    "hasCalendar": ["calendar"],
    "sacredTexts": ["sacred_texts"],
    "religiousLit": ["religious_literature"],   
    "manuals": [],
    "history": [],
    "philosophy": [],
    "science": [],
    "fiction": [],
    "articles": ["monetary_articles"],
    "tokens": ["monetary_tokens"],
    "preciousMetals": ["precious_metals"],
    "foreignCoins": ["foreign_coins"],
    "localCoins": ["indigenous_coins"],
    "paperMoney": ["paper_currency"],
    "debtNotes": ["debt_and_credit"],
    "wealthStores": ["stores_of_wealth"],
    "couriers": [],
    "postOffices": ["post_offices"],
    "privateMail": ["private_mail"],
    "fastestTravel": ["fastest_travel"],
    "settlementLevels": ["settlement_levels", "integerRange"],
    "adminLevels": ["administrative_levels", "integerRange"],
    "religiousLevels": ["religious_levels", "integerRange"],
    "militaryLevels": ["military_levels", "integerRange"]
}

function getValueProperty(inp, out){
    inp = inp || "v:P";
    out = out || "v:ValueProperty";
    return WOQL.and(
        WOQL.re(".*#(.*)",inp,["v:AllVP","v:VPURL_Extension"]),
        WOQL.concat(["v:VPURL_Extension", {"@value": "_Value", "@type": "xsd:string"}], "v:Temp"),
        WOQL.idgen("scm:",["v:Temp"], out)
    )
}

function getPropertyMap(ignore, inp, out){
    inp = inp || "v:P";
    out = out || "v:WriteProperty";
    var pm = WOQL.and(
        WOQL.re(".*/ontology/seshat#(.*)",inp,["v:AllVP","v:Local_ID"]),
        WOQL.idgen("scm:",["v:Local_ID"], out)
    )
    if(ignore && ignore.length){
        pm.and(getIgnoreWOQL("v:Local_ID", ignore));
    }
    return pm;    
}



function getImportValueType(inp, out){
    inp = inp || "v:P";
    out = out || "v:ValueType";
    return WOQL.and(
        WOQL.concat([inp, {"@type": "xsd:string", "@value": "_Value"}], "v:Extended"),
        WOQL.idgen("scm:",["v:Extended"], out)
    )
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
// I want docid -> prop -> O