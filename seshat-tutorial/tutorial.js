const TerminusClient = new TerminusDashboard.TerminusViewer().TerminusClient();
const WOQLclient = new TerminusClient.WOQLClient();
const WOQL = TerminusClient.WOQL;
const View = TerminusClient.View;
const Viewer = new TerminusDashboard.TerminusViewer(WOQLclient);

function runTutorial(terminus_server, terminus_key, tutorialdb, step_by_step){
    WOQLclient.connect(terminus_server, terminus_key, tutorialdb)
    .then(() => {
        WOQLclient.deleteDatabase()
        .finally(() => {
            createDatabase(tutorialdb, "Seshat", "Global History Databank")
            .then(() => {
                if(step_by_step){
                    showTutorialStages(stages)
                }
                else {
                    createSchema().then(() => oneBigQuery());
                }       
            })
        })
    })
}

function createSchema(){
    return fetch('./seshat-schema.ttl')
    .then(response => {
        WOQLclient.updateSchema(response.text())
    })
}

function oneBigQuery(){
    alert("One big query")
}


/**
 * 
 * @param {WOQLClient} client 
 * @param {String} id 
 * @param {String} title 
 * @param {String} description 
 */
function createDatabase(id, title, description){
    title = title || "Seshat";
    description = description || "Seshat global history databank";
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
    return WOQLclient.createDatabase(id, dbdetails);
}


function showTutorialStages(sg){
    if(sg.length){
        var ns = sg.shift();
        let ondo = function(){
            showTutorialStages(sg);
        }
        showTutorialStage(ns, ondo);
    }
}

function getNextButton(func){
    let but = document.createElement("button");
    but.appendChild(document.createTextNode("Run Query"))
    but.addEventListener("click", function(){
        func();
    })
    return but;
}

function getNextStageButton(func){
    let but = document.createElement("button");
    but.appendChild(document.createTextNode("Next Step"))
    but.addEventListener("click", function(){
        func();
    })
    return but;
}

function showTutorialStage(stage, complete){
    let title = stage.title || "Next Step";
    let text = stage.text || "";
    var sdom = document.createElement("div")
    var hdom = document.createElement("h2");
    hdom.appendChild(document.createTextNode(title));
    sdom.appendChild(hdom);
    var p = document.createElement("P");
    p.appendChild(document.createTextNode(text));
    if(stage.insert){
        var qp = Viewer.getQueryPane(false, false, false, false, {showQuery: "always", editQuery: true, saved: false});
        p.appendChild(qp.getAsDOM());
        qp.setInput(stage.insert);
        qp.input.submit = function(qObj){
            qp.submitQuery(qObj).then(() => {
                if(stage.query){
                    qp.clearMessages()
                    p.appendChild(showResultQuery(stage.query, stage.view, complete));
                }
            });
        }
         /*qp.load().then(() => {
            qp.setInput(stage.insert);
            if(stage.query){
                var func = function(){
                    p.appendChild(showResultQuery(stage.query, stage.view, complete));
                }
            }
            else {
                var func = complete;
            }
            p.appendChild(getNextButton(func))
        })*/
    }
    else if(stage.query) {
        var qp = Viewer.getQueryPane(false, false, false, false, {showQuery: "always", editQuery: true, saved: false});
        p.appendChild(qp.getAsDOM());
        qp.setInput(stage.query);
        qp.input.submit = function(qObj){
            qp.submitQuery(qObj).then(() => {
                if(stage.query){
                    qp.clearMessages()
                    p.appendChild(showResultQuery(stage.query, stage.view, complete));
                    p.appendChild(getNextButton(func))
                }
            });
        }
    }
    sdom.appendChild(p);
    document.getElementById("tutorialContent").appendChild(sdom);
    //return up;
}

function showResultQuery(q, v, complete){
    let vu = v || `let view = View.table()`;
    var rq = Viewer.getQueryPane(eval(q), eval(vu), false, false, {showQuery: false});
    let rd = rq.getAsDOM();
    rq.load();    
    rd.appendChild(getNextStageButton(complete));
    return rd;
}
/*
TutorialStage.prototype.runResultQueries = function(after){
    var res = document.createElement("div");
    for(var i = 0; i<this.queries.length; i++){
        let q = this.queries[i][0];
        //resultConfigs, results, resultPaneConfigs, queryPaneConfig
            var rq = Viewer.getQueryPane(q, this.queries[i][1], false, false, {showQuery: false});
            let rd = rq.getAsDOM();
            res.appendChild(rd);
            rq.load()
    }
    document.getElementById("tutorialContent").appendChild(res);
    if(after) after();

}

function runSegment(segment){
    var res = loadSegmentQuery(segment);
    if(res){
        res.then(() => showResult(segment));
        res.catch((response) => showError(response, segment));
    }
}

*/

