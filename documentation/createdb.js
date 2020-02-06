const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQL = TerminusClient.WOQL;
/**
 * 
 * @param {WOQLClient} client 
 * @param {String} id 
 * @param {String} title 
 * @param {String} description 
 */
function createDatabase(client, id, title, description){
    title = title || "Bike Data";
    description = description || "A Database for the Terminus Bikes Tutorial";
    const dbdetails = {
        "@context" : {
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            terminus: "http://terminusdb.com/schema/terminus#"
        },
        "@type": "terminus:Database",
        'rdfs:label' : { "@language":  "en", "@value": title },
        'rdfs:comment': { "@language":  "en", "@value": description},
        'terminus:allow_origin': { "@type" : "xsd:string", "@value" : "*" }
    };
    return client.createDatabase(id, dbdetails);
}


/*WOQL.when = function(Query, Update)
WOQL.opt = function(query){ return new WOQLQuery().opt(query); }
WOQL.from = function(dburl, query){ return new WOQLQuery().from(dburl, query); }
WOQL.into = function(dburl, query){ return new WOQLQuery().into(dburl, query); }
WOQL.limit = function(limit, query){ return new WOQLQuery().limit(limit, query); }
WOQL.start = function(start, query){ return new WOQLQuery().start(start, query); }
WOQL.select = function(...list){ return new WOQLQuery().select(...list); }
WOQL.not = function(query){ return new WOQLQuery().not(query); }
WOQL.triple = function(a, b, c){ return new WOQLQuery().triple(a, b, c); }
WOQL.quad = function(a, b, c, d){ return new WOQLQuery().quad(a, b, c, d); }
WOQL.sub = function(a, b){ return new WOQLQuery().sub(a, b); }
WOQL.isa = function(a, b){	return new WOQLQuery().isa(a, b);	}
WOQL.eq = function(a, b){ return new WOQLQuery().eq(a, b);}
WOQL.trim = function(a, b){	return new WOQLQuery().trim(a, b);	}
WOQL.delete = function(JSON_or_IRI){ return new WOQLQuery().delete(JSON_or_IRI);	}
WOQL.delete_triple = function( S, P, O ){ return new WOQLQuery().delete_triple (S, P, O);	}
WOQL.delete_quad = function( S, P, O, G ){ return new WOQLQuery().delete_quad (S, P, O, G); }
WOQL.add_triple = function( S, P, O ){ return new WOQLQuery().add_triple (S, P, O); }
WOQL.add_quad = function( S, P, O, G ){ 	return new WOQLQuery().add_quad (S, P, O, G);}
WOQL.get = function(vars, cols, target){	return new WOQLQuery().get(vars, cols, target); }
WOQL.put = function(as, query, file){	return new WOQLQuery().put(as, query, file); }
WOQL.with = function(graph, source, query){	return new WOQLQuery().with(graph, source, query); }
WOQL.as = function(map, vari){	return new WOQLQuery().as(map, vari); }
WOQL.remote = function(url, opts){	return new WOQLQuery().remote(url, opts); }
WOQL.file = function(url, opts){	return new WOQLQuery().file(url, opts); }
WOQL.list = function(...vars){	return new WOQLQuery().list(...vars); }
WOQL.order_by = function(asc_or_desc, query){	return new WOQLQuery().order_by(asc_or_desc, query); }
WOQL.asc = function(varlist_or_var){	return new WOQLQuery().asc(varlist_or_var); }
WOQL.desc = function(varlist_or_var){	return new WOQLQuery().desc(varlist_or_var); }
WOQL.group_by = function(gvarlist, groupedvar, groupquery, output){	return new WOQLQuery().group_by(gvarlist, groupedvar, groupquery, output); }
WOQL.concat = function(list, v){	return new WOQLQuery().concat(list, v); }
WOQL.lower = function(u, l){	return new WOQLQuery().lower(u, l); }
WOQL.pad = function(input, pad, len, output){	return new WOQLQuery().pad(input, pad, len, output); }
WOQL.join = function(input, glue, output){	return new WOQLQuery().join(input, glue, output); }
WOQL.unique = function(prefix, vari, type){	return new WOQLQuery().unique(prefix, vari, type); }
WOQL.idgen = function(prefix, vari, type, output){	return new WOQLQuery().idgen(prefix, vari, type, output); }
WOQL.typecast = function(vara, type, varb){	return new WOQLQuery().typecast(vara, type, varb); }
WOQL.re = function(pattern, test, matches){	return new WOQLQuery().re(pattern, test, matches); }
WOQL.less = function(v1, v2){	return new WOQLQuery().less(v1, v2); }
WOQL.greater = function(v1, v2){	return new WOQLQuery().greater(v1, v2); }
WOQL.eval = function(arith, v){	return new WOQLQuery().eval(arith, v);}
WOQL.plus = function(...args){	return new WOQLQuery().plus(...args);}
WOQL.sum = function(input, output){	return new WOQLQuery().sum(input, output);}
WOQL.minus = function(...args){	return new WOQLQuery().minus(...args); }
WOQL.times = function(...args){	return new WOQLQuery().times(...args); }
WOQL.divide = function(...args){ return new WOQLQuery().divide(...args); }
WOQL.exp = function(a, b){	return new WOQLQuery().exp(a, b); }
WOQL.div = function(...args){	return new WOQLQuery().div(...args); }
WOQL.comment = function(arg){	return new WOQLQuery().comment(arg); }
WOQL.length = function(var1, res){	return new WOQLQuery().length(var1, res);}


*/
function woqlSchema(client){
    WOQL.doctype("WOQLQuery")
        .label("WOQL Query")
        .description("A WOQL Query"),
    WOQL.add_class("QueriesWithSubquery")
        .label("Query with Subquery")
        .property("query", "WOQLQuery")
            .label("Sub-Query")
            .parent("WOQLQuery"),
    WOQL.add_class("when")
        .label("when")
        .parent("QueriesWithSubquery")
        .property("update", "WOQLQuery")
            .label("Update"),
    WOQL.add_class("And")
        .property("and", "WOQLQuery")
        .label("and")
        .parent("WOQLQuery")
        .description("Logical AND of queries"),
    WOQL.add_class("Or")
        .property("or", "WOQLQuery")
        .label("or"),
    WOQL.add_class("When")
        .property("when", "WOQLQuery")
        .label("or")
    .parent("WOQLQuery")
    .description("Logical AND of queries"),
    .property("or", "WOQLQuery")
        .label("or")
        .description("Logical OR of queries")
        
}


function createSchema(client){
    WOQL.and(
        WOQL.doctype("WOQLQuery")
            .label("WOQL Query")
            .description("A WOQL Query")
            .property("signature", "Signature")
                .label("Signature")
                .description("The signature of the function"),
        WOQL.add_class("Signature")
            .label("Signature")
            .description("The signature of the function")
            .property("arguments", "WOQLArgument")
                .label("Arguments")
                .description("The arguments to a WOQL query"),
        WOQL.add_class("WOQLArgument")
            .label("Argument") 
            .description("An argument to a WOQL operator")
            .property("position", "xsd:positiveInteger")
                .label("Position")
                .description("Position in the argument list (starting from 1)")
            .property("arg_type", "ArgumentType")
                .label("Argument Type")
                .description("The type of the Argument"),
        WOQL.add_class("ArgumentType")
            .label("Argument Type")
            .description("The type of the argument")        
    )
}

function importFunctions(){
{
    let funcs = getAllFuncs(WOQL);
    for(var i = 0; i< funcs.length; i++){

    }

}

function getAllFuncs(obj) {
    var props = [];

    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props.sort().filter(function(e, i, arr) { 
       if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
    });
}