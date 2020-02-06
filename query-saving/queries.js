function getSchemaUpdateWOQL(){
    var woqls = WOQL.and(
        WOQL.doctype("Query")
            .label("Query")
            .description("A saved query.")
            .property("woql", "StoredWOQL")
                .label("WOQL Query"),
        WOQL.add_class("StoredWOQL")
            .label("Stored WOQL")
            .property("Generator", "xsd:string")
                .label("Generator")
                .description("A script which generates a WOQL Query and makes the WOQL object available")
            ,property("JSON", "xdd:json"),
        WOQL.add_class("TerminusView")
            .abstract()
            .label("Configured View")
            .description("A configured view of a specific terminus document or query")
            .property("config", "xsd:string"),
        WOQL.add_class("QueryView")
            .label("Query View")
            .description("A view of a specific query")
            .parent("TerminusView"),        

        WOQL.add_class("DocumentView").label("A Note on a value").description("Editorial note on the value")
    );
    return woqls;
}