function getSchemaWOQL(){
    var delta = createSeshatProperty("presence_of_iron", "EpistemicState", ["Metals", "Mining"],
        "Iron", "Presence of iron - encodes whether the metal iron was present in the area or with the group in question");
    return WOQL.when(true, delta); 
}

function getImportWOQL(url){
    const get = WOQL.get(
        WOQL.as("NGA", "v:NGA_Label")
            .as("Date.From", "v:From")
            .as("Date.To", "v:To")
            .as("Iron", "v:Presence")
    ).remote(url);
    
   const wrangles = [
        WOQL.idgen("doc:NGA_", ["v:NGA_Label"], "v:NGA_ID"),
        WOQL.unique("doc:PresenceOfIron_", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID"),
        WOQL.cast("v:To", "xsd:integerRange", "v:To_Cast"),
        WOQL.cast("v:From", "xsd:integerRange", "v:From_Cast")
   ]
   
   const inserts = WOQL.and(
        WOQL.when(
            WOQL.and(get, WOQL.eq("v:Presence", "A"), ...wrangles), 
            getSeshatValue("v:NGA_ID", "scm:NGA", "v:NGA_Label", "scm:presence_of_iron", 
                "scm:absent", "EpistemicState", "v:IronValueID", "v:From_Cast", "v:To_Cast")
        ), 
        WOQL.when(
            WOQL.and(get, WOQL.eq("v:Presence", "P"), ...wrangles), 
            getSeshatValue("v:NGA_ID", "scm:NGA", "v:NGA_Label", "scm:presence_of_iron", 
                "scm:present", "EpistemicState", "v:IronValueID", "v:From_Cast", "v:To_Cast")
        ), 
        WOQL.when(
            WOQL.and(get, WOQL.eq("v:Presence", "A~P"), ...wrangles), 
            WOQL.and(
                getSeshatValue("v:NGA_ID", "scm:NGA", "v:NGA_Label", "scm:presence_of_iron", 
                    "scm:present", "EpistemicState", "v:IronValueID", "v:From_Cast", "v:To_Cast"),
                WOQL.add_triple("v:IronValueID", "scm:epistemicState", "scm:absent"),
                WOQL.add_triple("v:IronValueID", "scm:confidence", "scm:uncertain")
            )
        )
    );
    return inserts;  
}


function extendSeshatSchema(client){
    var woql = getSchemaWOQL();
    return woql.execute(client);
}

function importSeshatCSV(client, url){
    var woql = getImportWOQL(url);
    return woql.execute(client);
}


