seshat.religion = {};

seshat.religion.documentClasses = function(){
    return WOQL.add_class("ReligiousSystem")
    .label("Religious System")
    .description("Religious System (RS). This unit is defined in ways that are analogous to a polity, except it reflects religious, rather than political authority. Religious systems are dynamical and are typically defined by a set of dated boundaries. Unlike polities, religious systems often overlap with each other.")
    .parent("InterestGroup", "Religion")

}

seshat.religion.thematicClasses = function(){
    return WOQL.and(
        WOQL.add_class("Religion")
            .label("Religion")
            .description("Dealing with Religious matters")            
            .parent("Ideology"),
        WOQL.add_class("God")
            .label("God")
            .description("Relating with the concept of a god or gods")            
            .parent("Religion"),
        WOQL.add_class("HighGods")
            .label("High Gods")
            .description("A high god follows the definition of Guy Swanson (1960: chapter III and appendix 1) as \"a spiritual being who is believed to have created all reality and/or to be its ultimate governor, even though his sole act was to create other spirits who, in turn, created or control the natural world\"... (1) \"Absent or not reported,\" (2) \"Present but not active in human affairs,\" (3) \"Present and active in human affairs but not supportive of human morality\" and (4) \"Present, active, and specifically supportive of human morality\" (Divale 2000).\"")
            .parent("Religion", "God"),
        WOQL.add_class("ReligionRitual")
            .label("Religion and Ritual")
            .description("Religious and ritual matters")
            .parent("Religion", "Ritual") 
    )
}


function createSacredProperties(){
    return WOQL.and(
        createScopedProperty("participant_frequency", "ScopedFrequency", ["Religion", "Ritual"], 
            "Frequency per participant", 
            `The frequency of the society's most frequent collective ritual (frequency of individuals' active participation).`),
        createScopedProperty("high_gods", "ScopedGodType", ["Religion", "Ritual", "God"], 
            "High Gods", 
            `A high god follows the definition of Guy Swanson (1960: chapter III and appendix 1) as 
            "a spiritual being who is believed to have created all reality and/or to be its 
            ultimate governor, even though his sole act was to create other spirits who, in turn, created or control the natural world" 
            (1) "Absent or not reported," (2) "Present but not active in human affairs," 
            (3) "Present and active in human affairs but not supportive of human morality" and 
            (4) Present, active, and specifically supportive of human morality" (Divale 2000).`),
        createScopedProperty("supernatural_justice", "ScopedEpistemicState", ["Religion", "Ritual", "God"], 
            "Supernatural enforcement of fairness", 
            `Supernatural punishment/reward related to "fairness" (sharing of resources; e.g., dividing disputed resources, bargaining, redistribution of wealth).`),
        createScopedProperty("supernatural_reciprocity", "ScopedEpistemicState", ["Religion", "Ritual", "God"], 
            "Supernatural enforcement of reciprocity", 
            `Supernatural punishment / reward related to reciprocity (e.g., fulfilling contracts, returning gifts, repaying debts, upholding trust).`),
        createScopedProperty("supernatural_loyalty", "ScopedEpistemicState", ["Religion", "Ritual", "God"], 
            "Supernatural enforcement of group loyalty", 
            `Supernatural punishment/reward related to the need to remain loyal to UNRELATED members of the same group (e.g., helping coreligionists, going to war for one's group).`),
    )
}

seshat.religion.GodType = function(){
    let choices = [
        ["scm:no_god", "Absent", "Absent - no god is there"], 
        ["scm:unknown_god", "Unknown", "Unknown - evidence does not allow us to say"], 
        ["scm:inactive", "Inactive", "Present but not active in human affairs"],
        ["scm:active", "Active", "Present and active in human affairs but not supportive of human morality"],
        ["scm:moralizing", "Moralizing", "Present, active, and specifically supportive of human morality"]
    ]
    return generateChoiceList("scm:GodType", "God Type",  `(1) Absent or not reported (2) Present but not active in human affairs
     (3) Present and active in human affairs but not supportive of human morality and 
     (4) Present, active, and specifically supportive of human morality (Divale 2000).`, choices)
} 




seshat.religion.Frequency = function(){
    let choices = [
        ["scm:unknown_frequency", "Unknown", "Unknown Frequency"],
        ["scm:daily", "Daily", "Occuring every day (or most days)"],
        ["scm:weekly", "Weekly", "Occurring once per week (or similar frequency)"],
        ["scm:monthly", "Monthly", "Occurring once per month (or similar frequency)"],
        ["scm:seasonally", "Seasonally", "Occurring 4 times per year (or similar frequency)"], 
        ["scm:yearly", "Yearly", "Occurring once a year (or similar frequency)"], 
        ["scm:once_per_generation", "Once per generation", "Occurring once a generation (20 years or similar frequency)"], 
        ["scm:once_in_a_lifetime", "Once in a lifetime", "Occurring once in an individual's lifetime"]
    ]
    return generateChoiceList("scm:Frequency", "Frequency", "The genrational frequencies of events", choices)
}   

/*
else if(pdata[1] == "godType"){
    pdata.push(seshat.rdf.urls.seshat + "hasGodTypeChoice");
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_god";  
    value_map[seshat.rdf.urls.seshat + "absent"] = "no_god";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
}        
else if(pdata[1] == "frequency"){
    pdata.push(seshat.rdf.urls.seshat + "hasFrequencyChoice");
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_frequency";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
}      

seshat.properties.extended = {   
    supernatural_loyalty: [],
    supernatural_reciprocity: [],
    birds: [],
    supernatural_justice: [],

    "frequencyPerParticipant": ["participant_frequency", "frequency"],
    "highGods": ["high_gods", "godType"],       */