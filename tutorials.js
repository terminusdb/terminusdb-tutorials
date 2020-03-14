function getTutorialOptions(){
    let options = [];
    let bikes = {
        id: "bike-tutorial",
        python: true,
        title: "Bike Sharing Data",
        text: "blah"
    }
    options.push(bikes);
    let politics = {
        id: "politics-tutorial",
        python: true,
        title: "Political Analysis",
        text: "blah"
    }
    options.push(politics);
    let schema = {
        id: "schema.org",
        python: true,
        title: "Schema.org Taxonomy",
        text: "Schema.org"
    }
    options.push(schema);
    let seshat = {
        id: "seshat-tutorial",
        python: false, 
        title: "Seshat Global History Databank"
    }
    options.push(seshat);
    return options;
}

