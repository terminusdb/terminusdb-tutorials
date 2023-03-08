# Lesson 2 - Importing data from CSV using JavaScript script

## Creating the JavaScript script

Let's start a new `.js` file called [insert_data.js](insert_data.js). You can copy and paste the one we have in this repo or build one yourself. We will explain the one we have so you know what it does.

In the first half of the script we have to manage and import the data from the CSV. In Node.JS there is the [`fast-csv` package](https://www.npmjs.com/package/fast-csv) that helps reading of CSV files. 

First, install the package:

```bash
npm i fast-csv
```

The script will import this package with some others:

```javascript
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");
```

It will also import `WOQLClient` which is the client that communitcates with the TerminusDB/TerminusCMS:

```javascript
const TerminusClient = require("@terminusdb/terminusdb-client");
```

At the top of the script, we prepare a few empty objects and list to hold the data, we use objects as the keys can be the `Employees id` for easy mapping:

```javascript
const contact_numbers = {};
const addresses = {};
const employees = [];
```

The goal is to populate the `employees` list with the `Employee` objects. To help, we also need `contact_numbers` to hold the contact numbers while reading the `Contact.csv`. The rest of the information in `Contact.csv` will be used to construct `Address` objects and stored in `addresses`. We store the id at first and make the linking later because the manager of that employee may have not been "created" yet.

Then we go ahead and read the CSVs and do the corresponding data managing:

```javascript
// function to load and parse huge CSV files
const readCsv = (fileName) => {
  // TODO: change the directoryPath to point were the csv are stored
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(
      path.resolve(
        __dirname,
        fileName
      )
    )
      .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
      .on("error", reject)
      .on("data", (row) => data.push(row))
      .on("end", () => {
        console.log(`Parsed ${data.length} rows`);
        resolve(data);
      });
  });
};

const insertData = async () => {

  // read Contact.csv
  let resultContacts = await readCsv("Contact.csv");
  resultContacts.forEach((element) => {
    contact_numbers[element["Employee id"]] = element["Contact number"];

    let street = element["Home address"].split(",")[0];
    let street_num = Number(street.split(" ")[0]);
    let street_name = street.split(" ").slice(1).join(" ");
    let town = element["Home address"].split(",")[1].substr(1);

    addresses[element["Employee id"]] = {
      "@type": "Address",
      street: street_name,
      street_num,
      town,
      postcode: element["Postcode"],
    };
  });

  // read Employees.csv
  let resultEmployees = await readCsv("Employees.csv");
  resultEmployees.forEach((element) => {
    let employee = {
      "@type": "Employee",
      name: element["Name"],
      title: element["Title"],
      team: element["Team"],
      address: addresses[element["Employee id"]],
      contact_number: contact_numbers[element["Employee id"]],
      employee_id: element["Employee id"],
    };

    if (element["Manager"] !== "")
      employee.manager = "Employee/" + element["Manager"];

    employees.push(employee);
  });
};
```

The `employees` list should now be populated with the `Employee` objects, ready to be inserted into the database.

## Using the TerminusDB JavaScript Client

The script inserts all `Employees` into the database using the TerminusDB JavaScript Client. To do this, we need to create a client with our cloud endpoint:

```javascript
// TODO: Change teamname and username
const teamName = "teamname"
const username = "username"

const client = new TerminusClient.WOQLClient(
  `https://cloud.terminusdb.com/${teamName}/`,
  { user: username, organization: teamName , db:"GettingStartedDB" }
);

// If you are using TerminusCMS 
client.setApiKey(process.env.TERMINUSDB_ACCESS_TOKEN);
```

If you are using TerminusCMS, you can find the your endpoint, team, and API token in the [TerminusCMS dashboard](https://dashboard.terminusdb.com/) under profile.

The last thing to do is to insert the documents:

```javascript

client.addDocument(employees).then((res)=>{
    console.log("Employees inserted successfully",res);
}).catch((error) => {
    console.log(error);
});

```

## Running the script

Run the script in the terminal. Make sure you are in the Node.JS environment that has `terminusdb-client` installed.

```
$ node insert_data.js
```

To check the data was insert correctly, use the `getDocument` function:

```javascript
const result = await client.getDocument({"as_list":true});
console.log(result);
```

Or if using TerminusCMS, you can check it in the [TerminusCMS dashboard](https://dashboard.terminusdb.com/)

---

[Lesson 3 - Update and import new data that links to old data](lesson_3.md)
