/**
 * File for importing a Spreadsheet and integrating it with Seshat
 * 
 * The spreadsheet contains data about the presence of Iron in seshat NGAs at a particular time
 * 
 * Codes: A, P, A~P are used to indicate absent, present, uncertain
 */

seshat.iron = {}

seshat.importIronCSV = function(client){
    let url = "http://seshatdatabank.info/wp-content/uploads/2020/01/Iron-Updated.csv";
    return seshat.extendSeshatSchema(client)
        .then(() => seshat.importSeshatCSV(client, url));
}

/**
 * Creates a new property and adds it to the database 
 */
seshat.extendSeshatSchema = function(client){
    var delta = createSeshatProperty("presence_of_iron", 
        "ScopedEpistemicState", ["Metals", "Mining"],
        "Iron", 
        `Presence of iron - encodes whether the metal iron was present in the area or
         with the group in question`, "scm:NaturalGeographicArea");
    return WOQL.when(true, delta).execute(client); 
}

seshat.importSeshatCSV = function(client, url){
    let imports = seshat.iron.getImportWOQL(url);
    let basic = WOQL.when(imports, seshat.iron.getInsertWOQL());
    let nimports = WOQL.and(imports, WOQL.eq("v:Presence", {"@value": "A~P", "@type": "xsd:string"}));
    let complex = WOQL.when(nimports, seshat.iron.getUncertainInsert())
    return WOQL.and(basic, complex).execute(client);
}

seshat.iron.getImportWOQL = function(url){
    const get = seshat.iron.getCSVVariables(url); 
    return WOQL.and(get, ...seshat.iron.getWrangles());
}

/**
 * Loads the CSV columns into variables
 * @param {String} url - the URL from which the CSV should be loaded 
 */
seshat.iron.getCSVVariables = function(url){
    return WOQL.get(
        WOQL.as("NGA", "v:NGA_Label")
            .as("Date.From", "v:From")
            .as("Date.To", "v:To")
            .as("Iron", "v:Presence")
    ).remote(url);
}

/**
 * Transforms the data to get it into the shape that we want
 */
seshat.iron.getWrangles = function(){
    const wrangles = [
        WOQL.idgen("doc:NGA_", ["v:NGA_Label"], "v:NGA_ID"),
        WOQL.unique("doc:iron", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID"),
        WOQL.cast("v:To", "xdd:integerRange", "v:To_Cast"),
        WOQL.cast("v:From", "xdd:integerRange", "v:From_Cast"),
        WOQL.or(
            WOQL.and(
                WOQL.eq("v:Presence", {"@value": "A", "@type": "xsd:string"}),
                WOQL.eq("v:Value", "scm:absent")
            ),
            WOQL.eq("v:Value", "scm:present")
        )
   ]
   return wrangles;
}

seshat.iron.getInsertWOQL = function(){
    return WOQL.and(
        WOQL.add_triple("v:NGA_ID", "type", "scm:NaturalGeographicArea"), 
        WOQL.add_triple("v:NGA_ID", "label", "v:NGA_Label"), 
        WOQL.add_triple("v:NGA_ID", "scm:presence_of_iron", "v:IronValueID"), 
        WOQL.add_triple("v:IronValueID", "type", "scm:presence_of_iron_Value"),
        WOQL.add_triple("v:IronValueID", "scm:start", "v:From_Cast"),
        WOQL.add_triple("v:IronValueID", "scm:end", "v:To_Cast"),
        WOQL.add_triple("v:IronValueID", "scm:epistemicState", "v:Value")
   )    
}

seshat.iron.getUncertainInsert = function(){
    return WOQL.and(
        WOQL.add_triple("v:IronValueID", "scm:epistemicState", "scm:absent"),
        WOQL.add_triple("v:IronValueID", "scm:confidence", "scm:uncertain")
    )
}



