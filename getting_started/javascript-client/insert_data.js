const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const TerminusClient = require("@terminusdb/terminusdb-client");


// TODO: Change teamname and username
const teamName = "yourTeam"
const username = "yourUser"

const client = new TerminusClient.WOQLClient(
  `https://cloud.terminusdb.com/${teamName}/`,
  { user: username, organization: teamName , db:"GettingStartedDB" }
);

//Assign your key to environment variable TERMINUSDB_ACCESS_TOKEN
client.setApiKey(process.env.TERMINUSDB_ACCESS_TOKEN);

const contact_numbers = {};
const addresses = {};
const employees = [];

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
  console.log("Inserting Employees ", employees);

  client
    .addDocument(employees)
    .then((res) => {
      console.log("Employees inserted successfully", res);
    })
    .catch((error) => {
      console.log(error);
    });

    const result = await client.getDocument({"as_list":true});
    console.log(result);
};

insertData();
