/*******************
 Query Script
********************/

WOQL.select("v:Start", "v:Start_Label", "v:End", "v:End_Label").and(
	WOQL.triple("v:Journey", "type", "scm:Journey"),
	WOQL.triple("v:Journey", "start_station", "v:Start"),
	WOQL.opt().triple("v:Start", "label", "v:Start_Label"),
	WOQL.triple("v:Journey", "end_station", "v:End"),
	WOQL.opt().triple("v:End", "label", "v:End_Label"),
	WOQL.triple("v:Journey", "journey_bicycle", "v:Bike")
)

/*******************
 View Script
********************/

view = View.graph();
view.node("S_Label", "End_Label").hidden(true)
view.node("End").icon({color: [255,0,0], unicode: "\uf84a"})
    .text("v:End_Label").size(25).charge(-10)
view.node("Start").icon({color: [255,0,0], unicode: "\uf84a"})
    .text("v:Start_Label").size(25).collisionRadius(10)
view.edge("Start", "End").weight(100)
