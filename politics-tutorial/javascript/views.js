view = View.graph();
view.node("v:Subject", "v:Lab2", "v:Lab1", "v:Party2", "v:Party", "v:Similarity", "v:Distance").hidden(true)
view.node("v:Similarity").hidden(true)
view.edge("v:Value", "v:Value2").distance("v:Distance").text("v:Distance").weight(0.04)
view.node("v:Value").text("v:Lab1").icon({ label: true})
view.node("v:Value2").text("v:Lab2").icon({ label: true})
view.node("v:Value", "v:Value2").charge(-4999).collisionRadius(30)
view.node("v:Value").v("v:Party").in("doc:PartySolidarity").color([5, 25, 22])
view.node("v:Value2").v("v:Party2").in("doc:PartySolidarity").color([5, 25, 22])
view.node("v:Value").v("v:Party").in("doc:PartySocial%20Democrats").color([25, 25, 225])
view.node("v:Value2").v("v:Party2").in("doc:PartySocial%20Democrats").color([25, 25, 225])
view.node("v:Value").v("v:Party").in("doc:PartySinn%20F%C3%A9in").color([25, 225, 25])
view.node("v:Value2").v("v:Party2").in("doc:PartySinn%20F%C3%A9in").color([25, 225, 25])
view.node("v:Value").v("v:Party").in("doc:PartyLabour%20Party").color([255, 0, 0])
view.node("v:Value2").v("v:Party2").in("doc:PartyLabour%20Party").color([255, 0, 0])
view.node("v:Value2").v("v:Party2").in("doc:PartyFine%20Gael").color([0, 0, 255])
view.node("v:Value").v("v:Party").in("doc:PartyFine%20Gael").color([0, 0, 255])
view.node("v:Value").v("v:Party").in("doc:PartyFianna%20F%C3%A1il").color([100, 200, 100])
view.node("v:Value2").v("v:Party2").in("doc:PartyFianna%20F%C3%A1il").color([100, 200, 100])
view.node("v:Value").v("v:Party").in("doc:PartyGreen%20Party").color([25, 225, 125])
view.node("v:Value2").v("v:Party2").in("doc:PartyGreen%20Party").color([225, 225, 125])
view.node("v:Value").v("v:Party").in("doc:PartyIndependent").color([25, 25, 25])
view.node("v:Value2").v("v:Party2").in("doc:PartyIndependent").color([25, 25, 25])
view.node("v:Value").v("v:Party").in("doc:PartyPeople%20Before%20Profit").color([225, 25, 25])
view.node("v:Value2").v("v:Party2").in("doc:PartyPeople%20Before%20Profit").color([225, 25, 25])
view.node("v:Value").v("v:Party").in("doc:PartyWorkers'%20Party").color([225, 225, 225])
view.node("v:Value2").v("v:Party2").in("doc:PartyWorkers'%20Party").color([225, 225, 225])

WOQL.limit(1000).and(
    WOQL.triple("v:Subject","similar_to","v:Value"),
    WOQL.triple("v:Subject","similar_to","v:Value2"),
    WOQL.triple("v:Subject","similarity","v:Similarity"),
    WOQL.triple("v:Value","member_of","v:Party"),
    WOQL.triple("v:Value2","member_of","v:Party2"),
    WOQL.not().eq("v:Value","v:Value2"),
    WOQL.opt().triple("v:Value2","label","v:Lab2"),
    WOQL.opt().triple("v:Value","label","v:Lab1"),
    WOQL.eval(WOQL.divide(1, WOQL.exp("v:Similarity", 4)), "v:Distance")
)