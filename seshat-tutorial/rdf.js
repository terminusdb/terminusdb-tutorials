seshat.rdf = {};

seshat.rdf.getOriginalProperty = function(type){
    if(type.indexOf(":") != -1) type = type.split(":")[1];
    if(["string", "gYearRange", "integerRange", "decimalRange"].indexOf(type) != -1) return seshat.rdf.urls.dacura + type;
    return seshat.rdf.urls.seshat + type;
}

seshat.rdf.valueType = function(type){
    if(type.indexOf(":") != -1) type = type.split(":")[1];
    if(["string"].indexOf(type) != -1) return "xsd:" + type;
    if(["gYearRange", "integerRange", "decimalRange"].indexOf(type) != -1) return "xdd:" + type;
    return false
}

seshat.rdf.getOriginalBoxProperty = function(type){
    let map = {
        EpistemicState: "hasEpistemicStateChoice",
        EpistemicFrequency: "hasEpistemicFrequencyChoice",
        LeaderIdentification: "leader_identification_choice",
        LeaderDifferentiation: "leader_differentiation_type",
        AuthorityEmphasis: "authority_emphasis_choice",
        Standardization: "has_standardization",
        Change: "has_change_size",
        ComplexityChange: "community_size_change", 
        GodType: "hasGodTypeChoice",
        Frequency: "hasFrequencyChoice",
        ExternalContact: "external_contact_choice"
    }
    var ext = (map[type] ? map[type] : type);
    return seshat.rdf.urls.seshat + ext; 
}

//pmapdata is [newprop, range, original_type]
//vmap is a value mapper that outputs "v:Value"
seshat.rdf.processPropertyData = function(oprop, pmapdata, vmap){
    let newprop = (pmapdata && pmapdata[0]) ? pmapdata[0] : oprop; 
    var type = (pmapdata && pmapdata[1]) ? pmapdata[1] : "EpistemicState";
    var origprop = seshat.rdf.urls.seshat + oprop;
    let valtype = seshat.rdf.valueType(type);
    if(valtype){
        var origprop2 = (pmapdata && pmapdata[2] ? pmapdata[2] : seshat.rdf.getOriginalProperty(type));
        var newprop2 = "scm:" + valtype.split(":")[0];
        var valgen = vmap || WOQL.typecast("v:Target", valtype, "v:Value");
    }
    else {
        var origprop2 = (pmapdata && pmapdata[2] ? pmapdata[2] : seshat.rdf.getOriginalBoxProperty(type));
        var newprop2 = type.charAt(0).toLowerCase() + type.slice(1);
        var valgen = vmap || (seshat.rdf.transparentValueMap(oprop));
    }
    return seshat.rdf.getImportScopedPropertyWOQL(origprop, origprop2, newprop, newprop2, valgen);
}

seshat.rdf.commonImport = function(graph){
    graph = graph || "graph://temp";
    return WOQL.and(
        WOQL.quad("v:AID","v:First_Pred","v:Join",graph),
        WOQL.quad("v:Join","v:Second_Pred","v:Target",graph),
        WOQL.re(".*/candidate/(\\w*)","v:AID",["v:AID_ALL","v:AID_Match"]),
        WOQL.idgen("doc:",["v:AID_Match"], "v:DocID"),
    )
}

/**
 * Functoin for 
 * @param {String} prop - local id of the property being imported 
 * @param {[String, String]} [propdata] 
 */
seshat.rdf.getImportScopedPropertyWOQL = function(origprop1, origprop2, newprop, newprop2, value_generator, graph){
    let valtype = newprop + "_Value";
    graph = graph || "graph://temp";

    const inserts = WOQL.when(
        WOQL.and(
            seshat.rdf.commonImport(graph),
            WOQL.idgen(seshat.rdf.urls.seshat, [origprop1], "v:Original_Property"),
            WOQL.eq("v:First_Pred", "v:Original_Property"),
            WOQL.eq("v:Second_Pred", origprop2),
            WOQL.idgen("scm:", [newprop2], "v:Pseudo_Property"),
            WOQL.idgen("scm:", [newprop], "v:New_Property"),
            WOQL.idgen("scm:", [valtype], "v:Value_Type"),
            value_generator,
            WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
        ), WOQL.and(
            WOQL.add_triple("v:DocID", "v:New_Property", "v:Value_ID"),
            WOQL.add_triple("v:Value_ID", "rdf:type", "v:Value_Type"),
            WOQL.add_triple("v:Value_ID", "v:Pseudo_Property", "v:Value")
        )
    );
    return inserts;
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


seshat.rdf.writePolityAnnotations = function(subj){
    subj = subj || "v:Subject_ID";
    let head = WOQL.and(
        seshat.rdf.getAnnotationMatcher(),
        WOQL.re(".*/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
        WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
        WOQL.triple("v:Subject_ID", "type","scm:Polity")
    )
    return seshat.rdf.writeAnnotation(subj, head);
}

seshat.rdf.getAnnotationMatcher = function(){
    return WOQL.and(
        WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "annotates", "v:Annotated_ID", "graph://temp"),
        WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN")        
    )
}

seshat.rdf.writeValueAnnotations = function(subj){
    subj = subj || "v:Subject_ID";
    let inp = WOQL.and(
        seshat.rdf.getAnnotationMatcher(),
        WOQL.unique("doc:", ["v:Annotated_ID"], "v:Subject_ID"),
        WOQL.triple("v:Subject_ID", "type","v:AnyType")
    );
    return seshat.rdf.writeAnnotation(subj, inp)
}


seshat.rdf.writeAnnotation = function(subj, head){
    subj = subj || "v:Subject_ID";
    return WOQL.and( 
        WOQL.when(
            WOQL.and(
                head,
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "lifespan", "v:LS_ID", "graph://temp"),
                WOQL.quad("v:LS_ID", seshat.rdf.urls.dacura + "start", "v:Start_Time", "graph://temp"),
                WOQL.cast("v:Start_Time", "xdd:integerRange", "v:Start_Value", "graph://temp")    
            ),
            WOQL.add_triple(subj, "scm:start", "v:Start_Value")
        ),
        WOQL.when(
            WOQL.and(
                head,
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "lifespan", "v:LS_ID", "graph://temp"),
                WOQL.quad("v:LS_ID", seshat.rdf.urls.dacura + "end", "v:End_Time", "graph://temp"),
                WOQL.cast("v:End_Time", "xdd:integerRange", "v:End_Value", "graph://temp")
            ),
            WOQL.add_triple(subj, "scm:end", "v:End_Value")
        ),
        WOQL.when(
            WOQL.and(
                head,
                WOQL.quad("v:Annotation", seshat.rdf.urls.dacura + "confidence", "v:Confidence", "graph://temp"),
                WOQL.re("#(.*)", "v:Confidence", ["v:Allconf", "v:ConfCode"]),
                WOQL.idgen("scm:", ["v:ConfCode"], "v:Conf_Value")
            ),
            WOQL.add_triple(subj, "scm:confidence", "v:Conf_Value")
        ),
        WOQL.when(
            WOQL.and(
                head,
                WOQL.quad("v:Annotation", "comment", "v:Comment", "graph://temp")
            ), WOQL.and(
                    WOQL.insert("v:ID_GEN", "scm:Note"),
                    WOQL.add_triple("v:ID_GEN", "rdfs:comment", "v:Comment"),
                    WOQL.add_triple(subj, "scm:notes", "v:ID_GEN")
            )
        )
    )
}

seshat.rdf.getImportPolityWOQL = function(url, gid){
    url = url || seshat.rdf.urls.main; 
    gid = gid || "graph://temp";
    return WOQL.and(
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
}

seshat.rdf.rdfLoad = function(url, subq, gid){
    gid = gid || "graph://temp";
    if(url.substring(0, 1) == "/"){
        return WOQL.with(gid, WOQL.file(url, {"type":"turtle"}), subq);
    }
    return WOQL.with(gid, WOQL.remote(url, {"type":"turtle"}), subq);
}

seshat.rdf.urls = {
    "dacura": "http://dacura.scss.tcd.ie/ontology/dacura#",
    "xdd": "http://dacura.scss.tcd.ie/ontology/xdd#",
    "seshat": "http://dacura.scss.tcd.ie/seshat/ontology/seshat#",
    "main": "/app/local_files/seshat-main.ttl",   
    "notes": "/app/local_files/seshat_notes_export_graph.ttl",  
    //"main": "https://terminusdb.com/t/data/seshat/seshat_main_export_graph.ttl",
    //"notes": "https://terminusdb.com/t/data/seshat/seshat_notes_export_graph.ttl"       
}