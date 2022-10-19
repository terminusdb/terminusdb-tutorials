# Lesson 1 - Installing, start project and create an empty database with schema

## Installing

You can download the TerminusDB docker image to work locally (recommended to use [Bootstrap here](https://github.com/terminusdb/terminusdb-bootstrap)) or you can connect to TerminusX. If you are using docker image, make sure that your TerminusDB container is running at localhost (https://127.0.0.1). If you are using TerminusX, get the information of the endpoint, team, and API token ready (it should be accessible in the [TerminusX dashboard](https://dashboard.terminusdb.com/) under profile.)

It is recommended to install the TerminusDB Javascript client (works with [Nodejs >= 10](https://nodejs.org/en/download/)) in a separate new nodejs project.

## Start Project

Now go to the project directory (or start a new one):

```
cd ../getting_started
```

Then we will create a new NodeJS project using npm:

```
npm init -y
```

Then we can install client package using npm:

```
npm i @terminusdb/terminusdb-client
```


In the project directory create a new file called as schema.js 


## Create an Empty Database with Schema

Now create a new file called as `schema.js` with `schema.js` you can build a schema for our new database.

In this tutorial series, we will use a fabricated phone book database of a company as an example. It consists of only 2 tables, the first one is the structure of the company ([Employees.csv](Employees.csv)):

| Employee id | Name           | Title               | Team        | Manager     |
| ----------- | -------------- | ------------------- | ----------- | ----------- |
| 001         | Destiny Norris | Marketing Manager   | Marketing   |             |
| 002         | Darci Prosser  | Creative Writer     | Marketing   | 001         |
| 003         | Alanah Bloggs  | Frontend Developer  | IT          | 004         |
| 004         | Fabian Dalby   | Web Service Manager | IT          |             |

And the other is the contact details of the employees ([Contact.csv](Contact.csv)):

| Employee id | Contact number  | Home address                  | Postcode |
| ----------- | --------------- | ----------------------------- | -------- |
| 001         | (01986) 113367  | 1 Market Place, Bungay        | NR35 1AP |
| 002         | (01925) 682388  | 200 Manchester Road, Woolston | WA1 4HJ  |
| 003         | (01274) 708080  | 139 Otley Road, Shipley       | BD18 2PT |
| 004         | (0161) 532 7302 | 2 Ansdell Road, Stockport     | SK5 6SY  |

If you want to learn more about how schemas work you can refer this [documentation](https://terminusdb.com/docs/v10.0/#/reference/reference-schema).

The schema that I created for the above tables will be something like this:

```javascript
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

```

Now we have the right schema plan, let's create database and insert schema into it:

```javascript
const createDatabaseAndSchema = async () => {

  await client.createDatabase("GettingStartedDB", {
    label: "GettingStartedDB",
    comment: "Created new GettingStartedDB",
  });
  console.log("Database created successfully!");

  client.db("GettingStartedDB");

  const schemas = [address_schema, team_schema, employee_schema];
  
  await client.addDocument(schemas, { graph_type: "schema" },"","Inserting schema");
  console.log("Schema inserted successfully!");
};

createDatabaseAndSchema();
```

To verify the schema is committed, if you are using TerminusX, you can see changes in the dashboard. Since we are using TerminusDB locally (it works with TerminusX as well), we can look at the commit history by:

```javascript
  // Get commit history
  const woqlLib = TerminusClient.WOQL;
  const commitQuery = woqlLib.lib().commits();
  
  const res= await client.query(commitQuery);
  console.log(res.bindings);
```

Also, you can look at the objects in the schema graph like this:

```javascript
const result = await client.getDocument({"graph_type":"schema","as_list":true});
console.log(result);
```

The schema.js file will look like this in the end:

```javascript
const TerminusClient = require("@terminusdb/terminusdb-client");

// TODO: Change teamname and username
const teamName = "teamname"
const username = "username"

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
      "@type": "ValueHash"
    },
    "@subdocument": [],
    "@type": "Class",
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
      "marketing",
      "it"
    ]
};

const createDatabaseAndSchema = async () => {

  await client.createDatabase("GettingStartedDB", {
    label: "GettingStartedDB",
    comment: "Created new GettingStartedDB",
  });
  console.log("Database created successfully!");

  client.db("GettingStartedDB");

  // Inserting all the schema documents
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
```

---

[Move on to Lesson 2 - Importing data from CSV using Javascript script](lesson_2.md)
