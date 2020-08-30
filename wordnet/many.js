const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQLclient = new TerminusClient.WOQLClient();
const WOQL = TerminusClient.WOQL;

function stressTest(terminus_server_url, terminus_server_key, dbid){
    WOQLclient.connect(terminus_server_url, terminus_server_key, dbid).then(() => runTests(0, 1000));    
}

function writeResult(run, number){
    var resdom = document.createElement("div");
    resdom.appendChild(document.createTextNode("Completed run " + (run+1) + " added " + number + " records, " + ((run + 1) * number) + " total"))
    document.getElementById("target").appendChild(resdom);
}

function runTests(run, runsize){
    var wjson = {"and": []};
    for(var i = 0; i<runsize; i++){
        var nid = "doc:" + run + "_" + i;
        var woq = WOQL.when(true, WOQL.add_triple(nid, "type", "tcs:Document"));
        wjson['and'].push(woq.json());
    }
    //WOQLclient
    WOQLclient.select(false, wjson).then( () => {
        writeResult(run, runsize);
        runTests(++run, runsize);
    });
}
