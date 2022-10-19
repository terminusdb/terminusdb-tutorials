const TerminusClient = require("@terminusdb/terminusdb-client");

// TODO: Change teamname and username
const teamName = "yourTeam"
const username = "yourUser"

const client = new TerminusClient.WOQLClient(
  `https://cloud.terminusdb.com/${teamName}/`,
  { user: username, organization: teamName }
);

// If you are using TerminusX you need to generate you api key
// https://terminusdb.com/docs/terminusx/get-api-key here the documentation
client.setApiKey(process.env.TERMINUSDB_ACCESS_TOKEN);

const address_schema = {
    "@id": "Address",
    "@key": {
      "@type": "ValueHash"
    },
    "@subdocument": [],
    "@type": "Class",
    "postcode": "xsd:string",
    "street": "xsd:string",
    "street_num": "xsd:integer",
    "town": "xsd:string"
};

const employee_schema = {
    "@id": "Employee",
    "@key": {
      "@type": "Lexical",
      "@fields": ["employee_id"]
    },
    "@type": "Class",
    "employee_id": "xsd:string",
    "address": "Address",
    "contact_number": "xsd:string",
    "manager": {
      "@class": "Employee",
      "@type": "Optional"
    },
    "name": "xsd:string",
    "team": "Team",
    "title": "xsd:string"
};

const team_schema = {
    "@id": "Team",
    "@type": "Enum",
    "@value": [
      "Marketing",
      "IT"
    ]
};

const createDatabaseAndSchema = async () => {

  await client.createDatabase("GettingStartedDB", {
    label: "GettingStartedDB",
    comment: "Created new GettingStartedDB",
  });
  console.log("Database created successfully!");

  client.db("GettingStartedDB");

  // insert all the schema documents
  const schemas = [address_schema, team_schema, employee_schema];

  await client.addDocument(schemas, { graph_type: "schema" },"","Inserting schema");
  console.log("Schema inserted successfully!");

  // Get commit history
  const woqlLib = TerminusClient.WOQL;
  const commitQuery = woqlLib.lib().commits();

  const response= await client.query(commitQuery);
  console.log(response.bindings);

  // Get all schema documents
  const result = await client.getDocument({"graph_type":"schema","as_list":true});
  console.log(result);
};

createDatabaseAndSchema();