const TerminusClient = require("@terminusdb/terminusdb-client");

// Connecting to TerminusX
// TODO: Change teamname
const client = new TerminusClient.WOQLClient(
  "https://cloud.terminusdb.com/cloudux/",
  { user: "username", organization: "cloudux", db: "GettingStartedDB" }
);

//Assign your key to environment variable TERMINUSDB_ACCESS_TOKEN
client.setApiKey(process.env.TERMINUSDB_ACCESS_TOKEN);

const updateAndLinkData = async () => {
    const destiny = await client.getDocument({"id":"Employee/001"});

    // have to delete "@id" because database will create a new one
    delete destiny.address['@id'];

    destiny.address.postcode = "PH12 3RP";
    destiny.address.street = "Lairg Road";
    destiny.address.street_num = 73;
    destiny.address.town = "Newbigging";

    await client.updateDocument(destiny,{},"","updating 001");

    const ethan = {
        "@type": "Employee",
        "employee_id": "005",
        name: "Ethan Abbott",
        title: "Backend Developer",
        team: "IT",
        contact_number: "070 7796 8035",
        address: {
            "@type": "Address",
            postcode: "IV27 2TG",
            street: "Shore Street",
            street_num: 84,
            town: "Stoer"
        },
        manager: "Employee/004",
    }
    await client.addDocument(ethan,{},"","Adding ethan");

    const result = await client.getDocument({"as_list":true});
    console.log(result);
    
}

updateAndLinkData();