if(typeof seshat == "undefined") seshat = {};

seshat.importRDFData = function(client, url, agurl){
    url = url || seshat.rdf.urls.main; 
    agurl = agurl || seshat.rdf.urls.notes;
    seshat.importPolities(client, url).then(() => seshat.importProperties(url).execute(client));
}

seshat.importPolities = function(client, url){
    url = url || seshat.rdf.urls.main; 
    let woql = seshat.rdf.getImportPolityWOQL(url); 
    return woql.execute(client);
}

seshat.importProperties = function(wmap, url){
    url = url || seshat.rdf.urls.main; 
    let nmap = {};
    if(wmap) nmap = seshat.properties[wmap];
    else {
        for(var k in seshat.properties){
            for(var p in seshat.properties[k]){
                nmap[p] = seshat.properties[k][p]
            }
        }
    }
    return seshat.rdf.getImportPropertiesWOQL(url, nmap)
}

seshat.rdf = {
    urls: {
        "dacura": "http://dacura.scss.tcd.ie/ontology/dacura#",
        "xdd": "http://dacura.scss.tcd.ie/ontology/xdd#",
        "seshat": "http://dacura.scss.tcd.ie/seshat/ontology/seshat#",
        "main": "https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",   
        "notes": "https://terminusdb.com/t/data/seshat/seshat_notes_export_graph.ttl"   
    }
}

seshat.rdf.getImportPolityWOQL = function(url, gid){
    url = url || seshat.rdf.urls.main; 
    gid = gid || "graph://temp";
    let woql = WOQL.and(
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Polity_ID", "type", seshat.rdf.urls.seshat + "Polity", gid),
                WOQL.re(".*/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID")
            ), 
            WOQL.insert("v:Subject_ID", "scm:Polity")
        ),
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Polity_ID", "type", seshat.rdf.urls.seshat + "Polity", gid),
                WOQL.re(".*/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID"),
                WOQL.quad("v:Polity_ID", "label", "v:PLabel", gid),
            ),
            WOQL.add_triple("v:Subject_ID", "label", "v:PLabel")
        ),
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Polity_ID", "type", seshat.rdf.urls.seshat + "Polity", gid),
                WOQL.re(".*/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID"),
                WOQL.quad("v:Polity_ID", "comment", "v:PDescr", gid),
            ),
            WOQL.add_triple("v:Subject_ID", "comment", "v:PDescr")
        )
    )
    return seshat.rdf.quintetWith(url, woql)
}


seshat.rdf.quintetWith = function(url, subq, gid){
    seshat.rdf.urls.noes; 

    gid = gid || "graph://temp";
    return WOQL.with(gid, WOQL.remote(url, {"type":"turtle"}), subq);
}

seshat.rdf.getCommonImport = function(a, b, c, d, e){
    a = a || "v:AID";
    b = b || "v:First_Pred";
    c = c || "v:Join";
    d = d || "v:Second_Pred";
    e = e || "v:Target";
    return WOQL.and(
        WOQL.quad(a,b,c,"graph://temp"),
        WOQL.quad(c,d,e,"graph://temp"),
        seshat.rdf.getImportDocID("v:AID")
    )        
}


/**
 * 
 * @param {String} prop - local id of the property being imported 
 * @param {[String, String]} [propdata] 
 */
seshat.rdf.getImportPropertyWOQL = function(prop, propdata){
    let newprop = propdata[0];
    let valtype = newprop + "_Value";
    let pseudo = propdata[1];
    let money = propdata[2];
    let valtfm = propdata[3] || WOQL.cast("v:Target", "xsd:string", "v:Value");
    const inserts = WOQL.when(
        WOQL.and(
            seshat.rdf.getCommonImport(),
            WOQL.idgen(seshat.rdf.urls.seshat, [prop], "v:Original_Property"),
            WOQL.eq("v:First_Pred", "v:Original_Property"),
            WOQL.eq("v:Second_Pred", money),
            WOQL.idgen("scm:", [pseudo], "v:Pseudo_Property"),
            WOQL.idgen("scm:", [newprop], "v:New_Property"),
            WOQL.idgen("scm:", [valtype], "v:Value_Type"),
            valtfm,
            WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
        ), WOQL.and(
            WOQL.add_triple("v:DocID", "v:New_Property", "v:Value_ID"),
            WOQL.add_triple("v:Value_ID", "rdf:type", "v:Value_Type"),
            WOQL.add_triple("v:Value_ID", "v:Pseudo_Property", "v:Value")
        )
    );
    return inserts;
}

seshat.rdf.getSpecialImportPropertyWOQL = function(p){
    var common_insert = [
        seshat.rdf.getCommonImport(),
        WOQL.idgen(seshat.rdf.urls.seshat, [p], "v:Original_Property"),
        WOQL.eq("v:First_Pred", "v:Original_Property"),
        WOQL.idgen("scm:", [p], "v:New_Property"),
    ];
    if(p == "predecessor" || p == "successor"){
        return WOQL.when(
            WOQL.and(
                ...common_insert,
                WOQL.eq("v:Second_Pred", seshat.rdf.urls.seshat + "politicalAuthorityReference"),
                seshat.rdf.getImportDocID("v:Target", "v:Target_ID")
            ), WOQL.and(
                WOQL.add_triple("v:DocID", "v:New_Property", "v:Target_ID"),
                WOQL.add_triple("v:Target_ID", "rdf:type", "scm:Polity"),
            )
        )        
    }
    if(p == "references"){
        return WOQL.when(
            WOQL.and(
                ...common_insert,
                WOQL.eq("v:Second_Pred", seshat.rdf.urls.dacura + "string"),
                WOQL.cast("v:Target", "xsd:string", "v:Value"),
                WOQL.idgen("scm:", [p + "_Value"], "v:Value_Type"),
                WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
            ), WOQL.and(
                WOQL.add_triple("v:DocID", "scm:references", "v:Value_ID"),
                WOQL.insert("v:Value_ID", "scm:CitedWork"),
                WOQL.add_triple("v:Value_ID", "rdfs:label", "v:Value")
        ));
    }
    if(p == "cost" || p == "height" || p == "extent"){
        return WOQL.when(
            WOQL.and(
                ...common_insert,
                WOQL.eq("v:Second_Pred", seshat.rdf.urls.dacura + "singleDecimalRange"),
                WOQL.cast("v:Target", "xdd:decimalRange", "v:Value"),
                WOQL.idgen("scm:", [p + "_Value"], "v:Value_Type"),
                WOQL.unique("doc:", ["v:AID"], "v:Building_ID"),
                WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
            ), WOQL.and(
                WOQL.add_triple("v:DocID", "scm:most_costly_building", "v:Building_ID"),
                WOQL.insert("v:Building_ID", "scm:Building"),
                WOQL.add_triple("v:Building_ID", "v:New_Property", "v:Value_ID"),
                WOQL.add_triple("v:Value_ID", "rdf:type", "v:Value_Type"),
                WOQL.add_triple("v:Value_ID", "scm:decimalRange", "v:Value")                
        ));
    }
}

/**
 * 
 * @param {old_property: [newprop, type, money]} propmap 
 */
seshat.rdf.getImportPropertiesWOQL = function(url, propmap){
    var newprops = [];
    let abnorms = ["predecessor", "successor", "height", "extent", "cost", "references"];
    function propertyIsNormal(p){
        return (abnorms.indexOf(p) == -1)
    }
    for(var prop in propmap){
        if(propertyIsNormal(prop)){
            let propdata = seshat.rdf.processPropertyData(prop, propmap[prop]);
            newprops.push(seshat.rdf.getImportPropertyWOQL(prop, propdata));
        }
        else {
            newprops.push(seshat.rdf.getSpecialImportPropertyWOQL(prop));
        }
    }
    return seshat.rdf.quintetWith(url, WOQL.and(...newprops));
}

seshat.rdf.processPropertyData = function(oprop, pmapdata){
    var pdata = [];
    if(pmapdata && pmapdata[0]) pdata.push(pmapdata[0]); 
    else pdata.push(oprop);
    if(pmapdata && pmapdata[1]) pdata.push(pmapdata[1]); 
    else pdata.push("epistemicState");
    if(pmapdata && pmapdata[2]) {
        pdata.push(pmapdata[2]);
        if(pmapdata[3]) pdata.push(pmapdata[3]);
    } 
    else {
        if(pdata[1] == "string"){
             pdata.push(seshat.rdf.urls.dacura + "string");
             pdata.push(WOQL.typecast("v:Target", "xsd:string", "v:Value"));
        }
        else if(pdata[1] == "gYearRange"){
             pdata.push(seshat.rdf.urls.dacura + "gYearRange");
             pdata.push(WOQL.typecast("v:Target", "xdd:integerRange", "v:Value"));
        }
        else if(pdata[1] == "integerRange"){
             pdata.push(seshat.rdf.urls.dacura + "singleIntegerRange");
             pdata.push(WOQL.typecast("v:Target", "xdd:integerRange", "v:Value"));
        } 
        else if(pdata[1] == "decimalRange"){
             pdata.push(seshat.rdf.urls.dacura + "singleDecimalRange");
             pdata.push(WOQL.typecast("v:Target", "xdd:decimalRange", "v:Value"));
        }
        else if(pdata[1] == "epistemicState"){
             pdata.push(seshat.rdf.urls.seshat + "hasEpistemicStateChoice")
             pdata.push(seshat.rdf.transparentValueMap(oprop))
        } 
        else if(pdata[1] == "epistemicFrequency"){
            pdata.push(seshat.rdf.urls.seshat + "hasEpistemicFrequencyChoice")
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       } 
       else if(pdata[1] == "leaderIdentification"){
            pdata.push(seshat.rdf.urls.seshat + "leader_identification_choice")
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       } 
       else if(pdata[1] == "leaderDifferentiation"){
            pdata.push(seshat.rdf.urls.seshat + "leader_differentiation_type")
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       } 
       else if(pdata[1] == "authorityEmphasis"){
            pdata.push(seshat.rdf.urls.seshat + "authority_emphasis_choice")
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       } 
       else if(pdata[1] == "standardization"){
            pdata.push(seshat.rdf.urls.seshat + "has_standardization")
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       } 
       else if(pdata[1] == "degreeOfCentralization"){
            pdata.push(seshat.rdf.urls.seshat + pdata[1]);
            var value_map = {}
            value_map[seshat.rdf.urls.seshat + "no_centralisation"] = "no_centralization";                     
            value_map[seshat.rdf.urls.seshat + "unknown_centralisation"] = "unknown_centralization";                     
            pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
        }
        else {
            pdata.push(seshat.rdf.urls.seshat + pdata[1]);
            pdata.push(seshat.rdf.transparentValueMap(oprop))
       }
    }
    return pdata;    
}

seshat.rdf.transparentValueMap = function(oprop, vtarg, vval){
    oprop = oprop || "Transparent";
    vtarg = vtarg || "v:Target";
    vval = vval || "v:Value"
    return WOQL.and(
        WOQL.re("#(.*)", vtarg, ["v:All"+oprop,"v:Match" + oprop]),
        WOQL.idgen("scm:", ["v:Match" + oprop], vval)
    )

}

seshat.rdf.generateValueMap = function(vmap, def, vtarg){
    vtarg = vtarg || "v:Target";
    var defcond = [];
    var clauses = []
    for(var k in vmap){
        let clause = [
            WOQL.eq(vtarg, k),
            WOQL.idgen("scm:", [vmap[k]], "v:Value")
        ];
        defcond.push(WOQL.not().eq(vtarg, k));
        clauses.push(WOQL.and(...clause));
    }
    if(def){
        defcond.push(def);
        clauses.push(WOQL.and(...defcond));
    }
    return WOQL.or(...clauses);
}

/**
 * Utility function which calculates the id of the polity that the current triple applies to 
 * @param {String} [inp] variable name that will be used for getting the import source (default v:S)
 * @param {String} [out] variable name that will be used for returning value (default v:DocID) 
 */
seshat.rdf.getImportDocID = function(inp, out){
    inp = inp || "v:S";
    let extvar = inp + "_Extension";
    let allvar = inp + "_All";
    out = out || "v:DocID";
    return WOQL.and(
        WOQL.re(".*/candidate/(\\w*)",inp,[allvar,extvar]),
        WOQL.idgen("doc:",[extvar], out)
    )
}


    //dacura:annotates irnelm2:fq2pc86jb9 ;
    //dacura:lifespan irnelm2:fq2pc86j5f ;
        //dacura:start "-0743"^^xdd:gYearRange ;
        //dacura:end "-0647"^^xdd:gYearRange ;
    //dacura:confidence dacura:uncertain ;

seshat.rdf.importRDFAnnotations = function(client, url){
    url = url || seshat.rdf.urls.notes; 
    let rules = WOQL.or(
        WOQL.and(
            seshat.rdf.importPolityAnnotations(),
            seshat.rdf.writeAnnotation()
        ),         
        WOQL.and(
            seshat.rdf.importValueAnnotations(),
            seshat.rdf.writeValueAnnotations()
        ),
        WOQL.and(
            seshat.rdf.importUnmatchedAnnotations(),
            seshat.rdf.writeUnmatchedAnnotations()
        )         
    )
    return seshat.rdf.quintetWith(url, rules).execute(client);    
}



/**
 * @param {*} client 
 * @param {*} url 
 */

seshat.rdf.importPolityAnnotations = function(){
    return WOQL.and(
        seshat.rdf.getAnnotationMatcher(),
        WOQL.re(".*/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
        WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
        WOQL.triple("v:Subject_ID", "type","scm:Polity")
    )
}

seshat.rdf.getAnnotationMatcher = function(){
    return WOQL.and(
        WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "annotates", "v:Annotated_ID", "graph://temp"),
        WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN")        
    )
}

seshat.rdf.writeAnnotation = function(subj){
    subj = subj || "v:Subject_ID";
    return WOQL.and( 
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "lifespan", "v:LS_ID", "graph://temp"),
                WOQL.quad("v:LS_ID", seshat.rdf.urls.dacura + "start", "v:Start_Time", "graph://temp"),
                WOQL.cast("v:Start_Time", "xdd:integerRange", "v:Start_Value", "graph://temp")    
            ),
            WOQL.add_triple(subj, "scm:start", "v:Start_Value")
        ),
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "lifespan", "v:LS_ID", "graph://temp"),
                WOQL.quad("v:LS_ID", seshat.rdf.urls.dacura + "end", "v:End_Time", "graph://temp"),
                WOQL.cast("v:End_Time", "xdd:integerRange", "v:End_Value", "graph://temp")
            ),
            WOQL.add_triple(subj, "scm:end", "v:End_Value")
        ),
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "confidence", "v:Confidence", "graph://temp"),
                WOQL.re("#(.*)", "v:Confidence", ["v:Allconf", "v:ConfCode"]),
                WOQL.idgen("scm:", ["v:ConfCode"], "v:Conf_Value")
            ),
            WOQL.add_triple(subj, "scm:confidence", "v:Conf_Value")
        )
    )
}

seshat.rdf.importValueAnnotations = function(){
    return WOQL.and(
        seshat.rdf.getAnnotationMatcher(),
        WOQL.unique("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
        WOQL.triple("v:Subject_ID", "type","v:AnyType")
    )
}

seshat.rdf.writeValueAnnotations = function(subj){
    subj = subj || "v:Subject_ID";
    return WOQL.and(
        seshat.rdf.writeAnnotation(),
        seshat.rdf.writeAnnotationNote()
    )
}

seshat.rdf.importUnmatchedAnnotations = function(){
    return WOQL.and(
        seshat.rdf.getAnnotationMatcher(),
        seshat.rdf.getImportDocID(false, "v:Subject_ID"),
    )
}

seshat.rdf.writeUnmatchedAnnotations = function(subj){
    subj = subj || "v:Subject_ID";
    return seshat.rdf.writeAnnotationNote(subj)
}

seshat.rdf.writeAnnotationNote = function(subj, value, valid){
    subj = subj || "v:Subject_ID";
    value = value || "v:Comment_Value";
    valid = valid || "v:ID_GEN";
    return WOQL.when(
        WOQL.and(
            WOQL.quad(subj, "comment", value)
        ),
        WOQL.and(
            WOQL.insert(valid, "scm:Note"),
            WOQL.add_triple(valid, "rdfs:comment", value),
            WOQL.add_triple(subj, "scm:notes", valid)
        )
    )        
}
