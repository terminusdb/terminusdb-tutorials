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

const getCommitHistory = async (branch) => {

  const woqlLib = TerminusClient.WOQL;
  const commitQuery = woqlLib.lib().commits(branch);

  const res = await client.query(commitQuery);
  console.log(res.bindings);
  return res.bindings
  
};

const addContractors = async () => {

  const rhys = {
    "@type": "Employee",
    employee_id: "006",
    name: "Rhys Arnold",
    title: "UX Designer",
    team: "IT",
    contact_number: "078 3951 7569",
    address: {
      "@type": "Address",
      postcode: "DG4 2ZQ",
      street: "Helland Bridge",
      street_num: 1,
      town: "Ulzieside",
    },
  };

  const maya = {
    "@type": "Employee",
    employee_id: "007",
    name: "Maya O'Brien",
    title: "Creative Content Creator",
    team: "Marketing",
    contact_number: "078 1788 9177",
    address: {
      "@type": "Address",
      postcode: "GU3 3AF",
      street: "Tadcaster Rd",
      street_num: 24,
      town: "Pitch Place",
    },
  };
  await client.addDocument([rhys, maya],{},"","Adding contractors");
};


const runScript = async () => {
  try{

      const defaultBranches = await client.getBranches();
      console.log("Default Branches: ", defaultBranches);

      // Create new contractor branch
      await client.branch("contractors");
      console.log("Branch created successfully!")

      const newBranches = await client.getBranches();
      console.log("New Branches: ", newBranches);

      // checkout to new branch contractors
      client.checkout("contractors");

      await addContractors();
      console.log("Added Contractors successfully!")

      
      console.log("Main Commit History: ")
      await getCommitHistory("main");


      console.log("Contractors Commit History: ")
      await getCommitHistory("contractors");

      client.checkout("main");

      await client.rebase({rebase_from: `${teamName}/GettingStartedDB/local/branch/contractors/`, message: "Merging from contractors" , author: "USer"});
      console.log("Rebase done successfully!");

      const mainCommits = await getCommitHistory("main");

      //We would like to keep the commits up to the `Adding Ethan` one
      const mainCommitObj = mainCommits.find(item=>item["Message"]["@value"] === 'Adding ethan')
      const oldMainCommitID = mainCommitObj['Commit ID']['@value']

      console.log('Main Commit ID',oldMainCommitID )

      await client.resetBranch("main", oldMainCommitID); 
      console.log("Reset done successfully!");

      console.log("Main Commit History: ")
      await getCommitHistory("main");
  }catch(err){
     console.log(err.message) 
  }
}
runScript();