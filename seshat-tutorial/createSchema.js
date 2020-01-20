



function createPropertyScoping(WOQL){
    //create confidence //disputed / uncertain / inferred / 
    //create Note
    return cls;
}

WOQL.when(true, WOQL.and(

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

function writeSeshatVariableValue(docid, doctype, doclabel, property, value, vtype, valueid, from, to, confidence){
    var valw = WOQL.insert(valueid, property + "Value")
    if(from) valw.property("scm:start", from);
    if(to) valw.property("scm:end", to);
    if(confidence) valw.property("scm:confidence", confidence);
    if(value) valw.property(vtype, value);
    if(doctype){
        valw.insert(docid, doctype);        
    }
    if(doclabel){
        valw.add_triple(docid, "label", doclabel);
    }
    return valw.add_triple(docid, property, valueid);
}
 

function addPropertyRange(prop, type, parents, domain){
    domain = domain || "scm:PoliticalAuthority";
    parents = parents || ["scm:PropertyValue"];
    woqls = [];
    var type = prop + "_range";
    woqls.push(WOQL.add_class(type)).parent(parents).property(prop, type).domain(domain))
    //if type is literal => tcs:box thingy

    var nprop = WOQL.add_property(prop, type).parent(parents)}



  
  
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
   /  WOQL.add_triple("v:NGA_ID", "scm:presence_of_iron", "v:IronValueID"),
	 WOQL.insert("v:IronValueID", "scm:PresenceOfIronValue")
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
       WOQL.unique("doc:PresenceOfIron_", ["v:NGA_Label", "v:From", "v:To", "v:Presence"], "v:IronValueID"),
       WOQL.or(
		 WOQL.and(
		 	WOQL.eq("v:Presence", {"@value": "P", "@type": "xsd:string"}),
		 	WOQL.eq("v:Presence_Val","scm:present")
	   	),
       	WOQL.and(
			WOQL.eq("v:Presence", {"@value": "A", "@type": "xsd:string"}),
		 	WOQL.eq("v:Presence_Val","scm:absent")
	   	)
      )		 
]

const inserts = WOQL.and(
	WOQL.add_triple("v:IronValueID", "scm:epistemicState", "v:Presence_Val")
)
 
var inputs = WOQL.and(csv, ...wrangles)
  
WOQL.when(inputs, inserts)
