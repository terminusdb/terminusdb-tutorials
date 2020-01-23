seshat.importShapefileCSVs = function(){
    return seshat.shapes.loadShapefileCSVs(seshat.shapes.files);   
}

seshat.shapes = {}

seshat.shapes.shapeGet = function(url){
    return WOQL.get(
        WOQL.as("fid", "v:Fid")
            .as("Polity_nam", "v:Polity")
            .as("xcoord", "v:xcoord")
            .as("ycoord", "v:ycoord")
            .as("Year", "v:Year")
    ).remote(url)
}

seshat.shapes.getCSVWOQL = function(url){
    var inputs = WOQL.and(
        seshat.shapes.shapeGet(url), 
        WOQL.concat("[v:xcoord,v:ycoord]","v:Point")
    ); 
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

seshat.shapes.loadShapefileCSVs = function(queue){
    if(typeof resp == "undefined") resp = false;
    if(url = queue.pop()){
        resp = seshat.shapes.loadShapefileCSV(WOQLclient, url)
        .then( () => seshat.shapes.loadShapefileCSVs(queue))
    }
    if(resp) return resp;
}

seshat.shapes.loadShapefileCSV = function (client, url){
    return seshat.shapes.getCSVWOQL(url).execute(client);
}


seshat.shapes.files = [
        "https://terminusdb.com/t/data/seshat/csvs/0CE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/200AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/300AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/400AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/500AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/600AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/700AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/800AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/900AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1000AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1100AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1200AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1200BCE.gpkg.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1300AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1400AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1500AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1500BCE.csv",
//        "https://terminusdb.com/t/data/seshat/csvs/1600AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1700AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1800AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1900AD.csv",
        "https://terminusdb.com/t/data/seshat/csvs/1900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2100BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/2900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3100BCE%20alt.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3800BCEalt.csv",
        "https://terminusdb.com/t/data/seshat/csvs/3900BCE.csv",        
        "https://terminusdb.com/t/data/seshat/csvs/4000BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4100BCEalt.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4200BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4300BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4400BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4500BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4600BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4700BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4800BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/4900BCE.csv",
        "https://terminusdb.com/t/data/seshat/csvs/5000BCE.csv"
];

