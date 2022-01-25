const TerminusClient = require("@terminusdb/terminusdb-client");

db.inventory.deleteMany({});

const mongoPatch = function(patch){
    let query = {};
    let set = {};

    if('object' === typeof patch){
        for(var key in patch){
            const entry = patch[key];

            if( entry['@op'] == 'SwapValue'){
                query[key] = entry['@before'];
                set[key] = entry['@after'];
            }else if(key === '_id'){
                query[key] = ObjectId(entry);
            }else{
                let [sub_query,sub_set] = mongoPatch(entry);
                query[key] = sub_query;
                if(! sub_set === null){
                    set[key] = sub_set;
                }
            }
        }
        return [query,set]
    }else{
        return [patch,null]
    }
}

var client = new TerminusClient.WOQLClient("http://127.0.0.1:6363")
db.inventory.insertMany([
    { name: "Jane", age:18 },
    { name: "Janine", age:18 }
]);

const jane = db.inventory.findOne( {name : "Jane" });
const janine = JSON.parse(JSON.stringify(jane));
janine.name = "Janine";

let patchPromise = client.getDiff(jane,janine,{});
patchPromise.then( patch => {
    let [q,s] = mongoPatch(patch)
    console.log([q,s]);

    const res = db.inventory.updateOne(q, { $set : s});
    console.log(res);
    if (res.modifiedCount == 1){
        console.log("yay!")
    }else{
        console.log("boo!")
    }
    console.log(patch);
});



