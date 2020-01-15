function getcreateSchemaQuery(WOQL){
    var schema = WOQL.when(true).and(
        WOQL.doctype("PoliticalAuthority")
            .label("PoliticalyAuthority")
            .description("Political Authority - a polity or quasi-polity"),
        WOQL.doctype("Conflict")
            .label("Conflict")
            .description("A conflict between societies")
   );
   return schema.execute(client);
}       

function getVariableValueClass(WOQL){
    //create confidence //disputed / uncertain / inferred / 
    //create Note
    var cls = WOQL.add_class("PropertyValue").
    cls.abstract(true)
       .property("start", "xdd:integerRange")
       .property("end", "xdd:integerRange")
       .property("confidence", "scm:Confidence")
       .property("notes", "scm:Note");
    return cls;
}

WOQL.when(true, WOQL.and(
    WOQL.doctype("CitedWork").label("Cited Work").property("remote_url", "xsd:anyURI"),
    WOQL.add_class("Note").label("A Note on a value")
        .description("Editorial Note on the value")
        .property("citation", "scm:CitedWork")
        .property("quotation", "xsd:string"),
    WOQL.add_class("PropertyValue")
         .abstract(true)
         .property("start", "xdd:integerRange")
         .property("end", "xdd:integerRange")
         .property("confidence", "xsd:string")
         .property("notes", "scm:Note"),
    WOQL.add_class("EpistemicStateValue")
    .parent("PropertyValue").label("Epistemic State")
    .property("epistemicState", "scm:EpistemicState").label("Epistemic State")

 ))
 

function addPropertyRange(prop, type, parents, domain){
    domain = domain || "scm:PoliticalAuthority";
    parents = parents || ["scm:PropertyValue"];
    woqls = [];
    var type = prop + "_range";
    woqls.push(WOQL.add_class(type)).parent(parents).property(prop, type).domain(domain))
    //if type is literal => tcs:box thingy

    var nprop = WOQL.add_property(prop, type).parent(parents)}

function createThematicClasses(WOQL){
    var woqls = [];
    woqls.push(WOQL.add_class("Legal").label("Legal").description("Dealing with legal matters"));
    woqls.push(WOQL.add_class("Military").label("Military").description("Dealing with Military matters"));
    woqls.push(WOQL.add_class("Transport").label("Transport").description("Dealing with Transport matters"));
    woqls.push(WOQL.add_class("Ideology").label("Ideology").description("Dealing with Ideological matters"));
    woqls.push(WOQL.add_class("Scale").label("Scale").description("Dealing with Social Scale"));
    woqls.push(WOQL.add_class("Construction").label("Construction").description("Dealing with Construction matters"));
    woqls.push(WOQL.add_class("Housing").label("Housing").description("Dealing with housing matters")).parent("Construction");
    woqls.push(WOQL.add_class("Public").label("Public").description("Dealing with public, collective characteristics, decision making, etc"));
    woqls.push(WOQL.add_class("Private").label("Private").description("Dealing with private, individual or factional decision making"));
    return woqls;
}


WOQL.get(
    WOQL.as("NGA", "v:NGA_Label")
    .as("Date.From", "v:From")
    .as("Date.To", "v:To")
    .as("Iron", "v:Presence")
  )
  .remote("http://seshatdatabank.info/wp-content/uploads/2020/01/Iron-Updated.csv")
  
  const wrangles = [
       WOQL.idgen("doc:NGA_", ["v:NGA_Label"], "v:NGA_ID"),
       WOQL.unique("doc:PresenceOfIron_", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID"),
       WOQL.cast("v:To", "xsd:integer", "v:To_Cast"),
       WOQL.cast("v:From", "xsd:integer", "v:From_Cast")
  ]
  
  const inserts = WOQL.and(
     WOQL.insert("v:IronValueID", "scm:PresenceOfIronValue")
         .property("scm:end", "v:To_Cast")
         .property("scm:start", "v:From_Cast")
         .property("scm:epistemicState", "v:Presence_State"),
     WOQL.insert("v:NGA_ID", "scm:NGA")
         .property("scm:presence_of_iron", "v:IronValueID")
  )

  WOQL.when(
    WOQL.and(
       WOQL.triple("v:Any", "scm:start", "v:StartValue"),
       WOQL.triple("v:Any", "scm:end", "v:EndValue")
   ),
   WOQL.and(
      WOQL.delete_triple("v:Any", "scm:start", "v:StartValue"),
      WOQL.delete_triple("v:Any", "scm:end", "v:EndValue")
   )
 )

 const csv = WOQL.get(
    WOQL.as("NGA", "v:NGA_Label")
    .as("Date.From", "v:From")
    .as("Date.To", "v:To")
    .as("Iron", "v:Presence")
  )
  .remote("http://seshatdatabank.info/wp-content/uploads/2020/01/Iron-Updated.csv")


const wrangles = [
       WOQL.idgen("doc:NGA_", ["v:NGA_Label"], "v:NGA_ID"),
       WOQL.unique("doc:PresenceOfIron_", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID"),
       WOQL.typecast("v:To", "xsd:integerRange", "v:To_Cast"),
       WOQL.typecast("v:From", "xsd:integerRange", "v:From_Cast")
  ]
  
  const inserts = WOQL.and(
	 WOQL.add_triple("v:IronValueID", "scm:start", "v:From_Cast"),
	 WOQL.add_triple("v:IronValueID", "scm:end", "v:To_Cast"),
	)

var inputs =  WOQL.and(csv, ...wrangles);
 
WOQL.when(inputs, inserts)


  const csv = WOQL.get(
    WOQL.as("NGA", "v:NGA_Label")
    .as("Date.From", "v:From")
    .as("Date.To", "v:To")
    .as("Iron", "v:Presence")
  )
  .remote("http://seshatdatabank.info/wp-content/uploads/2020/01/Iron-Updated.csv")


const wrangles = [
       WOQL.idgen("doc:NGA_", ["v:NGA_Label"], "v:NGA_ID"),
       WOQL.unique("doc:PresenceOfIron_", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID")
  ]
  
  const inserts = WOQL.and(
     WOQL.add_triple("v:NGA_ID", "scm:presence_of_iron", "v:IronValueID"),
	 WOQL.insert("v:IronValueID", "scm:PresenceOfIronValue")
  )

var inputs =  WOQL.and(csv, ...wrangles);
 
WOQL.when(inputs, inserts)

