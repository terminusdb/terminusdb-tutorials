function getClasses(){
    return WOQL.and(
        getThematicClasses(), 
        getDocumentClasses(), 
        getStructuralClasses()
    );
}

function getDocumentClasses(){
    var woqls = WOQL.and(
        WOQL.doctype("Organization")
            .label("Organization")
            .description("A human organization of any type - has the capacity to act as a unit, in some sense")
            .abstract(),
        WOQL.add_class("PoliticalAuthority")
            .label("Political Authority")
            .description("A human social group with some autonomous political authority.")
            .parent("Organization", "Politics"),
        WOQL.add_class("Polity")
            .label("Polity")
            .description("A polity is defined as an independent political unit. Kinds of polities range from villages (local communities) through simple and complex chiefdoms to states and empires. A polity can be either centralized or not (e.g., organized as a confederation). What distinguishes a polity from other human groupings and organizations is that it is politically independent of any overarching authority; it possesses sovereignty. Polities are defined spatially by the area enclosed within a boundary on the world map. There may be more than one such areas. Polities are dynamical entities, and thus their geographical extent may change with time. Thus, typically each polity will be defined by a set of multiple boundaries, each for a specified period of time. For prehistoric periods and for areas populated by a multitude of small-scale polities we use a variant called quasi-polity.")
            .parent("PoliticalAuthority"),
        WOQL.add_class("QuasiPolity")
            .label("Quasi-Polity")
            .description("The polity-based approach is not feasible for those periods when a region is divided up among a multitude of small-scale polities (e.g., independent villages or even many small chiefdoms). In this instance we use the concept of 'quasi-polity'. Similarly, for societies known only archaeologically we may not be able to establish the boundaries of polities, even approximately. Quasi-polity is defined as a cultural area with some degree of cultural homogeneity (including linguistic, if known) that is distinct from surrounding areas. For example, the Marshall Islands before German occupation had no overarching native or colonial authority (chiefs controlled various subsets of islands and atolls) and therefore it was not a polity. But it was a quasi-polity because of the significant cultural and linguistic uniformity.<P>We collect data for the quasi-polity as a whole. This way we can integrate over (often patchy) data from different sites and different polities to estimate what the 'generic' social and political system was like. Data is not entered for the whole region but for a 'typical' polity in it. For example, when coding a quasi-polity, its territory is not the area of the region as a whole, but the average or typical area of autonomous groups within the NGA.")
            .parent("PoliticalAuthority"),
        WOQL.add_class("SubPolity")
            .label("Sub-Polity")
            .description("A human social group that has some governing authority within a specific region or area of a polity - used to describe regional governments, etc.")
            .parent("PoliticalAuthority"),
        WOQL.add_class("SupraculturalEntity")
            .label("Supra-Cultural Entity")
            .description("Political Authority entities are often embedded within larger-scale cultural groupings of polities or quasipolities. These are sometimes referred to as 'civilizations'. For example, medieval European kingdoms were part of Latin Christendom. During the periods of disunity in China, warring states there, nevertheless, belonged to the same Chinese cultural sphere. Archaeologists often use 'archaeological traditions' to denote such large-scale cultural entities (for example, Peregrine's Atlas of Cultural Evolution). Note, 'supracultural entity' refers to cultural interdependence, and is distinct from a political confederation or alliance, which should be coded under 'supra-polity relations.'.")
            .parent("Organization"),
        WOQL.add_class("InterestGroup")
            .label("Interest Group")
            .description("An Interest Group (IG) is a social group that pursues some common interest, so that its members are united by a common goal or goals. Polities and religious cults are also interest groups, but this category is broader. It also includes ethnic groups, professional associations, warrior bands, solidarity associations, mutual aid societies, firms and banks (including their pre-modern variants), etc. The Interest Group is defined sociologically, not geographically. However, a geographic area, enclosed within a boundary, refering to its area of operation, may be associated with it in the same way as with a polity or a Religious System(RS). ")
            .parent("Organization"),
        WOQL.add_class("ReligiousSystem")
            .label("Religious System")
            .description("Religious System (RS). This unit is defined in ways that are analogous to a polity, except it reflects religious, rather than political authority. Religious systems are dynamical and are typically defined by a set of dated boundaries. Unlike polities, religious systems often overlap with each other.")
            .parent("InterestGroup", "Religion"),
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
            .parent("Conflict"),
        WOQL.doctype("Settlement")
            .label("Settlement")
            .description("A semi-permanent or permanent human settlement")
            .parent("Organization", "Housing"),
        WOQL.add_class("City")
            .label("City")
            .description("A concentrated human settlement, typically large")
            .parent("Settlement"),            
        WOQL.doctype("UnitOfTerritory")
            .label("Unit of Territory")
            .description("A free-form unit of territory"),            
        WOQL.add_class("NaturalGeographicArea")
            .label("NGA")
            .description("Natural Geographic Area (NGA). This type of unit is defined spatially by the area enclosed within a boundary drawn on the world map. It does not change with time. Its rough spatial scale is 100 km x 100 km (+/- 50%). Examples: Latium, Upper Egypt, Middle Yellow River Valley."),            
        WOQL.doctype("CitedWork").label("Cited Work").property("remote_url", "xsd:anyURI"),
    );
    return woqls;
}

function getStructuralClasses(){
    var woqls = WOQL.and(
        WOQL.add_class("Building")
            .label("Building")
            .description("A specific building.")
            .parent("Construction"),
        WOQL.add_class("PracticedRitual")
            .label("Practiced Ritual")
            .description("A ritual as practiced by a specific group.")
            .parent("Ritual"),        
        WOQL.add_class("Note").label("A Note on a value")
            .description("Editorial note on the value")
            .property("citation", "scm:CitedWork")
            .property("quotation", "xsd:string"),
        WOQL.add_class("ScopedValue")
            .abstract()
            .property("start", "xdd:integerRange")
            .property("end", "xdd:integerRange")
            .property("confidence", "scm:Confidence")
            .property("notes", "scm:Note")
    );
    return woqls;
}

function getThematicClasses(){
    var woqls = WOQL.and(
        WOQL.add_class("PP")
            .label("PP")
            .description("Peter Peregrine Variables"),
        WOQL.add_class("HPI")
            .label("HPI")
            .description("Human Peace Index Variables"),
        WOQL.add_class("SocialComplexity")
            .label("Social Complexity")
            .description("Social Complexity Variables"),
        WOQL.add_class("Variation")
            .label("Variation")
            .description("Variation within a group"),
        WOQL.add_class("Politics")
            .label("Politics")
            .description("Dealing with political authority and organization"),     
        WOQL.add_class("Legal")
            .label("Legal")
            .description("Dealing with legal matters")
            .parent("Politics"),
        WOQL.add_class("Work")
            .label("Work")
            .description("Dealing with work"),
        WOQL.add_class("Food")
            .label("Food")
            .description("Dealing with food"),
        WOQL.add_class("Ritual")
            .label("Ritual")
            .description("Dealing with rituals"),
        WOQL.add_class("Burial")
            .label("Burial")
            .description("Dealing with burials")
            .parent("Ritual"),
        WOQL.add_class("Finance")
            .label("Finance")
            .description("Dealing with financial affairs")
            .parent("Politics"),
        WOQL.add_class("Money")
            .label("Money")
            .description("Dealing with money"),
        WOQL.add_class("Economics")
            .label("Economics")
            .description("Dealing with Economics"),
        WOQL.add_class("Agriculture")
            .label("Agriculture")
            .description("Dealing with agricultural matters")
            .parent("Food"),
        WOQL.add_class("Fishing")
            .label("Fishing")
            .description("Dealing with fishing matters")
            .parent("Food"),
        WOQL.add_class("Hunting")
            .label("Hunting")
            .description("Dealing with hunting matters")
            .parent("Food"),
        WOQL.add_class("Military")
            .label("Military")
            .description("Dealing with Military matters"),
        WOQL.add_class("Mining")
            .label("Mining")
            .description("Dealing with Mining and Mineral Extraction"),
        WOQL.add_class("Minerals")
            .label("Minerals")
            .description("Dealing with Minerals"),
        WOQL.add_class("Metals")
            .label("Metals")
            .description("Dealing with Metals")
            .parent("Minerals"),
        WOQL.add_class("Transport")
            .label("Transport")
            .description("Dealing with Transport matters"),
        WOQL.add_class("Communication")
            .label("Communication")
            .description("Dealing with Communication"),
        WOQL.add_class("Science")
            .label("Science")
            .description("Dealing with scientific method"),
        WOQL.add_class("Writing")
            .label("Writing")
            .description("Dealing with written word"),
        WOQL.add_class("Literature")
            .label("Literature")
            .description("Dealing with literature"),
        WOQL.add_class("Ideology")
            .label("Ideology")
            .description("Dealing with Ideological matters"),
        WOQL.add_class("Religion")
            .label("Religion")
            .description("Dealing with Religious matters")            
            .parent("Ideology"),
        WOQL.add_class("God")
            .label("God")
            .description("Relating with the concept of a god or gods")            
            .parent("Religion"),
        WOQL.add_class("Construction")
            .label("Construction")
            .description("Dealing with Construction matters"),
        WOQL.add_class("Housing")
            .label("Housing")
            .description("Dealing with housing matters")
            .parent("Construction"),
        WOQL.add_class("Public")
            .label("Public")
            .description("Dealing with public, collective characteristics, decision making, etc"),
        WOQL.add_class("Private")
            .label("Private")
            .description("Dealing with private, individual or factional decision making"),
        WOQL.add_class("InternalAffairs")
            .label("Internal Affairs")
            .description("Dealing with a group's internal organisation"),
        WOQL.add_class("ExternalAffairs")
            .label("External Affairs")
            .description("Dealing with a group's external affairs"),
        WOQL.add_class("Scale")
            .label("Scale")
            .description("Dealing with Social Scale"),
        WOQL.add_class("BureaucraticSystem")
            .label("Bureaucratic System")
            .description("A bureaucratic system, decisions are made by office holders")
            .parent("InternalAffairs", "Politics"),
        WOQL.add_class("AgriculturalDiversity")
            .label("Agricultural Diversity")
            .description("IV-4-2. Agricultural Diversity [AR-SV-3; AR-SV-5].")
            .parent("Variation", "PP", "Agriculture"),
        WOQL.add_class("AgriculturalDiversity")
            .label("Alternative Food Sources.")
            .description("IV-4-3. Alternative Food Sources. [AR-SV-7] [AR-SV-9] [AR-SV-11] ")
            .parent("Food", "PP"),
        WOQL.add_class("HierarchicalComplexity")
            .label("Hierarchical Complexity")
            .description("Encodes the number of levels in the most important hierarchies of a social system.")
            .parent("SocialComplexity"),
        WOQL.add_class("MonetarySystem")
            .label("Monetary System")
            .description("The System that produces money")
            .parent("Finance", "Money", "Economics"),
        WOQL.add_class("Infrastructure")
            .label("Infrastructure")
            .description("The built infrastructure that a society depends upon")
            .parent("Construction"),
        WOQL.add_class("PostalSystem")
            .label("Postal System")
            .description("A system for sending physical messages")
            .parent("Communication", "Infrastructure", "Transport"),
        WOQL.add_class("Professions")
            .label("Professions")
            .description("A system of professional work")
            .parent("Work"),
        WOQL.add_class("PubliclyOwnedUtilitarianBuildings")
            .label("Publicly Owned Utilitarian Buildings")
            .description("Publicly Owned Buildings of a Utilitarian Nature")
            .parent("Public", "Construction", "Infrastructure"),            
        WOQL.add_class("ReligionRitual")
            .label("Religion and Ritual")
            .description("Religious and ritual matters")
            .parent("Religion", "Ritual"),            
        WOQL.add_class("SpecialSites")
            .label("Special Sites")
            .description("Sites not associated with residential areas. This position is primarily useful for coding archaneologically known societies.")
            .parent("Infrastructure", "Construction"),            
        WOQL.add_class("SpecializedBuildings")
            .label("Specialized Buildings")
            .description("Polity-owned: includes owned by the community, or the state.")
            .parent("Public", "Construction"),            
        WOQL.add_class("DependantVariables")
            .label("Dependant")
            .description("Variables that are dependent on other variables."),            
        WOQL.add_class("SupraPolityRelations")
            .label("Supra-Polity Relations")
            .description("Relating to relationships between polities.")
            .parent("ExternalAffairs"),
        WOQL.add_class("TransportInfrastructure")
            .label("Transport Infrastructure")
            .description("Relating to Transport Infrastructure.")
            .parent("Transport", "Infrastructure"),            
        WOQL.add_class("WritingGenre")
            .label("Written Genres")
            .description("Relating to different types of written material.")
            .parent("Literature","SocialComplexity"),            
        WOQL.add_class("WritingSystem")
            .label("Writing System")
            .description("Relating to different types of a writing system.")
            .parent("Writing", "SocialComplexity"),            
        WOQL.add_class("Naval")
            .label("Naval")
            .description("Dealing with naval matters"),            
        WOQL.add_class("Entertainment")
            .label("Entertainment")
            .description("Dealing with entertainment"),            
        WOQL.add_class("FoodStorage")
            .label("Food Storage")
            .description("IV-4-1. Food Storage.")
            .parent("Food", "PP"),            
        WOQL.add_class("Ceremonials")
            .label("Ceremonials")
            .description("Prominent Community Ceremonials [AR-TL-6] (based on Murdock and Wilson 1972).")
            .parent("Ritual", "Public", "PP"),            
        WOQL.add_class("HousingVariation")
            .label("Housing Variation")
            .description("Variation in housing or house compounds. ")
            .parent("Housing", "Variation"),            
        WOQL.add_class("BurialVariation")
            .label("Burial Variation")
            .description("Variation in burials and burial goods ")
            .parent("Burial", "Variation"),            
        WOQL.add_class("HighGods")
            .label("High Gods")
            .description("A high god follows the definition of Guy Swanson (1960: chapter III and appendix 1) as \"a spiritual being who is believed to have created all reality and/or to be its ultimate governor, even though his sole act was to create other spirits who, in turn, created or control the natural world\"... (1) \"Absent or not reported,\" (2) \"Present but not active in human affairs,\" (3) \"Present and active in human affairs but not supportive of human morality\" and (4) \"Present, active, and specifically supportive of human morality\" (Divale 2000).\"")
            .parent("Religion", "God"),            
        WOQL.add_class("CorporateExclusionary")
            .label("Corporate Exclusionary")
            .description("A characteristic relating the corporate / exclusionary spectrum")
            .parent("PP", "InternalAffairs", "Politics"),            
        WOQL.add_class("LoosenessTightness")
            .label("Looseness Tightness")
            .description("A characteristic relating the Looseness Tightness spectrum, IV-2. Looseness-Tightness Index.")
            .parent("PP", "InternalAffairs", "Politics"),            
        WOQL.add_class("AuthorityEmphasis")
            .label("Authority Emphasis")
            .description("A characteristic relating to Where the emphasis of group authority lies")
            .parent("PP", "InternalAffairs", "Politics"),            
        WOQL.add_class("AuthoritySharing")
            .label("Authority Sharing")
            .description("A characteristic relating to how authority is shared between leaders and others")
            .parent("PP", "InternalAffairs", "Politics"),            
        WOQL.add_class("CommunityIntegration")
            .label("Community Integration")
            .description("A characteristic relating to Community integration, sum of scores [AR-TL-5] (based on Murdock and Wilson 1972)")
            .parent("PP", "InternalAffairs", "Politics"),            
        WOQL.add_class("Leadership")
            .label("Leadership")
            .description("How the leaders are identified, etc")
            .parent("PP", "Variation", "InternalAffairs", "Politics"),            
        WOQL.add_class("MeasurementSystem")
            .label("Measurement System")
            .description("Textual evidence of a measurement system: measurement units are named in sources (e.g. pound, aroura). Archaeological evidence includes finding containers of standard volume, etc. ('inferred presence')")
            .parent("Science", "SocialComplexity"),            
    );
    return woqls;
}

