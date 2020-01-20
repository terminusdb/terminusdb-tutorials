
function shapeGet(url){
    return WOQL.get(
        WOQL.as("fid", "v:Fid")
            .as("Polity_nam", "v:Polity")
            .as("xcoord", "v:xcoord")
            .as("ycoord", "v:ycoord")
            .as("Year", "v:Year")
    ).remote(url)
}

function getCSVWOQL(url){
    var inputs = WOQL.and(shapeGet(url), WOQL.concat("[v:xcoord,v:ycoord]","v:Point")); 
    var group =  WOQL.group_by(["v:Fid","v:Polity","v:Year"],"v:Point",inputs, "v:Records");

    var wrangles = [
        WOQL.lower("v:Polity","v:Polity_Lower"),        
        WOQL.typecast("v:Year", "xdd:integerRange", "v:Time"),        
        WOQL.idgen("doc:",["v:Polity_Lower"], "v:PolityID"),        
        WOQL.unique("doc:territory",["v:Polity_ID", "v:Year", "v:Coord_String"], "v:ValueID"),        
        WOQL.join("v:Records",",","v:Coord_String"),
        WOQL.concat("[v:Coord_String]","v:Coords"),    
    ];

    var insert = WOQL.and(
        WOQL.add_triple("v:PolityID", "scm:territory", "v:ValueID"),
        WOQL.add_triple("v:ValueID", "rdf:type", "scm:territory_Value"),
        WOQL.add_triple("v:ValueID", "scm:coordinatePolygon", "v:Coords"),
        WOQL.add_triple("v:ValueID", "scm:start", "v:Time"),
        WOQL.add_triple("v:ValueID", "scm:end", "v:Time")
    )
    var all = WOQL.and(group, ...wrangles);
    return WOQL.when(all,insert);
}

WOQL.when(
    WOQL.lower("v:Polity","v:Polity_Lower"),
    WOQL.pad("v:Year",0,4,"v:GYear"),
    WOQL.concat("doc:v:Polity_Lower","v:Polity_ID"),
    WOQL.unique("doc:Temporality",["scm:Temporality","v:GYear"],"v:Temporality"),
    WOQL.concat("[v:GYear,v:GYear]","v:Range"),
    WOQL.join("v:Records",",","v:Coord_String"),
    WOQL.concat("[v:Coord_String]","v:Coords"),
    WOQL.unique("doc:QualifiedPolygon",["scm:QualifiedPolygon","v:Coords"],"v:Territory")
), WOQL.and(
    WOQL.insert("v:Polity_ID","Polity")
        .label("v:Polity")
        .property("territory","v:Territory")
    WOQL.insert("v:Territory", "scm:QualifiedPolygon")
        .property("tcs:coordinatePolygon", "v:Coords")
        .property("temporality","v:Temporality"),
    WOQL.insert("v:Temporality", "scm:FuzzyLifespanEndpoint")
        .property("tcs:gYearRange", "v:Range")
))
