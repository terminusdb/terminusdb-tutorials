# Using TerminusX in React App

In this tutorial, we will use TerminusX to build a React app that serves as a simple content management app. The purpose of this tutorial is to demonstrate how to use TerminusX (cloud version of TerminusDB) in conjunction with it's clients to build an web application. As we prioritise the aspect of simplicity and demonstration, some practice we use here is not meant for production.

[In this directory](./) is the finished project, you can clone it and run the finished app directly as long as you have set up a TerminusX backend (see [Setup for the Backend](#setup-for-the-backend)). If you want to build the app step by step, you can follow along all the chapters.

The original of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---

## Running the finished demo - Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

---

## Chapter 0 - Setup for the Tutorial

### Setup for the backend

1. Sign up for TerminusX for free if you haven't. [Sign up/in here](https://dashboard.terminusdb.com).
2. Make sure you have installed [TerminusDB Python Client](https://github.com/terminusdb/terminusdb-client-python#installation) with the `dataframe` option.
3. Make sure you have [sign up for TerminusX](https://dashboard.terminusdb.com/)
4. Start a new directory `$mkdir blog-app-backend`
5. Start a new project named `blog-app` and [connect to TerminusX](/getting_started/python-client/lesson_1.md#start-project) using `$terminusdb startproject`. Connection details to TerminusX can be found at your [TerminusX dashboard](https://dashboard.terminusdb.com/profile).
6. Replace the content `schema.py` with the code here:

```python
import datetime as dt

from terminusdb_client.woqlschema import DocumentTemplate


class Entry(DocumentTemplate):
    """This is Entry
    """

    title: str
    content: str
    created_date: dt.datetime
    last_update: dt.datetime
```

To learn more about TerminusDB/ TerminusX schema management using Python client, see [this tutorial](/getting_started/python-client/README.md).

### Setup for React app

1. Make sure you have a recent version of [Node.js](https://nodejs.org/en/) installed.
2. Follow the [installation instructions for Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) to make a new project.
3. Install the (JavaScript client)(https://github.com/terminusdb/terminusdb-client-js#npm-module) as a Node.js module (`$npm install --save @terminusdb/terminusdb-client`)
3. Delete all files in the `src/` folder of the new project.
4. Add a file named `index.css` in the `src/` folder with [this CSS code](./src/index.css).
5. Add a file named `index.js` in the `src/` folder with [this JS code](./src/index-0.js).

---

## Chapter 1 - Connect to TerminusX

Inspect `index.js` and run `$npm start` note the following that is already in to code:

1. Importing the client with `import TerminusClient from "@terminusdb/terminusdb-client";`
2. Simple login interface with 4 input fields. We need these information from the user to connect to their TerminusX database. More detail available at your [TerminusX dashboard](https://dashboard.terminusdb.com/profile).
3. Simple text showing is we are connected to the database or not. Right now it's always `false`. We will have to determine what to be used as a flag.

First, we will have to make `makeConnection` works. It will be an `async` function as it will be making api calls using the client.

The step to create a connection to TerminusX is quite standard. Example can be easily found at your [TerminusX dashboard](https://dashboard.terminusdb.com/profile). Following that we will add the following code at `makeConnection`, within the `try` cause:

```js
const serverUrl = this.state.endpoint.concat("/", this.state.team, "/");
const client = new TerminusClient.WOQLClient(
        serverUrl,{
          user:this.state.user,
          organization:this.state.team,
          token: this.state.apiKey
        }
      );
await client.connect()
```

If we did not catch any error, we can assume we are connected. However, to make sure we have connected to the right database and with the right schema, we can get the schema information by adding this:

```js
const schema = await client.getSchema("blog_app", "main")
console.log("Schema");
console.log(schema);
```

Now if we open the console and try logging in (filling in the information and click the `Submit` button) to your backend database, you should see the schema showing in the console. (*there may be a few second delay depending on your connection*)

Another thing that we will need in the future will be all documents in the database. If you just created the database following this tutorial you have have no documents in the database, only the schema. However, we will do it now as we are very sure we will need them in the future.

```js
const entries = await client.getDocument({"graph_type":"instance","as_list":true,"type":"Entry"})
console.log("Entries");
console.log(entries);
```

We can log them in console in similar manner as schema, however it is not important right now.

After, we would like to save the schema, entries and client in the state.

```js
this.setState({
  client: client,
  schema: schema,
  entries: entries,
});
```

One last thing before we move on, we should change the status text when we have connected to the database. As we see the text (and the content in the future) is in a `Content` component, we will pass the schema and the entries to it.

```js
< Content schema={this.state.schema}
          entries={this.state.entries}/>
```

Then we can change the text depending on if we have a schema. Note that we does not use entries here as we have no entries right now.

```js
if (this.props.schema) {
  return (<h2> {this.state.status} </h2>)
} else {
  return (<h2> Not connected </h2>)
}
```

Now if you try logging in again, after a few second delay, you should be `Connected`.

This is the end of Chapter 1, your code should look like [this](./src/index-1.js).

---

## Chapter 2 - Add new entry

To move on, we are going to add a form that user can add a new entry to our database. We have to modify the `render` of the "connected" in the `Content`. Instead of the `<h2>` tag, we have:

```js
<div>
  <h2> {this.state.status} </h2>
  <form onSubmit={this.handleSubmit}>
    <label>
      Title:
      <input name="title" type="text" value={this.state.title} onChange={this.handleContentChange} />
    </label>
    <br/>
    <label>
      Content:
      <br/>
      <textarea name="contentText" type="text" value={this.state.contentText} onChange={this.handleContentChange} />
    </label>
    <br/>
    <input type="submit" value="Add New Entry"/>
  </form>
</div>
```

Note that we have to add `title` and `contentText` of the state. We will also need to write `handleContentChange` and `handleSubmit` in the similar fashion like we did in the `Page` component.

```js
constructor(props) {
  super(props);
  this.state = {
    status: "Connected",
    title: "",
    contentText: "",
  };
  this.handleContentChange = this.handleContentChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
}

handleContentChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

handleSubmit(event) {
  if (this.state.title &&  this.state.contentText) {
    // handle adding entry
  } else {
    alert('Missing one or more input.' );
  }
  event.preventDefault();
}
```

Our challenge now lies on how we can handle the actual adding of the entry. One option is to pass the client from `Page` into `Content` and use the client there. However, a more future-proof approach would be create a handler in `Page` and pass to `Content`. You will see the benifit of this approach in the future chapters.

In `Page` we create a handler to handle adding or updating an entry:

```js
async addAndUpdateEntry(entryObj){
  try{
    const client = this.state.client;
    await client.addDocument(entryObj);
  }catch(err){
      console.error(err.message)
  }
}
```

Even though this function is called `addAndUpdateEntry`, all it is doing now is add the document described in `entryObj`. In later chapters we will give it more functionalities. Now let's use this as an event hook and pass it to `Content`.

```js
< Content schema={this.state.schema}
          entries={this.state.entries}
          handleEntry={(entryObj) => this.addAndUpdateEntry(entryObj)}/>
```

Now, to handle the add entry in `handleSubmit`, we need to construct the `entryObj` according to our schema and pass it in `this.props.handleEntry`. We also want to update the status text when the promise is fulfilled.

```js
const lastUpdate = new Date();
const entryObj = {"@type": "Entry",
            "title": this.state.title,
            "content": this.state.contentText,
            "created_date": lastUpdate,
            "last_update": lastUpdate,
          };
this.props.handleEntry(entryObj).then(() => {
  this.setState({
    status: "Entry Added",
  });}
)
```

Now we can add a new entry to the database. After you added the entry, you can see that it appears in your [document explorer](https://dashboard.terminusdb.com/document_explorer) as well.

This is the end of Chapter 2, your code should now look like [this](./src/index-2.js).

---

## Chapter 3 - Show all entries

Before we move on to more complicated operation to the entries. We need a way to show them back to the user. The way we do it here is to add a select menu for the user to choose which entry they want to see and the title and content will be display in the form.

First we want to add the select menu above the title input. The options will be the entries that we have, thus we need to render it dynamically:

```js
render() {
  const entriesOptions = this.props.entries.map((entry, idx) => {
      const entryDisplay = entry.title.concat(", created at ", entry.created_date);
      return (
        <option value={idx}>{entryDisplay}</option>
      );
    });
  if (this.props.schema) {
    return (
      <div>
        <h2> {this.state.status} </h2>
        <form onSubmit={this.handleSubmit}>
          <label for="entry-select">
            Entry:
          </label>
          <select name="entry" id="entry-select" onChange={this.handleSelectChange} value={this.state.selectedEntry}>
            <option value="">-- Add new entry --</option>
            {entriesOptions}
          </select>
          <br/>
          <label>
            Title:
            <input name="title" type="text" value={this.state.title} onChange={this.handleContentChange} />
          </label>
          <br/>
          <label>
            Content:
            <br/>
            <textarea name="contentText" type="text" value={this.state.contentText} onChange={this.handleContentChange} />
          </label>
          <br/>
          <input type="submit" value="Add New Entry"/>
        </form>
      </div>
    )
  } else {
    return (<h2> Not connected </h2>)
  }
}
}
```

Note that we also need to add more to `this.state` to handle which entry is selected and the information about the entry.

```js
this.state = {
  status: "Connected",
  selectedEntry: "",
  id: null,
  title: "",
  contentText: "",
  lastUpdate: null,
  createdAt: null,
};
this.handleSelectChange = this.handleSelectChange.bind(this);
```

The select menu will also have it's own handler:

```js
handleSelectChange(event) {
  const target = event.target;
  const value = target.value;

  if (value) {
    const entry = this.props.entries[value]
    this.setState({
      selectedEntry: value,
      id: entry['@id'],
      title: entry.title,
      contentText: entry.content,
      lastUpdate: entry.last_update,
      createdAt: entry.created_date,
    });
  } else {
    this.setState({
      selectedEntry: "",
      id: null,
      title: "",
      contentText: "",
      lastUpdate: null,
      createdAt: null,
    });
  }

}
```

So if an entry is selected, `this.state` will actually hold the entry and display the title and the content of it. If no entry is selected (the `-- Add new entry --` option), everything will be set back to blank ready for the used to add new entry.

For the final touch, we want to show when the entry is last updated below the content text area:

```js
const lastUpdate = this.state.lastUpdate? "Last updated:" + this.state.lastUpdate:"";
```

```js
<br/>
{lastUpdate}
<input type="submit" value="Add New Entry"/>
```

This is the end of Chapter 3, your code should now look like [this](./src/index-3.js).

---

## Chapter 4 - Update entry

The advantage of what we did in Chapter 3, showing the title and content in the `Content` form, is that we can let the user to modify it and update the document when submitting. We already have `handleContentChange` in place which will update the state when any of them is changed. Let's work on the submit button next.

First thing first, now the text in the button is still `Add new entry` even if it is showing an already existing entry. Let's change it up:

```js
<input type="submit" value={this.state.selectedEntry? "Update Entry":"Add New Entry"}/>
```

Now it will check if there's an selected entry and if it is the text will be `Update Entry`. Next we need to add the handle of the update entry at our `handleSubmit` in the `Content` and `addAndUpdateEntry` in `Page`.

First we add a `if` cause in `handleSubmit`:

```js
handleSubmit(event) {
  if (this.state.title && this.state.contentText) {
    const lastUpdate = new Date()
    if (this.state.selectedEntry){
      const entryObj = {"@id": this.state.id,
                  "@type": "Entry",
                  "title": this.state.title,
                  "content": this.state.contentText,
                  "created_date": this.state.createdAt,
                  "last_update": lastUpdate,
                };
      this.props.handleEntry(entryObj).then(() => {
        this.setState({
          status: "Entry Updated",
        });}
      )
    } else {
      const entryObj = {"@type": "Entry",
                  "title": this.state.title,
                  "content": this.state.contentText,
                  "created_date": lastUpdate,
                  "last_update": lastUpdate,
                };
      this.props.handleEntry(entryObj).then(() => {
        this.setState({
          status: "Entry Added",
        });}
      )
    }
  } else {
    alert('Missing one or more input.' );
  }
  event.preventDefault();
}
```

Note that for updating the document we need to provide the `@id` as well. Also we don't want to update the `created_at`.

Next, the `addAndUpdateEntry`:

```js
async addAndUpdateEntry(entryObj){
  try{
    const client = this.state.client;
    if ('@id' in entryObj){
      await client.updateDocument(entryObj)
    } else{
      await client.addDocument(entryObj);
    }
  }catch(err){
      console.error(err.message)
  }
}
```

We use the fact that if it's update document there will be `@id` provided to check which action we need to take.

Before we call it the end of the Chapter, we want to add one more thing, see now we have only update the `status` text in `<h2>` to reflect what has been done. For the refreshing of the changes entries, either adding new one or updating existing ones, a user need to refresh the page, which is a bit annoying. We can fetch all the documents (entries) in `addAndUpdateEntry` when we have finish updating:

```js
async addAndUpdateEntry(entryObj){
  try{
    const client = this.state.client;
    if ('@id' in entryObj){
      await client.updateDocument(entryObj)
    } else{
      await client.addDocument(entryObj);
    }
    const entries = await client.getDocument({"graph_type":"instance","as_list":true,"type":"Entry"})
    this.setState({
      entries: entries,
    });
  }catch(err){
      console.error(err.message)
  }
}
```

We also need to update the state in `Content`, it can be done by modifying the `setState` in `handleSubmit`:

```js
handleSubmit(event) {
  if (this.state.title && this.state.contentText) {
    const lastUpdate = new Date()
    if (this.state.selectedEntry){
      const entryObj = {"@id": this.state.id,
                  "@type": "Entry",
                  "title": this.state.title,
                  "content": this.state.contentText,
                  "created_date": this.state.createdAt,
                  "last_update": lastUpdate,
                };
      this.props.handleEntry(entryObj).then(() => {
        this.setState({
          status: "Entry Updated",
          lastUpdate: lastUpdate.toISOString(),
        });}
      )
    } else {
      const entryObj = {"@type": "Entry",
                  "title": this.state.title,
                  "content": this.state.contentText,
                  "created_date": lastUpdate,
                  "last_update": lastUpdate,
                };
      this.props.handleEntry(entryObj).then(() => {
        const numOfEntries = this.props.entries.length
        const entry = this.props.entries[numOfEntries-1]
        this.setState({
          status: "Entry Added",
          selectedEntry: numOfEntries-1,
          id: entry['@id'],
          lastUpdate: lastUpdate.toISOString(),
          createdAt: lastUpdate.toISOString(),
        });}
      )
    }
  } else {
    alert('Missing one or more input.' );
  }
  event.preventDefault();
}
```

Note that we use ISO string to represent time in TerminusX by default.

This is the end of Chapter 4, your code should now look like [this](./src/index-4.js).

---

## Chapter 5 - Delete entry

Now we can add new entries and update existing entries, what if I want to delete an entry? For this, we will add an extra button **below the form** for deletion. This button should only show up when there's an existing entry.

```js
<div>
  <h2> {this.state.status} </h2>
  <form onSubmit={this.handleSubmit}>
    <label for="entry-select">
      Entry:
    </label>
    <select name="entry" id="entry-select" onChange={this.handleSelectChange} value={this.state.selectedEntry}>
      <option value="">-- Add new entry --</option>
      {entriesOptions}
    </select>
    <br/>
    <label>
      Title:
      <input name="title" type="text" value={this.state.title} onChange={this.handleContentChange} />
    </label>
    <br/>
    <label>
      Content:
      <br/>
      <textarea name="contentText" type="text" value={this.state.contentText} onChange={this.handleContentChange} />
    </label>
    <br/>
    {lastUpdate}
    <input type="submit" value={this.state.selectedEntry? "Update Entry":"Add New Entry"}/>
  </form>
  {this.state.selectedEntry? <button value="delete" onClick={() => this.handleDelete()}>Delete Entry</button>:""}
</div>
```

As show, we need `handleDelete` it will be set up in a similar fashion as how we did with the submit button in Chapter 2 and Chapter 4.

```js
handleDelete(event) {
  if (window.confirm("Delete this entry?")){
    const entryObj = {"graph_type":"instance", "id": this.state.id};
    this.props.handleDelete(entryObj).then(() => {
      this.setState({
        status: "Entry Deleted",
        selectedEntry: "",
        id: null,
        title: "",
        contentText: "",
        lastUpdate: null,
        createdAt: null,
      });}
    )
  }
}
```

Remember to bind this function in the `Content` constructor:

```js
this.handleDelete = this.handleDelete.bind(this);
```

Note that we have added the prompt to confirm if the user wants to delete this entry. When the user click `Confirm` we need to have a function to delete the entry in `Page`.

```js
async deleteEntry(entryObj){
  try{
    const client = this.state.client;
    await client.deleteDocument(entryObj);
    const entries = await client.getDocument({"graph_type":"instance","as_list":true,"type":"Entry"})
    this.setState({
      entries: entries,
    });
  }catch(err){
      console.error(err.message)
  }
}
```

We pass this in as a props for `Content`:

```js
< Content schema={this.state.schema}
          entries={this.state.entries}
          handleEntry={(entryObj) => this.addAndUpdateEntry(entryObj)}
          handleDelete={(entryObj) => this.deleteEntry(entryObj)}/>
```

Now when we successfully delete an entry, it will reset to the `-- Add new entry --` option. And you have a fully functional simple content management app.

This is the end of Chapter 5, your code should now look like [this](./src/index.js).
