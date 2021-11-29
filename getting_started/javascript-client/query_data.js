const TerminusClient = require("@terminusdb/terminusdb-client");

// Connecting to TerminusX
// TODO: Change teamname
const client = new TerminusClient.WOQLClient(
  "https://cloud.terminusdb.com/teamname/",
  { user: "username", organization: "teamname", db: "GettingStartedDB" }
);

//Assign your key to environment variable TERMINUSDB_ACCESS_TOKEN
client.setApiKey(process.env.TERMINUSDB_ACCESS_TOKEN);

const query_data = async () => {
  const team_it = await client.queryDocument(
    { type: "Employee", query: { team: "IT" } },
    { as_list: true }
  );
  const team_marketing = await client.queryDocument(
    { type: "Employee", query: { team: "Marketing" } },
    { as_list: true }
  );

  console.log("There are " + team_it.length + " members in team it");
  console.log("There are " + team_marketing.length + " members in team marketing");

  // Get to know who lives in Stockport town
  const result = await client.queryDocument({ type: "Employee", query: { address: { town: "Stockport" } }});
  console.log(result);
};

query_data();
