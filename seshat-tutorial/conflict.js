seshat.conflict = {}

seshat.conflict.documentClasses = function(){
    return WOQL.and(
        WOQL.doctype("Conflict")
            .label("Conflict")
            .description("A conflict event of some type")
            .parent("Military"),
        WOQL.add_class("Battle")
            .label("Battle")
            .description("A battle is a continuous physical confrontation between groups, typically lasting hours or days.")
            .parent("Conflict"),
        WOQL.add_class("MetaConflict")
            .label("Meta-Conflict")
            .description("This concept covers groups of conflicts that span a much larger time-frame between the belligerents. For example, the 'First', 'Second' and 'Third Punic' wars are conflicts within the Roman-Carthage meta-conflict. These wars are coded as separate wars, and linked to a 'Roman-Carthage' meta-conflict rather than coding a single centuries-long war.")
            .parent("Conflict"),
        WOQL.add_class("Siege")
            .label("Siege")
            .description("Siege' is a generic name for any interaction between an army and a settlement belonging to opposing factions. If an army entered a hostile city with minimal or no resistance, this is also considered a siege. ")
            .parent("Conflict"),
        WOQL.add_class("War")
            .label("War")
            .description("A war is defined as an armed conflict which may comprise many battles (and other forms of non-physical conflict).")
            .parent("Conflict")
    )
}

seshat.conflict.thematicClasses = function(parent){
    return WOQL.and(
        WOQL.add_class("HPI")
            .label("HPI")
            .description("Human Peace Index Variables"),
    )     

}
seshat.conflict.structuralClasses = function(){
    return WOQL.and(
        WOQL.add_class("CulturalDistance")
            .label("Cultural Distance")
            .description("The cultural distance between groups."),
        WOQL.add_class("ConflictConsequences")
            .parent("Conflict")
            .label("Consequences of Conflict")
            .description("The consequences of a conflict."),
    )
}

seshat.conflict.simpleProperties = function(){
    return WOQL.and(
        createUnscopedProperty("belligerent", "PoliticalAuthority",  
            "Belligerent", 
            `A list of all belligerents involved in the conflict`, "Conflict"),
        createUnscopedProperty("consequences", "ConflictConsequences", ["Conflict"], 
            "Consequences For Territories", 
            `For each war / internal conflict, code the following variables concerning 
            the consequences of the conflict for the parties involved.`,"Conflict"),         
        createUnscopedProperty("cultural_distance", "CulturalDistance", ["Conflict"], 
            "Cultural Distance", 
            `The cultural distance between groups involved in the conflict.`,"Conflict", "Conflict")
    )
}


seshat.conflict.scopedProperties = function() {
    return WOQL.and(
        createScopedProperty("interpolity_war", "ScopedEpistemicState", ["Military", "HPI"], 
            "Inter-Polity War", 
            `This variable tells us whether this was an external (inter-state) 
            war (code Present), or internal (civil) war (code Absent).`, "Conflict"),
        createScopedProperty("intraelite_war", "ScopedEpistemicState", ["Military", "HPI"], 
            "Intra-elite War", 
            `Between different elite factions`, "Conflict"),
        createScopedProperty("popular_uprising", "ScopedEpistemicState", ["Military", "HPI"], 
            "Popular Uprising", 
            `A broadly based rebellion in which commoners (non-elites) are the major component.
            It can take place in the central regions of the polity, or in peripheral regions 
            (in which case a separatist rebellion can also be coded as present), or both.`,
            "Conflict"),
        createScopedProperty("separatist_rebellion", "ScopedEpistemicState", ["Military", "HPI"], 
            "Separatist Rebellion", 
            `Rebellion in a region aiming to secede from the centre.`, "Conflict"),
        createScopedProperty("violent_civil_conflict", "ScopedEpistemicState", ["Military", "HPI"], 
            "Violent Civil Conflict", 
            `A violent civil conflict (riots, pogroms, etc)`, "Conflict"),
        createScopedProperty("oppression_extermination", "ScopedEpistemicState", ["Military", "HPI"], 
            "Oppression / Extermination", 
            `'Purges' of some community or interest group within a polity by the state, e.g.
            the violent persecution of religious minorities under the Sassanid Persian Empire.`, "Conflict"),
        createScopedProperty("urban_riots", "ScopedEpistemicState", ["Military", "HPI"], 
            "Urban Riots", 
            `Urban Riots.`, "Conflict"),
        createScopedProperty("rural_succession", "ScopedEpistemicState", ["Military", "HPI"], 
            "Rural Succession", 
            `Succession of rural areas from urban center`, "Conflict"),
        createScopedProperty("military_revolt", "ScopedEpistemicState", ["Military", "HPI"], 
            "Military Revolt", 
            `Insurrection lead by a military leader involving components of armed forces.`, "Conflict"),
    )
}

seshat.conflict.culturalDistanceProperties = function(){
    return WOQL.and(
        createUnscopedProperty("between", "PoliticalAuthority", "Between", 
            `The groups that the cultural distance is between`, "CulturalDistance"),
        createScopedProperty("different_dialects", "ScopedEpistemicState", ["Language", "HPI"], 
            "Different Dialects", 
            `Opponent groups perceive each other as having distinct ethnic identities 
            demarcated by a significant dialectal difference,
            but still speaking a mutually comprehensible language but within the same linguistic group.`, 
            "CulturalDistance"),
        createScopedProperty("different_languages", "ScopedEpistemicState", ["Language", "HPI"], 
            "Different Languages", 
            `The opponent groups speak mutually unintelligible languages, but similarites between 
            languages are apparent to them. Examples include English and Dutch, or Italian and Spanish,
            but not English and Italian (although both are Indo-European languages, the kinship 
            between them is not apparent to a nonspecialist).`,"CulturalDistance"),           
        createScopedProperty("same_ethnic_group", "ScopedEpistemicState", ["HPI"], 
            "Same Ethnic Group", 
            `Both sides come from the same ethnic group and speak the same 
            dialect of the common language. Most civil wars will
            fall into this category, unless there is a signiﬁcant cultural 
            distance between the two parties.`,"CulturalDistance"),           
        createScopedProperty("different_language_families", "ScopedEpistemicState", ["Language", "HPI"], 
            "Different Language Families", 
            `The opponent groups speak mutually unintelligible languages that have no similarities 
            apparent to them. Examples include English and Chinese, or Italian and Hindu 
            (although in the second example both are Indo-European languages, the kinship 
            between them is not apparent to a nonspecialist).`,"CulturalDistance"),           
        createScopedProperty("different_religious_sects", "ScopedEpistemicState", ["Religion", "HPI"], 
            "Different Religious Sects", 
            `This refers to different religious denominations within the same world religion. 
            E.g., Catholics vs. Protestants, or Shiites vs. Sunnis.`,"CulturalDistance"),           
        createScopedProperty("different_world_religions", "ScopedEpistemicState", ["Religion", "HPI"], 
            "Different World Religions", 
            `Taoism, Confucianism (China), Hinduism, Buddhism, Jainism, Sikhism (India), 
            Zoroastrianism, Judaism, ChrisEanity, Islam (Middle East).`,"CulturalDistance"),           
        createScopedProperty("world_religion_against_tribal_religion", "EpistemicState", ["Religion", "HPI"], 
            "World Religion Against Tribal Religion", 
            `E.g., Christian European settlers vs. Native American Indians.`,"CulturalDistance"),           
        createScopedProperty("civilization_barbarism_frontier", "ScopedEpistemicState", ["HPI"], 
            "Civilization/Barbarism Frontier", 
            `'Civilization' refers to cultures with developed urbanism and literacy 
            (indicated by written records), and 'barbarism' 
            (in the non-pejorative sense) is a culture without developed urbanism and literacy.`,"CulturalDistance"),           
        createScopedProperty("steppe_frontier", "ScopedEpistemicState", ["HPI"], 
            "Steppe Frontier", 
            `Settled agriculturalists vs. nomadic pastoralists.`,"CulturalDistance"),           
        createScopedProperty("agricultural_frontier", "ScopedEpistemicState", ["HPI"], 
            "Agricultural Frontier", 
            `Settled agriculturalists vs. hunter-gatherers.`,"CulturalDistance"),           
        createScopedProperty("steppe_frontier", "ScopedEpistemicState", ["HPI"], 
            "Steppe Frontier", 
            `Settled agriculturalists vs. nomadic pastoralists.`,"CulturalDistance"),           
    )
}

seshat.conflict.consequencesProperties = function(){
    return WOQL.and(
        createScopedProperty("no_consequences", "ScopedEpistemicState", ["Conflict"], 
            "No Consequences", 
            `The war / conflict has no consequences for the territories / parties involved.`,
            "ConflictConsequences"),           
        createScopedProperty("annexation", "ScopedEpistemicState", ["Conflict"], 
            "Annexation", 
            `The war / conflict results in annexation.`,
            "ConflictConsequences"),           
        createScopedProperty("annexation", "ScopedEpistemicState", ["Conflict"], 
            "Annexation", 
            `The war / conflict results in annexation.`,
            "ConflictConsequences"),           
        createScopedProperty("looting", "ScopedEpistemicState", ["Conflict"], 
            "Looting", 
            `The war / conflict results in looting.`,
            "ConflictConsequences"),           
        createScopedProperty("sacking", "ScopedEpistemicState", ["Conflict"], 
            "Sacking", 
            `The war / conflict results in sacking.`,
            "ConflictConsequences"),           
        createScopedProperty("rape", "ScopedEpistemicState", ["Conflict"], 
            "Rape", 
            `The war / conflict results in rape.`,
            "ConflictConsequences"),           
        createScopedProperty("deportation", "ScopedEpistemicState", ["Conflict"], 
            "Deportation", 
            `The war / conflict results in deportation.`,
            "ConflictConsequences"),           
        createScopedProperty("expulsion", "ScopedEpistemicState", ["Conflict"], 
            "Expulsion", 
            `The war / conflict results in expulsion.`,
            "ConflictConsequences"),           
        createScopedProperty("enslavement", "ScopedEpistemicState", ["Conflict"], 
            "Enslavement", 
            `The war / conflict results in enslavement.`,
            "ConflictConsequences"),           
        createScopedProperty("imprisonment", "ScopedEpistemicState", ["Conflict"], 
            "Imprisonment", 
            `The war / conflict results in imprisonment.`,
            "ConflictConsequences"),           
        createScopedProperty("destruction", "ScopedEpistemicState", ["Conflict"], 
            "Destruction", 
            `The war / conflict results in destruction.`,
            "ConflictConsequences"),           
        createScopedProperty("torture", "ScopedEpistemicState", ["Conflict"], 
            "Torture", 
            `The war / conflict results in torture.`,
            "ConflictConsequences"),           
        createScopedProperty("mutilation", "ScopedEpistemicState", ["Conflict"], 
            "Mutilation", 
            `The war / conflict results in mutilation.`,
            "ConflictConsequences"),           
        createScopedProperty("targeted_massacre", "ScopedEpistemicState", ["Conflict"], 
            "Targeted Massacre", 
            `The war / conflict results in targetted massacre..`,
            "ConflictConsequences"),           
        createScopedProperty("torture", "ScopedEpistemicState", ["Conflict"], 
            "Torture", 
            `The war / conflict results in torture.`,
            "ConflictConsequences"),           
        createScopedProperty("general_massacre", "ScopedEpistemicState", ["Conflict"], 
            "General Massacre", 
            `The war / conflict results in general massacre.`,
            "ConflictConsequences"),           
        createScopedProperty("torture", "ScopedEpistemicState", ["Conflict"], 
            "Torture", 
            `The war / conflict results in torture.`,
            "ConflictConsequences"),           
        createScopedProperty("extermination", "ScopedEpistemicState", ["Conflict"], 
            "Extermination", 
            `The war / conflict results in extermination.`,
            "ConflictConsequences"),           
        createScopedProperty("ethnocide", "ScopedEpistemicState", ["Conflict"], 
            "Ethnocide", 
            `The war / conflict results in ethnocide.`,
            "ConflictConsequences")
        );
}

