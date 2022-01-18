import React from 'react';
import ReactDOM from 'react-dom';
import TerminusClient from "@terminusdb/terminusdb-client";
import './index.css';

class Content extends React.Component {
  constructor(props) {
    super(props);
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
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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

  handleContentChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

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

  render() {
    const entriesOptions = this.props.entries.map((entry, idx) => {
        const entryDisplay = entry.title.concat(", created at ", entry.created_date);
        return (
          <option value={idx}>{entryDisplay}</option>
        );
      });
    const lastUpdate = this.state.lastUpdate? "Last updated:" + this.state.lastUpdate:"";
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
            {lastUpdate}
            <input type="submit" value={this.state.selectedEntry? "Update Entry":"Add New Entry"}/>
          </form>
        </div>
      )
    } else {
      return (<h2> Not connected </h2>)
    }
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: "",
      user: "",
      team: "",
      apiKey: "",
      client: null,
      schema: null,
      entries: [],
    };
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async makeConnection(){
    try{
      const serverUrl = this.state.endpoint.concat("/", this.state.team, "/");
      const client = new TerminusClient.WOQLClient(
              serverUrl,{
                user:this.state.user,
                organization:this.state.team,
                token: this.state.apiKey
              }
            );
      await client.connect()
      const schema = await client.getSchema("blog_app", "main")
      console.log("Schema");
      console.log(schema);
      const entries = await client.getDocument({"graph_type":"instance","as_list":true,"type":"Entry"})
      console.log("Entries");
      console.log(entries);
      this.setState({
        client: client,
        schema: schema,
        entries: entries,
      });
    }catch(err){
        console.error(err.message)
    }
  }

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

  handleLoginChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    if (this.state.endpoint &&  this.state.user && this.state.team && this.state.apiKey) {
      this.makeConnection();
    } else {
      alert('Missing one or more input.' )
    }
    event.preventDefault();
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            End Point:
            <input name="endpoint" type="text" value={this.state.endpoint} onChange={this.handleLoginChange} />
          </label>
          <label>
            User:
            <input name="user" type="text" value={this.state.user} onChange={this.handleLoginChange} />
          </label>
          <label>
            Team:
            <input name="team" type="text" value={this.state.team} onChange={this.handleLoginChange} />
          </label>
          <label>
            Api Key:
            <input name="apiKey" type="text" value={this.state.apiKey} onChange={this.handleLoginChange} />
          </label>
          <input type="submit" value="Submit"/>
        </form>
        <hr />
        < Content schema={this.state.schema}
                  entries={this.state.entries}
                  handleEntry={(entryObj) => this.addAndUpdateEntry(entryObj)}/>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
