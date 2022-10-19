# Lesson 5 - Version control: time travel, branching and rebase

In this lesson about version control, we will be doing some git like operation that can let us collaborate and time travel.

## Branch, creating a copy and jump between versions

Let's follow the Awesome Startup again. Now they are super busy and decided to hire a few contractors to help out in the current project which will last for a few months. They would like to get the contractors details into the database, so they have to make a branch and ask the contractors to "fill in the details" in the branched database.

Making a branch is like making a copy of the database. The good thing about this operation is that, if the contractors has does something wrong and accidentally modify the data that they should not be modifying, the changes will only be remained in the branched database. It gives the managers chances to review the changes before adopting the change in the main database.

First we will connect to the server:

```javascript
// TODO: Change teamname and username
const teamName = "teamname"
const username = "username"

const client = new TerminusClient.WOQLClient(
  `https://cloud.terminusdb.com/${teamName}/`,
  { user: username, organization: teamName , db:"GettingStartedDB" }
);
```

To make a branch, we can use the `client.branch()` function. The `client.branch("dev")` will create a new branch WITHOUT going (checkout) to that branch.

Before we create the branch, let see what we have for now:

```javascript
await client.getBranches();

```

We only have the `main` branch. The `main` branch is the default branch that is created when you created a new database. Let's create the new branch:

```javascript
await client.branch("contractors");

```

We have created the `contractors` branch. Let's verify:

```javascript
await client.getBranches();

```

We can checkout to the new branch `contractors` using `client.checkout("contractors")`:

```javascript

client.checkout("contractors");

```

Now the contractors can add their details with the script [add_contractors.js](add_contractors.js). We add the two contractors in similar manner as adding Ethan in [lesson 3](lesson_3.md):

Now run the script:

`$ node add_contractors.js`

To verify we did things right, let's see if there is any changes in the current `main` branch, you can see all the commit history with:

```javascript

console.log("Main Commit History: ")
await getCommitHistory("main");

```

```javascript
[
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': '2zt3shmtvrrdsk63kvdxiwtzakthwb3'
    },
    Message: { '@type': 'xsd:string', '@value': 'Adding ethan' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/a3ek3oouby4c098t4horxfrsbdgyy2m',
    Time: { '@type': 'xsd:decimal', '@value': 1637909051.3614013 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'a3ek3oouby4c098t4horxfrsbdgyy2m'
    },
    Message: { '@type': 'xsd:string', '@value': 'updating 001' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/h2oiyr244f8vxmibymtzl049qma6w11',
    Time: { '@type': 'xsd:decimal', '@value': 1637909050.0255294 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'h2oiyr244f8vxmibymtzl049qma6w11'
    },
    Message: { '@type': 'xsd:string', '@value': 'Adding 4 employees' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/trkmri653hdpt8qlarspdfaqw49f5qq',
    Time: { '@type': 'xsd:decimal', '@value': 1637908995.4400997 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'trkmri653hdpt8qlarspdfaqw49f5qq'
    },
    Message: { '@type': 'xsd:string', '@value': 'Inserting schema' },
    'Parent ID': null,
    Time: { '@type': 'xsd:decimal', '@value': 1637908889.3347943 }
  }
]
```

So the last time we make changes is adding Ethan, the contractors are not added here.

Now let's go to the `contractors` branch:

```javascript

console.log("Contractors Commit History: ")
await getCommitHistory("contractors");

```

And check the log again:

```javascript
[
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'stjoccbxjgncn53oebgmghnpzirljyo'
    },
    Message: { '@type': 'xsd:string', '@value': 'Adding contractors' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/2zt3shmtvrrdsk63kvdxiwtzakthwb3',
    Time: { '@type': 'xsd:decimal', '@value': 1637910335.5157332 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': '2zt3shmtvrrdsk63kvdxiwtzakthwb3'
    },
    Message: { '@type': 'xsd:string', '@value': 'Adding ethan' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/a3ek3oouby4c098t4horxfrsbdgyy2m',
    Time: { '@type': 'xsd:decimal', '@value': 1637909051.3614013 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'a3ek3oouby4c098t4horxfrsbdgyy2m'
    },
    Message: { '@type': 'xsd:string', '@value': 'updating 001' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/h2oiyr244f8vxmibymtzl049qma6w11',
    Time: { '@type': 'xsd:decimal', '@value': 1637909050.0255294 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'h2oiyr244f8vxmibymtzl049qma6w11'
    },
    Message: { '@type': 'xsd:string', '@value': 'Adding 4 employees' },
    'Parent ID': 'terminusdb://ref/data/ValidCommit/trkmri653hdpt8qlarspdfaqw49f5qq',
    Time: { '@type': 'xsd:decimal', '@value': 1637908995.4400997 }
  },
  {
    Author: { '@type': 'xsd:string', '@value': 'undefined' },
    'Commit ID': {
      '@type': 'xsd:string',
      '@value': 'trkmri653hdpt8qlarspdfaqw49f5qq'
    },
    Message: { '@type': 'xsd:string', '@value': 'Inserting schema' },
    'Parent ID': null,
    Time: { '@type': 'xsd:decimal', '@value': 1637908889.3347943 }
  }
]
```

We have a new entry for the log.

## Rebase, what is it about?

After the `contractors` branch is created and "filled in". Our managers approve the change. Now, we would like to incorporate the changes back to the main branch. For those of you who are familiar with the git workflow will know that we need to perform a merge from the `contractors` branch to the `main` branch. But we are going to do something a bit difference here, using rebase instead of merge.

Rebase means that we take the changes we made since the branching and will continue from another branch. For example, if we rebase `main` from `contractors` we will continue from what `contractors` is now, i.e. after adding the contractors. This means we have incorporate the change in `contractors` into `main`. For more information about rebase, see the [documentation with git](https://git-scm.com/docs/git-rebase).

To do it, let's go back to `main` and rebase from `contractors`:

```javascript
client.checkout("main");

await client.rebase({rebase_from: `${teamName}/GettingStartedDB/local/branch/contractors/`, message: "Merging from contractors",author: "user"});
  
```

Now when we do `getCommitHistory` we see that we have the `Adding contractors` commit in it.

```javascript

console.log("Main Commit History: ")
await getCommitHistory("main");

```

## Reset, time traveling machine

Time fries, now the project is done and the contractors has done their jobs and left the company. We have to time travel to the state of the company before the project.

Let's verify our commit history again:

```javascript

const mainCommits = await getCommitHistory("main");

//from the commit history we get the commit ID that we need 
const mainCommitObj = mainCommits.find(item=>item["Message"]["@value"] === 'Adding ethan')
const oldMainCommitID = mainCommitObj['Commit ID']['@value']
```

We would like to keep the commits up to the `Adding Ethan` one.
To reset, we use the `client.resetBranch(branch,commitID)` function:

```javascript
await client.resetBranch("main", oldMainCommitID); 
```

IMPORTANT!!!! That it is an hard reset, meaning that the changes after the commit `Adding Ethan` is gone forever!
Now let's have a look at the log again:

```javascript

console.log("Main Commit History: ")
await getCommitHistory("main");

```

We are back to where we were again.

---

[Check out other tutorials](README.md)
