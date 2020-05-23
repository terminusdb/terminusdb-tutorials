/*******************
 Query Script
********************/

WOQL.and(
  WOQL.triple("v:Person", "rdf:type", "scm:Person"),
  WOQL.triple("v:Person", "rdfs:label", "v:Name"),
  WOQL.triple("v:Person", "scm:gender", "v:Gender"),
  WOQL.triple("v:Person", "scm:spouse", "v:Spouse"),
  WOQL.triple("v:Spouse", "rdfs:label", "v:Spouse_Name"),
  WOQL.triple("v:Person", "scm:father", "v:Father"),
  WOQL.triple("v:Father", "rdfs:label", "v:Father_Name"),
  WOQL.triple("v:Person", "scm:mother", "v:Mother"),
  WOQL.triple("v:Mother", "rdfs:label", "v:Mother_Name"),
)

/*******************
 View Script
********************/

view = View.graph();
view.node("Name", "Gender", "Spouse_Name", "Father_Name", "Mother_Name").hidden(true);
view.node("Person").icon({color:[0,0,0], label:true}).text("v:Name").charge(-100);
view.node("Spouse").in("Female").color([255,100,100]).icon({color:[255,0,255], label:true}).text("v:Spouse_Name").charge(-100);
view.node("Father").icon({color:[0,0,255], label:true}).text("v:Father_Name").charge(-100);
view.node("Mother").color([255,100,100]).icon({color:[255,0,0], label:true}).text("v:Mother_Name").charge(-100);
view.node("Person").v("v:Gender").in("Female").color([255,100,100]).charge(-100);
