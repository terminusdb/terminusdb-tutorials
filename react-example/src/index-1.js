import React from 'react';
import ReactDOM from 'react-dom';
import TerminusClient from "@terminusdb/terminusdb-client";
import './index.css';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "Connected",
    };
  }

  render() {
    if (this.props.schema) {
      return (<h2> {this.state.status} </h2>)
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
                  entries={this.state.entries}/>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
