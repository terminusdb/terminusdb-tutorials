seshat.resilience = {};

seshat.resilience.thematicClasses = function(parent){
    return WOQL.and(
        WOQL.add_class("Resilience")
            .label("Resilience")
            .description("Social Resilience Related Variables")
            .parent(parent),
        WOQL.add_class("Burial")
            .label("Burial")
            .description("Dealing with burials")
            .parent("Ritual"),
            WOQL.add_class("AgriculturalDiversity")
            .label("Agricultural Diversity")
            .description("IV-4-2. Agricultural Diversity [AR-SV-3; AR-SV-5].")
            .parent("Variation", "Agriculture"),
        WOQL.add_class("AgriculturalDiversity")
            .label("Alternative Food Sources.")
            .description("IV-4-3. Alternative Food Sources. [AR-SV-7] [AR-SV-9] [AR-SV-11] ")
            .parent("Food"),
            WOQL.add_class("DependantVariables")
            .label("Dependant")
            .description("Variables that are dependent on other variables."),            
            WOQL.add_class("FoodStorage")
            .label("Food Storage")
            .description("IV-4-1. Food Storage.")
            .parent("Food"),            
        WOQL.add_class("Ceremonials")
            .label("Ceremonials")
            .description("Prominent Community Ceremonials [AR-TL-6] (based on Murdock and Wilson 1972).")
            .parent("Ritual", "Public"),            
        WOQL.add_class("HousingVariation")
            .label("Housing Variation")
            .description("Variation in housing or house compounds. ")
            .parent("Housing", "Variation"),            
        WOQL.add_class("BurialVariation")
            .label("Burial Variation")
            .description("Variation in burials and burial goods ")
            .parent("Burial", "Variation"),      
        WOQL.add_class("CorporateExclusionary")
            .label("Corporate Exclusionary")
            .description("A characteristic relating the corporate / exclusionary spectrum")
            .parent("InternalAffairs", "Politics"),            
        WOQL.add_class("LoosenessTightness")
            .label("Looseness Tightness")
            .description("A characteristic relating the Looseness Tightness spectrum, IV-2. Looseness-Tightness Index.")
            .parent("InternalAffairs", "Politics"),            
        WOQL.add_class("AuthorityEmphasis")
            .label("Authority Emphasis")
            .description("A characteristic relating to Where the emphasis of group authority lies")
            .parent("InternalAffairs", "Politics"),            
        WOQL.add_class("AuthoritySharing")
            .label("Authority Sharing")
            .description("A characteristic relating to how authority is shared between leaders and others")
            .parent("InternalAffairs", "Politics"),            
        WOQL.add_class("CommunityIntegration")
            .label("Community Integration")
            .description("A characteristic relating to Community integration, sum of scores [AR-TL-5] (based on Murdock and Wilson 1972)")
            .parent("InternalAffairs", "Politics"),            
        WOQL.add_class("Leadership")
            .label("Leadership")
            .description("How the leaders are identified, etc")
            .parent("Variation", "InternalAffairs", "Politics"),            )
    
}

function createStandardizationProperties(){
    return WOQL.and(
    createScopedProperty("ritual_standardization", "ScopedStandardization", ["LoosenessTightness"], 
        "Ritual Standardization", 
        `To what extent are ritual structures (including mounds, temples, enclosures, etc.)
         standardized versus architecturally diverse? [AR-TL-21]`),
    createScopedProperty("home_standardization", "ScopedStandardization", ["LoosenessTightness"], 
        "Ritual Standardization", 
        `To what extent are ritual structures (including mounds, temples, enclosures, etc.) 
        standardized versus architecturally diverse? [AR-TL-21]`),
    createScopedProperty("public_standardization", "ScopedStandardization", ["LoosenessTightness"], 
        "Home Standardization", 
        `To what extent are living dwellings standardized versus 
        architecturally diverse? [AR-TL-19]`),
    createScopedProperty("fineware_standardization", "ScopedStandardization", ["LoosenessTightness"], 
        "Fineware Standardization", "To what extent are fineware ceramics standardized? [AR-TL-15]"),
    )
}

function createAgriculturalProperties(){
    return WOQL.and(
        createScopedProperty("horselike_animals", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Animals (Horse etc)", 
        `IV-4-2-7 Animals:  Horse, donkey (Order: Perissodactyla)`),
    createScopedProperty("sheeplike_animals", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Animals (Sheep etc)", 
        `IV-4-2-6 Animals: Sheep, cattle, pig, llama, camel (Order: Artiodactyla)`),
    createScopedProperty("birds", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Birds", 
        `IV-4-2-9 Animals:  Birds (Orders: Galliformes; Anseriformes)`),
    createScopedProperty("cereals", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Cereals", 
        `IV-4-2-1 Crops: Cereals (Order: Poales)`),      
    createScopedProperty("fertilizers", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Fertilizers", 
        `IV-4-2-12 Fertilizers (Seshat)`),
    createScopedProperty("legumes", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Legumes", 
        `IV-4-2-2 Crops: Legumes (Order: Fabales)`),
    createScopedProperty("multi_cropping", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Multi-cropping", 
        `IV-4-2-11 Multicropping `),
    createScopedProperty("polyculture", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Polyculture", 
        `IV-4-2-10 Polyculture (Seshat).`),
    createScopedProperty("alternative_food", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Alternative Food Sources", 
        `IV-4-3. Alternative Food Sources. [AR-SV-7] [AR-SV-9] [AR-SV-11]`),
    createScopedProperty("regional_crops", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Regional Crops", 
        `IV-4-2-5 Crops: Regionally important subsistence plants`),
    createScopedProperty("small_mammals", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Small Mammals", 
        `IV-4-2-8 Animals: Small mammals (Order: Rodentia; Lagomorpha)`),
    createScopedProperty("squashes", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Squashes", 
        `IV-4-2-4 Crops: Squashes (Order: Curcurbitales)`),
    createScopedProperty("vegetables", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Vegetables", 
        `IV-4-2-3 Crops: Vegetables (Order: Solanales)`),
    createScopedProperty("aquatic_mammals", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Aquatic Mammals", 
        `IV-4-3-6 Fish: Aquatic mammals (Orders: Pinnipedia; Cetacea)`),
    createScopedProperty("freshwater_fish", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Freshwater Fish", 
        `IV-4-3-4 Fish: Freshwater fish (Class: Osteichthyes)`),
    createScopedProperty("gathered_herbs", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Gathered Herbs", 
        `IV-4-3-11 Gathered Foods: Wild herbs, leaves, blossoms`),
    createScopedProperty("hunted_birds", "ScopedEpistemicState", ["Hunting", "PP"], 
        "Hunted Birds", 
        `IV-4-3-9 Animals Hunted: Birds and Waterfowl (e.g. Orders: Galliformes; Anseriformes)`),
    createScopedProperty("insects_grubs_honey", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Insects, Grubs, Honey", 
        `IV-4-3-10 Gathered Foods: Insects, grubs, honey`),
    createScopedProperty("large_game", "ScopedEpistemicState", ["Hunting", "PP"], 
        "Large Game", 
        `IV-4-3-8 Animals Hunted: Large game (e.g. Orders Proboscidea; Perissodactyla; Artiodactyla)`),
    createScopedProperty("small_game", "ScopedEpistemicState", ["Hunting", "PP"], 
        "Small Game", 
        `IV-4-3-7 Animals Hunted: Small game (e.g. Orders Rodentia, Lagomorpha)`),
    createScopedProperty("marine_reptiles", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Marine Reptiles", 
        `IV-4-3-2 Fish: Shellfish (Class: Malacostraca)`),
    createScopedProperty("mollusks", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Mollusks", 
        `IV-4-3-1 Fish: Mollusks (Classes: Bivalvia; Gastropodia)`),
    createScopedProperty("saltwater_fish", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Saltwater fish", 
        `IV-4-3-5 Fish: Saltwater fish (Classes: Chondrichthyes; Osteichthyes)`),
    createScopedProperty("shellfish", "ScopedEpistemicState", ["Fishing", "PP"], 
        "Shellfish", 
        `IV-4-3-1 Fish: Mollusks (Classes: Bivalvia; Gastropodia)`),      
    createScopedProperty("tree_pith", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Tree Pith", 
        `IV-4-3-12 Gathered Foods: Tree pith, e.g., sago`),
    createScopedProperty("wild_fruit", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Wild Fruit", 
        `IV-4-3-14 Gathered Foods: Wild fruit, seeds, nuts, berries`),
    createScopedProperty("wild_roots", "ScopedEpistemicState", ["Agriculture", "PP"], 
        "Wild Roots", 
        `IV-4-3-13 Gathered Foods: Wild roots or tubers`),
    createScopedProperty("agricultural_terracing", "ScopedEpistemicState", ["Agriculture", "Infrastructure", "PP"], 
        "Agricultural terracing", 
        `IV-5-2. Agricultural terracing`),
    );
}

function createInternalAffairsProperties(){
    return WOQL.and(
    createScopedProperty("authority_emphasis", "ScopedAuthorityEmphasis", ["InternalAffairs", "PP", "Leadership"], 
        "Authority Emphasis", 
        `Where the emphasis of group authority lies`),
    createScopedProperty("authority_sharing", "ScopedAuthoritySharing", ["InternalAffairs", "PP", "Leadership"], 
        "Authority Sharing", 
        `How authority is shared between leaders and others`),
    createScopedProperty("external_contacts", "ScopedExternalContact", ["InternalAffairs", "PP", "Leadership"], 
        "External Contacts", 
        `IV-3-5 External contacts (excluding warfare) [AR-PE-19]`),
    createScopedProperty("leader_differentiation", "ScopedLeaderDifferentiation", ["InternalAffairs", "PP", "Leadership"], 
        "Leader Differentiation", 
        `How the leaders are differentiated from others`),
    createScopedProperty("leader_identification", "ScopedLeaderIdentification", ["InternalAffairs", "PP", "Leadership"], 
        "Leader Identification", 
        `The ways in which leaders are identified as distinct from commoners`),
    );
}

function createCeremonialProperties(){
    return WOQL.and(
    createScopedProperty("calendrical_ceremonies", "ScopedEpistemicState", ["Ceremonials", "PP"], 
        "Calendrical Ceremonies", 
        `Calendrical Ceremonies`),
    createScopedProperty("magical_ceremonies", "ScopedEpistemicState", ["Ceremonials", "PP"], 
        "Magical Ceremonies", 
        `Magical or Religious Ceremonies`),
    createScopedProperty("personal_ceremonies", "ScopedEpistemicState", ["Ceremonials", "PP"], 
        "Personal Ceremonies", 
        `Individual sponsored and communally attended ceremonies (e.g., moka, potlatch)`),
    createScopedProperty("rites_of_passage", "ScopedEpistemicState", ["Ceremonials", "PP"], 
        "Rites of passage", 
        `Rites of passage (including birth, marriage, and death ceremonies)`)
    );
}


function createFoodStorageProperties(){
    return WOQL.and(
    createScopedProperty("food_containers", "ScopedEpistemicState", ["FoodStorage", "PP"], 
        "Food Containers", 
        `IV-4-1-2 Containers for food storage`),
    createScopedProperty("food_preservation", "ScopedEpistemicState", ["FoodStorage", "PP"], 
        "Food Preservation", 
        `IV-4-1-1 Food preservation techniques`),
    createScopedProperty("household_storage", "ScopedEpistemicState", ["FoodStorage", "PP"], 
        "Household Storage", 
        `IV-4-1-3 Household food storage facilities`),
    createScopedProperty("supra_village_storage", "ScopedEpistemicState", ["FoodStorage", "PP"], 
        "Supra-Village Storage", 
        `IV-4-1-5 Supra-village food facilities.`),
    createScopedProperty("village_storage", "ScopedEpistemicState", ["FoodStorage", "PP"], 
        "Village Storage", 
        `IV-4-1-4 Village food storage facilities`),
    );
}



function createHousingProperties(){
    return WOQL.and(
    createScopedProperty("accommodation_for_guests", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Accommodation for guests", 
        `Houses with accommodations for guests`),
    createScopedProperty("accommodation_for_servants", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Accommodation for servants", 
        `Houses with accommodations for servants `),
    createScopedProperty("external_decoration", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "External Decoration", 
        `Houses with permanent external decoration`),
    createScopedProperty("internal_decoration", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Internal Decoration", 
        `Houses with permanent internal decoration`),
    createScopedProperty("multiple_public_areas", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Multiple Public Areas", 
        `Houses with multiple public or gathering areas`),
    createScopedProperty("multiple_wings", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Multiple Wings", 
        `Houses with multiple wings, atriums, patios`),
    createScopedProperty("special_storage", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Special Storage", 
        `Houses with specialized storage facilities`),
    createScopedProperty("specialized_craft_production", "ScopedEpistemicFrequency", ["HousingVariation", "PP"], 
        "Specialized Craft Production", 
        `Houses with specialized craft production facilities`),
    );
}

function createCommunityIntegrationProperties(){
    return WOQL.and(
    createScopedProperty("integration_by_common_identity", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by common identity", 
        `Community integration by common identity, dialect, subculture`),
    createScopedProperty("integration_by_common_residence", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by common residence", 
        `Community integration by common residence `),
    createScopedProperty("integration_by_kin", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by kin", 
        `Community integration by overlapping kin ties`),
    createScopedProperty("integration_by_political_ties", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by political ties", 
        `Community integration by common political ties`),
    createScopedProperty("integration_by_religion", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by religion", 
        `Community integration by common religious ties`),
    createScopedProperty("integration_by_shared_status", "ScopedEpistemicState", ["CommunityIntegration", "PP"], 
        "Integration by shared status", 
        `Community integration by common social or economic status`),
    );
}


function createBurialProperties(){
    return WOQL.and(
    createScopedProperty("animal_sacrifices", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Animal Sacrific    es", 
        `Burials with animal sacrifices`),
    createScopedProperty("exotic_objects", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Exotic Objects", 
        `Burials with exotic goods (rare or foreign materials and objects)`),
    createScopedProperty("human_sacrifices", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Human Sacrifices", 
        `Burials with human sacrifices`),
    createScopedProperty("personal_ornaments", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Personal Ornaments", 
        `Burials with personal ornaments`),
    createScopedProperty("ritual_objects", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Ritual Objects", 
        `Burials with ritual objects`),
    createScopedProperty("sumptuary_objects", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Sumptuary Objects", 
        `Burials with sumptuary goods (symbols of power or authority)`),
    createScopedProperty("tombs_or_mausoleums", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Tombs or Mausoleums", 
        `Burials in tombs or mausoleums`),
    createScopedProperty("utilitarian_goods", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Utilitarian Goods", 
        `Burials with utilitarian goods (ceramics, tools, etc.)`),
    createScopedProperty("wealth_objects", "ScopedEpistemicFrequency", ["BurialVariation", "PP"], 
        "Wealth Objects", 
        `Burials with wealth objects (fineware ceramics, gold/silver objects, etc.)`),  
    );
}

function createResilienceDependants(){
    return WOQL.and(
        createScopedProperty("ritual_complexity_change", "ScopedComplexityChange", ["DependantVariables", "Variation", "PP"], 
            "Change in Ritual Complexity", 
            `DV-4-3 Change in Communal Ritual [AR-ST-8]`),
        createScopedProperty("migration_change", "ScopedChange", ["DependantVariables", "Variation", "PP"], 
            "Change in Migration", 
            `DV-1. Migration`),
        createScopedProperty("community_size_change", "ScopedComplexityChange", ["DependantVariables", "Variation", "PP"], 
            "Change in Community Size", 
            `How much change has taken place in size and complexity`),
        createScopedProperty("famine_change", "ScopedChange", ["DependantVariables", "Variation", "PP"], 
            "Famine / Disease", 
            `DV-2. Famine and Disease.`),
        createScopedProperty("conflict_change", "ScopedChange", ["DependantVariables", "Variation", "PP"], 
            "Change in Conflict", 
            `DV-3. Conflict.  Proxied by AR-ST-3`),
        createScopedProperty("community_complexity_change", "ScopedComplexityChange", ["DependantVariables", "Variation", "PP", "Scale"], 
            "Change in Community Scale", 
            `DV-4-1.  Change in Community Scale and Complexity [AR-ST-6]`),
        createScopedProperty("regional_complexity_change", "ScopedComplexityChange", ["DependantVariables", "Variation", "PP", "Scale"], 
            "Change in Regional Complexity", 
            `DV-4-2 Change in Regional Scale and Complexity [AR-ST-7]`),
    )    
}

seshat.resilience.getEpistemicFrequency = function(){
    let choices = [
        ["scm:frequent", "Frequent", "The feature was frequent in the historical context"],
        ["scm:rare", "Rare", "The feature was rare in the historical context"],
        ["scm:never", "Never", "Never occurs"],
        ["scm:unknown_epistemic_frequency", "Unknown", "Unknown Epistemic Frequency"]
    ]
    return generateChoiceList("scm:EpistemicFrequency", "Epistemic Frequency", "The frequency of occurrence of a feature in the historical record", choices)
} 


seshat.resilience.Change = function(){
    let choices = [
        ["scm:small_decrease", "Minor Decrease", "Minor Decrease"], 
        ["scm:small_increase", "Minor Increase", "Minor Increase"],
        ["scm:stable", "Stable", "Stable, no change"],
        ["scm:big_decrease", "Dramatic Decrease", "Dramatic Decrease"], 
        ["scm:big_increase", "Dramatic Increase", "Dramatic Increase"], 
        ["scm:unknown_change", "Unknown", "Unknown Change"]
    ]
    return generateChoiceList("scm:Change", "Size of Change", "How much change has taken place", choices)
} 

seshat.resilience.ComplexityChange = function(){
    let choices = [
        ["scm:big_complexity_increase", "Radical Increase", "Radical increase in the size and/or organizational complexity"],
        ["scm:complexity_decreases", "Decreased Complexity", "Size and/or organizational complexity decreases."], 
        ["scm:complexity_increases", "Increased Complexity", "Size and/or organizational complexity increases."], 
        ["scm:organization_collapses", "Collapse", "Organization collapses."], 
        ["scm:stable_complexity", "Stable", "Size and/or organizational complexity remains stable."],
        ["scm:unknown_complexity_change", "Unknown", "The change in complexity is unknown"]
    ]
    return generateChoiceList("scm:ComplexityChange", "Change in complexity", "How much change has taken place in complexity", choices)
} 


seshat.resilience.AuthorityEmphasis = function(){ 
    let choices = [
        ["scm:egalitarian", "Egalitarian", "Egalitarian / no formal leaders"], 
        ["scm:group_solidarity", "Group Solidarity",  "emphasis placed on group solidarity and group survival"], 
        ["scm:group_priority", "Group Priority", "emphasis shared between group and leader, with greatest importance given to group survival"],
        ["scm:leader_priority", "Leader Priority", "emphasis shared between group and leader, with greatest importance given to leader survival"],
        ["scm:leader_emphasis", "Leader Emphasis", "emphasis placed on leaders as the embodiment of the group"], 
        ["scm:unknown_emphasis", "Unknown", "Unknown Emphasis"]
    ]
    return generateChoiceList("scm:AuthorityEmphasis",  "Authority Emphasis",  "Group Authority Emphasis - from leader to collective", choices)
}

seshat.resilience.AuthoritySharing = function(){
    let choices = [
        ["scm:extensive_sharing", "Extensive Sharing", "leaders share power extensively with others "], 
        ["scm:cadre_sharing", "Cadre Sharing", "leaders share power with a large cadre of other leaders"],
        ["scm:rare_sharing", "Rare Sharing", "leaders share power with a few other leaders "],
        ["scm:exclusive_sharing", "Exclusive Sharing",  "leaders exercise exclusive power"],
        ["scm:unknown_sharing", "Unknown", "Unknown authority sharing"],
        ["scm:egalitarian_sharing", "Egalitarian", "Egalitarian authority sharing"]
    ]   
    return generateChoiceList("scm:AuthoritySharing", "Authority Sharing", "The sharing of authority", choices)
}

seshat.resilience.ExternalContact = function(){
    let choices = [
        ["scm:egalitarian_contact", "Egalitarian", "Egalitarian contact access"],
        ["scm:unknown_contact", "Unknown", "Unknown external contacts"],
        ["scm:few_contacts", "Few contacts", "few or unimportant"],
        ["scm:nonexclusive_leader_participation", "Non-exclusive Participation", "external contacts are part of leaders' authority, but not exclusive"],
        ["scm:nonexclusive_leader_control", "Non-exclusive Control", "external contacts are key to leaders' authority, but not exclusive"],
        ["scm:exclusive_leader_control", "Exclusive Control", "external contacts are exclusively controlled by leaders"]
    ]
    return generateChoiceList("scm:ExternalContact", "External Contact", "Particiption in external contacts", choices)
}

seshat.resilience.LeaderDifferentiation = function(){
    let choices = [
        ["scm:no_differentiation", "No Differentiation", "No Differentiation"],
        ["scm:small_privileges", "Some Privileges", "leaders have some privileges and/or access to resources others do not"],
        ["scm:extensive_privileges", "Extensive Privileges", "leaders have extensive privileges and access to resources others do not, including special housing and sumptuary goods"],
        ["scm:exclusive_privileges", "Exclusive Privileges", "lleaders have exclusive privileges and exclusive access to special housing, resources, and sumptuary goods"],
        ["scm:unknown_differentiation", "Unknown", "Unknown differentiation"],
        ["scm:egalitarian_differentiation", "Egalitarian", "Egalitarian differentiation of leaders"]
    ]
    return generateChoiceList("scm:LeaderDifferentiation",  "Leader Differentiation",  "Differentiation among leaders and followers.", choices)
}

seshat.resilience.LeaderIdentification = function(){
    let choices = [
        ["scm:leader_treatment", "Identified by treatment", "leaders are identified by treatment or appearance"],
        ["scm:leader_symbols", "Identified by symbols", "leaders are identified by recognized symbols of power or special behaviors"],
        ["scm:leader_cult", "cult of leadership", "individual aggrandizement and/or cult of leaders"],
        ["scm:unknown_identification", "Unknown", "How the leader is identified is unknown"],
        ["scm:no_leader", "No leader", "There is no leader"],
        ["scm:egalitarian_leadership", "Egalitarian", "Egalitarian leadership"]
    ]
    return generateChoiceList("scm:LeaderIdentification", "Leader Indentification", "Mechanisms by which a leader is identified", choices)
}

seshat.resilience.Standardization = function(){
    let choices = [
        ["scm:unknown_standardization", "Unknown", "Unknown standardization levels"],
        ["scm:standardized", "Standardized", "Standardized across the board"],
        ["scm:moderately_standardized", "Moderately Standardized", "Moderately standardized (more standard than not)"], 
        ["scm:moderately_unstandardized", "Moderately Unstandardized", "Moderately Unstandardized (more unstandard than not)"],
        ["scm:no_standardization", "None", "No standardization exists"],
        ["scm:unstandardized", "Unstandardized", "Not standardized at all"]
    ]
    return generateChoiceList("scm:Standardization", "Standardization", "The standard nature of a feature", choices)
} 

/*
else if(pdata[1] == "epistemicFrequency"){
    pdata.push(seshat.rdf.urls.seshat + "hasEpistemicFrequencyChoice")
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "absent"] = "never";                     
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_epistemic_frequency";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
} 

else if(pdata[1] == "leaderIdentification"){
    pdata.push(seshat.rdf.urls.seshat + "leader_identification_choice")
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "egalitarian"] = "egalitarian_leadership";                     
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_identification";  
    value_map[seshat.rdf.urls.seshat + "none"] = "no_leader";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
} 
else if(pdata[1] == "leaderDifferentiation"){
    pdata.push(seshat.rdf.urls.seshat + "leader_differentiation_type")
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "egalitarian"] = "egalitarian_differentiation";                     
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_identification";  
    value_map[seshat.rdf.urls.seshat + "none"] = "no_differentiation";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
} 
else if(pdata[1] == "authorityEmphasis"){
    pdata.push(seshat.rdf.urls.seshat + "authority_emphasis_choice")
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_emphasis";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
} 
else if(pdata[1] == "standardization"){
    pdata.push(seshat.rdf.urls.seshat + "has_standardization")
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "unknown"] = "unknown_standardization";  
    value_map[seshat.rdf.urls.seshat + "none"] = "no_standardization";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
} 

else if(pdata[1] == "change"){
    pdata.push(seshat.rdf.urls.seshat + "has_change_size");
    pdata.push(seshat.rdf.transparentValueMap(oprop))
}
else if(pdata[1] == "complexityChange"){
    pdata.push(seshat.rdf.urls.seshat + "community_size_change");
    pdata.push(seshat.rdf.transparentValueMap(oprop))            
}      

else if(pdata[1] == "externalContact"){
    pdata.push(seshat.rdf.urls.seshat + "external_contact_choice");
    var value_map = {}
    value_map[seshat.rdf.urls.seshat + "egalitarian"] = "egalitarian_contact";  
    pdata.push(seshat.rdf.generateValueMap(value_map, seshat.rdf.transparentValueMap(oprop)));            
}  



seshat.properties.extended = {
    rites_of_passage: [],
    personal_ceremonies: [],
    calendrical_ceremonies: [],
    perissodactyla: ["horselike_animals"],
    artiodactyla: ["sheeplike_animals"],
    birds: [],
    cereals: [],
    fertilizers: [],
    legumes: [],
    multicropping: ["multi_cropping"],
    polyculture: [],
    alternative_food: [],
    regional_crops: [],
    rodentia: ["small_mammals"],
    curcurbitales: ["squashes"],
    solanales: ["vegetables"],
    aquatic_mammals: [],
    osteichthyes: ["freshwater_fish"],
    herbs: ["gathered_herbs"],
    bird_hunting: ["hunted_birds"],
    insects: ["insects_grubs_honey"],
    large_game: [],
    small_game: [],
    raptilia: ["marine_reptiles"],
    mollusks: [],
    saltwater_fish: [],
    shellfish: [],
    tree_pith: [],
    wild_roots: [],
    agricultural_terracing: [],
    food_containers: [],
    food_preservation: [],
    household_storage: [],
    supravillage_storage: ["supra_village_storage"],
    village_storage: [],
    common_identity: ["integration_by_common_identity"],
    common_residence: ["integration_by_common_residence"],
    common_kin: ["integration_by_kin"],
    common_politics: ["integration_by_political_ties"],
    common_religion: ["integration_by_religion"],
    common_status: ["integration_by_shared_status"],
    
    guest_accommodation: ["accommodation_for_guests", "epistemicFrequency"],
    servant_accommodation:  ["accommodation_for_servants", "epistemicFrequency"],
    external_decoration: [false, "epistemicFrequency"],
    internal_decoration: [false, "epistemicFrequency"],
    multiple_public_areas: [false, "epistemicFrequency"],
    multiple_wings: [false, "epistemicFrequency"],
    special_storage: [false, "epistemicFrequency"],
    special_craft: ["specialized_craft_production", "epistemicFrequency"],
    animal_sacrifices: [false, "epistemicFrequency"],
    exotic_goods: ["exotic_objects", "epistemicFrequency"],
    human_sacrifices: [false, "epistemicFrequency"],
    personal_ornaments: [false, "epistemicFrequency"],
    ritual_objects: [false, "epistemicFrequency"],
    sumptuary_goods: ["sumptuary_objects", "epistemicFrequency"],
    tombs_or_mausoleums: [false, "epistemicFrequency"],
    utilitarian_goods: [false, "epistemicFrequency"],
    wealth_objects: [false, "epistemicFrequency"],
    
    leader_identification: [false, "leaderIdentification"],
    leader_differentiation: [false, "leaderDifferentiation"],
    authority_emphasis: [false, "authorityEmphasis"],
    external_contacts: [false, "externalContact"],
    ritual_standardization: [false, "standardization"],
    home_standardization: [false, "standardization"],
    public_standardization: [false, "standardization"],
    fineware_standardization: [false, "standardization"],
    conflict_change: [false, "change"],
    famine_change: [false, "change"],
    migration_change: [false, "change"],
    community_size_change: [false, "complexityChange"],
    regional_complexity_change: [false, "complexityChange"],
    community_complexity_change: [false, "complexityChange"],
    ritual_complexity_change: [false, "complexityChange"]
    

}*/