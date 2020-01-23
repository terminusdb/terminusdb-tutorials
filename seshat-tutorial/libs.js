const seshat_libs = `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix terminus: <http://terminusdb.com/schema/terminus#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix xdd: <http://terminusdb.com/schema/xdd#> .
@prefix vio: <http://terminusdb.com/schema/vio#> .
@prefix tcs: <http://terminusdb.com/schema/tcs#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

tcs:Document
	tcs:tag tcs:abstract ;
	a owl:Class ;
	rdfs:comment "A class used to designate the primary data objects managed by the system - relationships and entities"@en ;
	rdfs:label "Document Class"@en .

tcs:Enumerated
	tcs:tag tcs:abstract ;
	a owl:Class ;
	rdfs:comment "A class representing enumerated types / choice sets"@en ;
	rdfs:label "Enumerated Set"@en .

tcs:abstract
	a tcs:ClassTag ;
	rdfs:comment "Indicates that the class is abstract - purely a logical construct, no base instantiations exist"@en ;
	rdfs:label "Abstract"@en .

xdd:coordinate
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A longitude / latitude pair making up a coordinate."@en ;
	rdfs:label "Coordinate"@en .

xdd:coordinatePolygon
	tcs:refines xdd:coordinatePolyline ;
	a rdfs:Datatype ;
	rdfs:comment "A JSON list of coordinates forming a closed polygon."@en ;
	rdfs:label "Coordinate Polygon"@en .

xdd:coordinatePolyline
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A JSON list of coordinates."@en ;
	rdfs:label "Coordinate Polyline"@en .

xdd:dateRange
	tcs:refines xdd:range ;
	a rdfs:Datatype ;
	rdfs:comment "A date (YYYY-MM-DD) or an uncertain date range [YYYY-MM-DD1,YYYY-MM-DD2]. Enables uncertainty to be encoded directly in the data"@en ;
	rdfs:label "Date Range"@en .

xdd:decimalRange
	tcs:refines xdd:range ;
	a rdfs:Datatype ;
	rdfs:comment "Either a decimal value (e.g. 23.34) or an uncertain range of decimal values (e.g.[23.4, 4.143]. Enables uncertainty to be encoded directly in the data"@en ;
	rdfs:label "Decimal Range"@en .

xdd:email
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A valid email address"@en ;
	rdfs:label "Email"@en .

xdd:html
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A string with embedded HTML"@en ;
	rdfs:label "HTML"@en .

xdd:integerRange
	tcs:refines xdd:range ;
	a rdfs:Datatype ;
	rdfs:comment "Either an integer (e.g. 30) or an uncertain range of integers [28,30]. Enables uncertainty to be encoded directly in the data"@en ;
	rdfs:label "Integer Range"@en .

xdd:json
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A JSON encoded string"@en ;
	rdfs:label "JSON"@en .

xdd:url
	tcs:refines xsd:string ;
	a rdfs:Datatype ;
	rdfs:comment "A valid http(s) URL"@en ;
	rdfs:label "URL"@en .

    scm:BoxedDatatypes 
	a owl:Ontology;
	rdfs:comment "Boxed datatypes allow complex datatype properties with scoping, annotations, etc, it does this by creating pseudo classes and properties by punning names"@en ;
	rdfs:label "Boxed Datatypes"@en .

scm:Box
  a owl:Class ;
  rdfs:label "Box Class"@en ;
  tcs:tag tcs:abstract ;
  rdfs:comment "Box super-class capturing all classes that are primarily used for annotating datatypes"@en .

scm:AnySimpleType
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Any Simple Type"@en ;
  rdfs:comment "Any simple type - super class of all basic datatypes"@en .

scm:String
  a owl:Class ;
  rdfs:subClassOf scm:Box;
  rdfs:label "String"@en ;
  rdfs:comment "A string of characters"@en .

scm:Boolean
  a owl:Class ;
  rdfs:subClassOf scm:Box;
  rdfs:label "Boolean"@en ;
  rdfs:comment "An annotated boolean: true/false value"@en .

scm:Decimal
  a owl:Class ;
  rdfs:subClassOf scm:Box;
  rdfs:label "Decimal"@en ;
  rdfs:comment "An annotated decimal value"@en .

scm:Double
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Double"@en ;
  rdfs:comment "An annotated double precision floating point number"@en .

scm:Float
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Float"@en ;
  rdfs:comment "An annotated floating point number"@en .

scm:Time
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Time"@en ;
  rdfs:comment "An annotated xsd:time (HH:MM:SS) value"@en .

scm:Date
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Date"@en ;
  rdfs:comment "An annotated xsd:date value (YYYY-MM-DD)"@en .

scm:DateTime
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Date Time"@en ;
  rdfs:comment "An annotated xsd:dateTime value (YYYY-MM-DDTHH:MM:SS)"@en .

scm:DateTimeStamp
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Date-Time Stamp"@en ;
  rdfs:comment "An annotated xsd:dateTimeStamp - (timezone is required)"@en .

scm:GYear
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Year"@en ;
  rdfs:comment "An annotated xsd:gYear (format: YYYY 4 numbers)"@en .

scm:GMonth
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Month"@en ;
  rdfs:comment "An annotated xsd:gMonth datatype (format: --MM)"@en .

scm:GDay
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Day"@en ;
  rdfs:comment "An annotated xsd:gDay (format: ---DD)"@en .

scm:GYearMonth
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Year-Month"@en ;
  rdfs:comment "An annotated xsd:gYearMonth (format: YYYY-MM)"@en .

scm:GMonthDay
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Month-Day"@en ;
  rdfs:comment "An annotated xsd:gMonthDay (format: --MM-DD)"@en .

scm:Duration
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Duration"@en ;
  rdfs:comment "An annotated xsd:duration value (format: PnYnMnDTnHnMnS - e.g P1Y2D - 1 year, 2 days duration)"@en .

scm:YearMonthDuration
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Year-Month Duration"@en ;
  rdfs:comment "An annotated xsd:yearMonthDuration value"@en .

scm:DayTimeDuration
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Day-Time Duration"@en ;
  rdfs:comment "An annotated xsd:dayTimeDuration (Format: PnDTnHnMnS - e.g. P1D2H - 1 day, 2 hours)"@en .

scm:Byte
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Byte"@en ;
  rdfs:comment "An annotated xsd:byte value"@en .

scm:Short
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Short"@en ;
  rdfs:comment "An annotated xsd:short value"@en .

scm:Integer
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Integer"@en ;
  rdfs:comment "An annotated xsd:integer value"@en .

scm:Long
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Long Integer"@en ;
  rdfs:comment "An annotated xsd:long value"@en .

scm:UnsignedByte
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Unsigned Byte"@en ;
  rdfs:comment "An annotated xsd:unsignedByte value"@en .

scm:UnsignedInt
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Unsigned Integer"@en ;
  rdfs:comment "An annotated xsd:unsignedInt value"@en .

scm:UnsignedLong
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Unsigned Long Integer"@en ;
  rdfs:comment "An annotated xsd:unsignedLong value"@en .

scm:PositiveInteger
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Positive Integer"@en ;
  rdfs:comment "An annotated xsd:positiveInteger value"@en .

scm:NonNegativeInteger
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Non Negative Integer"@en ;
  rdfs:comment "An annotated xsd:nonNegativeInteger value >= 0"@en .

scm:NegativeInteger
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Negative Integer"@en ;
  rdfs:comment "An annotated xsd:negativeInteger value < 0 "@en .

scm:NonPositiveInteger
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Non Positive Integer"@en ;
  rdfs:comment "An annotated xsd:nonPositiveInteger value <= 0"@en .

scm:Base64Binary
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Base 64 Binary"@en ;
  rdfs:comment "An annotated xsd:base64Binary value"@en .

scm:AnyURI
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Any URI"@en ;
  rdfs:comment "An annotated xsd:anyURI value"@en .

scm:Language
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Language Code"@en ;
  rdfs:comment "An annotated xsd:language value"@en .

scm:NormalizedString
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Normalized String"@en ;
  rdfs:comment "An annotated xsd:normalizedString value"@en .

scm:Token
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Token"@en ;
  rdfs:comment "An annotated xsd:token value"@en .

scm:NMTOKEN
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "NMTOKEN"@en ;
  rdfs:comment "An annotated xsd:NMTOKEN value"@en .

scm:Name
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Name"@en ;
  rdfs:comment "An annotated xsd:Name box"@en .

scm:NCName
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "NCName"@en ;
  rdfs:comment "An annotated xsd:NCName box"@en .

scm:NOTATION
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "NOTATION"@en ;
  rdfs:comment "An annotated xsd:NOTATION box"@en .

scm:QName
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "QName"@en ;
  rdfs:comment "An annotated xsd:QName"@en .

scm:ID
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "ID"@en ;
  rdfs:comment "An annotated xsd:ID"@en .

scm:IDREF
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "IDREF"@en ;
  rdfs:comment "An annotated xsd:IDREF box"@en .

scm:ENTITY
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "ENTITY"@en ;
  rdfs:comment "An annotated xsd:ENTITY box"@en .

scm:XMLLiteral
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "XML Literal"@en ;
  rdfs:comment "An annotated rdf:XMLLiteral box"@en .

scm:PlainLiteral
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Plain Literal"@en ;
  rdfs:comment "An annotated rdf:PlainLiteral box"@en .

scm:Literal
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Literal"@en ;
  rdfs:comment "An annotated rdfs:Literal box"@en .

scm:Coordinate
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Geographic Coordinate"@en ;
  rdfs:comment "An annotated coordinate on the earth expressed as longitde / latitude"@en .

scm:CoordinatePolygon
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Geographic Shape"@en ;
  rdfs:comment "An annotated geographic shape - a coordinate polygon"@en .

scm:CoordinatePolyline
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Geographic Line"@en ;
  rdfs:comment "An annotated geographic line of lat/long coordinates"@en .

scm:GYearRange
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Year (or range of years)"@en ;
  rdfs:comment "An annotated year or uncertain range of years"@en .

scm:DateRange
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Date (or date-range)"@en ;
  rdfs:comment "An annotated date or a range of dates YYYY-MM-DD"@en .

scm:IntegerRange
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Integer Range"@en ;
  rdfs:comment "An annotated xdd:integerRange value"@en .

scm:DecimalRange
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Decimal Range"@en ;
  rdfs:comment "An annotated xdd:decimalRange value"@en .

scm:HTML
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "HTML"@en ;
  rdfs:comment "An annotated HTML string value"@en .

scm:JSON
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "JSON"@en ;
  rdfs:comment "An annotated JSON string value"@en .

scm:Url
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "URL"@en ;
  rdfs:comment "An annotated xdd:url value"@en .

scm:Email
  a owl:Class ;
  rdfs:subClassOf scm:Box ;
  rdfs:label "Email"@en ;
  rdfs:comment "An annotated xdd:email value - valid email address"@en .

scm:dateRange
  a owl:DatatypeProperty ;
  rdfs:label "Date Range"@en ;
  rdfs:comment "A date or a range of dates YYYY-MM-DD"@en ;
  rdfs:domain scm:DateRange ;
  rdfs:range xdd:dateRange .

scm:anySimpleType
  a owl:DatatypeProperty ;
  rdfs:label "Any Simple Type"@en ;
  rdfs:comment "Any basic data type such as string or integer. An xsd:anySimpleType value."@en ;
  rdfs:domain scm:AnySimpleType ;
  rdfs:range xsd:anySimpleType .

scm:string
  a owl:DatatypeProperty ;
  rdfs:label "String"@en ;
  rdfs:comment "Any text or sequence of characters"@en ;
  rdfs:domain scm:String ;
  rdfs:range xsd:string .

scm:boolean
  a owl:DatatypeProperty ;
  rdfs:label "Boolean"@en ;
  rdfs:comment "A true or false value. An xsd:boolean value."@en ;
  rdfs:domain scm:Boolean ;
  rdfs:range xsd:boolean .

scm:decimal
  a owl:DatatypeProperty ;
  rdfs:label "Decimal"@en ;
  rdfs:comment "A decimal number. An xsd:decimal value."@en ;
  rdfs:domain scm:Decimal ;
  rdfs:range xsd:decimal .

scm:double
  a owl:DatatypeProperty ;
  rdfs:label "Double"@en ;
  rdfs:comment "A double-precision decimal number. An xsd:double value."@en ;
  rdfs:domain scm:Double ;
  rdfs:range xsd:double .

scm:float
  a owl:DatatypeProperty ;
  rdfs:label "Float"@en ;
  rdfs:comment "A floating-point number. An xsd:float value."@en ;
  rdfs:domain scm:Float ;
  rdfs:range xsd:float .

scm:time
  a owl:DatatypeProperty ;
  rdfs:label "Time"@en ;
  rdfs:comment "A time. An xsd:time value. hh:mm:ss.ssss"@en ;
  rdfs:domain scm:Time ;
  rdfs:range xsd:time .

scm:date
  a owl:DatatypeProperty ;
  rdfs:label "Date"@en ;
  rdfs:comment "A date. An xsd:date value. YYYY-MM-DD"@en ;
  rdfs:domain scm:Date ;
  rdfs:range xsd:date .

scm:dateTime
  a owl:DatatypeProperty ;
  rdfs:label "Date Time"@en ;
  rdfs:comment "A date and time. An xsd:dateTime value."@en ;
  rdfs:domain scm:DateTime ;
  rdfs:range xsd:dateTime .

scm:dateTimeStamp
  a owl:DatatypeProperty ;
  rdfs:label "Date-Time Stamp"@en ;
  rdfs:comment "An xsd:dateTimeStamp value."@en ;
  rdfs:domain scm:DateTimeStamp ;
  rdfs:range xsd:dateTimeStamp .

scm:gYear
  a owl:DatatypeProperty ;
  rdfs:label "Year"@en ;
  rdfs:comment " A particular 4 digit year YYYY - negative years are BCE."@en ;
  rdfs:domain scm:GYear ;
  rdfs:range xsd:gYear .

scm:gMonth
  a owl:DatatypeProperty ;
  rdfs:label "Month"@en ;
  rdfs:comment "A particular month. An xsd:gMonth value. --MM"@en ;
  rdfs:domain scm:GMonth ;
  rdfs:range xsd:gMonth .

scm:gDay
  a owl:DatatypeProperty ;
  rdfs:label "Day"@en ;
  rdfs:comment "A particular day. An xsd:gDay value. ---DD"@en ;
  rdfs:domain scm:GDay ;
  rdfs:range xsd:gDay .

scm:gYearMonth
  a owl:DatatypeProperty ;
  rdfs:label "Year / Month"@en ;
  rdfs:comment "A year and a month. An xsd:gYearMonth value."@en ;
  rdfs:domain scm:GYearMonth ;
  rdfs:range xsd:gYearMonth .

scm:gMonthDay
  a owl:DatatypeProperty ;
  rdfs:label "Month / Day"@en ;
  rdfs:comment "A month and a day. An xsd:gMonthDay value."@en ;
  rdfs:domain scm:GMonthDay ;
  rdfs:range xsd:gMonthDay .

scm:duration
  a owl:DatatypeProperty ;
  rdfs:label "Duration"@en ;
  rdfs:comment "A period of time. An xsd:duration value."@en ;
  rdfs:domain scm:Duration ;
  rdfs:range xsd:duration .

scm:yearMonthDuration
  a owl:DatatypeProperty ;
  rdfs:label "Year / Month Duration"@en ;
  rdfs:comment "A duration measured in years and months. An xsd:yearMonthDuration value."@en ;
  rdfs:domain scm:YearMonthDuration ;
  rdfs:range xsd:yearMonthDuration .

scm:dayTimeDuration
  a owl:DatatypeProperty ;
  rdfs:label "Day / Time Duration"@en ;
  rdfs:comment "A duration measured in days and time. An xsd:dayTimeDuration value."@en ;
  rdfs:domain scm:DayTimeDuration ;
  rdfs:range xsd:dayTimeDuration .

scm:byte
  a owl:DatatypeProperty ;
  rdfs:label "Byte"@en ;
  rdfs:comment "An xsd:byte value."@en ;
  rdfs:domain scm:Byte ;
  rdfs:range xsd:byte .

scm:short
  a owl:DatatypeProperty ;
  rdfs:label "Short"@en ;
  rdfs:comment "An xsd:short value."@en ;
  rdfs:domain scm:Short ;
  rdfs:range xsd:short .

scm:integer
  a owl:DatatypeProperty ;
  rdfs:label "Integer"@en ;
  rdfs:comment "A simple number. An xsd:integer value."@en ;
  rdfs:domain scm:Integer ;
  rdfs:range xsd:integer .

scm:long
  a owl:DatatypeProperty ;
  rdfs:label "Long"@en ;
  rdfs:comment "An xsd:long value."@en ;
  rdfs:domain scm:Long ;
  rdfs:range xsd:long .

scm:unsignedByte
  a owl:DatatypeProperty ;
  rdfs:label "Unsigned Byte"@en ;
  rdfs:comment "An xsd:unsignedByte value."@en ;
  rdfs:domain scm:UnsignedByte ;
  rdfs:range xsd:unsignedByte .

scm:unsignedInt
  a owl:DatatypeProperty ;
  rdfs:label "Unsigned Integer"@en ;
  rdfs:comment "An xsd:unsignedInt value."@en ;
  rdfs:domain scm:UnsignedInt ;
  rdfs:range xsd:unsignedInt .

scm:unsignedLong
  a owl:DatatypeProperty ;
  rdfs:label "Unsigned Long Integer"@en ;
  rdfs:comment "An xsd:unsignedLong value."@en ;
  rdfs:domain scm:UnsignedLong ;
  rdfs:range xsd:unsignedLong .

scm:positiveInteger
  a owl:DatatypeProperty ;
  rdfs:label "Positive Integer"@en ;
  rdfs:comment "A simple number greater than 0. An xsd:positiveInteger value."@en ;
  rdfs:domain scm:PositiveInteger ;
  rdfs:range xsd:positiveInteger .

scm:nonNegativeInteger
  a owl:DatatypeProperty ;
  rdfs:label "Non-Negative Integer"@en ;
  rdfs:comment "A simple number that can't be less than 0. An xsd:nonNegativeInteger value."@en ;
  rdfs:domain scm:NonNegativeInteger ;
  rdfs:range xsd:nonNegativeInteger .

scm:negativeInteger
  a owl:DatatypeProperty ;
  rdfs:label "Negative Integer"@en ;
  rdfs:comment "A negative integer. An xsd:negativeInteger value."@en ;
  rdfs:domain scm:NegativeInteger ;
  rdfs:range xsd:negativeInteger .

scm:nonPositiveInteger
  a owl:DatatypeProperty ;
  rdfs:label "Non-Positive Integer"@en ;
  rdfs:comment "A number less than or equal to zero. An xsd:nonPositiveInteger value."@en ;
  rdfs:domain scm:NonPositiveInteger ;
  rdfs:range xsd:nonPositiveInteger .

scm:base64Binary
  a owl:DatatypeProperty ;
  rdfs:label "Base 64 Binary"@en ;
  rdfs:comment "An xsd:base64Binary value."@en ;
  rdfs:domain scm:Base64Binary ;
  rdfs:range xsd:base64Binary .

scm:anyURI
  a owl:DatatypeProperty ;
  rdfs:label "Any URI"@en ;
  rdfs:comment "Any URl. An xsd:anyURI value."@en ;
  rdfs:domain scm:AnyURI ;
  rdfs:range xsd:anyURI .

scm:language
  a owl:DatatypeProperty ;
  rdfs:label "Language"@en ;
  rdfs:comment "A natural language identifier as defined by by [RFC 3066] . An xsd:language value."@en ;
  rdfs:domain scm:Language ;
  rdfs:range xsd:language .

scm:normalizedString
  a owl:DatatypeProperty ;
  rdfs:label "Normalized String"@en ;
  rdfs:comment "An xsd:normalizedString value."@en ;
  rdfs:domain scm:NormalizedString ;
  rdfs:range xsd:normalizedString .

scm:token
  a owl:DatatypeProperty ;
  rdfs:label "Token"@en ;
  rdfs:comment "An xsd:token value."@en ;
  rdfs:domain scm:Token ;
  rdfs:range xsd:token .

scm:nMTOKEN
  a owl:DatatypeProperty ;
  rdfs:label "NMTOKEN"@en ;
  rdfs:comment "An xsd:NMTOKEN value."@en ;
  rdfs:domain scm:NMTOKEN ;
  rdfs:range xsd:NMTOKEN .

scm:name
  a owl:DatatypeProperty ;
  rdfs:label "Name"@en ;
  rdfs:comment "An xsd:Name value."@en ;
  rdfs:domain scm:Name ;
  rdfs:range xsd:Name .

scm:nCName
  a owl:DatatypeProperty ;
  rdfs:label "NCName"@en ;
  rdfs:comment "An xsd:NCName value."@en ;
  rdfs:domain scm:NCName ;
  rdfs:range xsd:NCName .

scm:nOTATION
  a owl:DatatypeProperty ;
  rdfs:label "NOTATION"@en ;
  rdfs:comment "An xsd:NOTATION value."@en ;
  rdfs:domain scm:NOTATION ;
  rdfs:range xsd:NOTATION .

scm:qName
  a owl:DatatypeProperty ;
  rdfs:label "QName"@en ;
  rdfs:comment "An xsd:QName value."@en ;
  rdfs:domain scm:QName ;
  rdfs:range xsd:QName .

scm:iD
  a owl:DatatypeProperty ;
  rdfs:label "ID"@en ;
  rdfs:comment "An xsd:ID value."@en ;
  rdfs:domain scm:ID ;
  rdfs:range xsd:ID .

scm:iDREF
  a owl:DatatypeProperty ;
  rdfs:label "IDREF"@en ;
  rdfs:comment "An xsd:IDREF value."@en ;
  rdfs:domain scm:IDREF ;
  rdfs:range xsd:IDREF .

scm:eNTITY
  a owl:DatatypeProperty ;
  rdfs:label "ENTITY"@en ;
  rdfs:comment "An xsd:ENTITY value."@en ;
  rdfs:domain scm:ENTITY ;
  rdfs:range xsd:ENTITY .

scm:xMLLiteral
  a owl:DatatypeProperty ;
  rdfs:label "XML Literal"@en ;
  rdfs:comment "An rdf:XMLLiteral value."@en ;
  rdfs:domain scm:XMLLiteral ;
  rdfs:range rdf:XMLLiteral .

scm:plainLiteral
  a owl:DatatypeProperty ;
  rdfs:label "Plain Literal"@en ;
  rdfs:comment "An rdf:PlainLiteral value."@en ;
  rdfs:domain scm:PlainLiteral ;
  rdfs:range rdf:PlainLiteral .

scm:literal
  a owl:DatatypeProperty ;
  rdfs:label "Literal"@en ;
  rdfs:comment "An rdfs:Literal value."@en ;
  rdfs:domain scm:Literal ;
  rdfs:range rdfs:Literal .

scm:coordinate
  a owl:DatatypeProperty ;
  rdfs:label "Coordinate"@en ;
  rdfs:comment "A particular location on the surface of the earth, defined by latitude and longitude . An xdd:coordinate value."@en ;
  rdfs:domain scm:Coordinate ;
  rdfs:range xdd:coordinate .

scm:coordinatePolygon
  a owl:DatatypeProperty ;
  rdfs:label "Geographic Area"@en ;
  rdfs:comment "A shape on a map which defines an area. within the defined set of coordinates   An xdd:coordinatePolygon value."@en ;
  rdfs:domain scm:CoordinatePolygon ;
  rdfs:range xdd:coordinatePolygon .

scm:coordinatePolyline
  a owl:DatatypeProperty ;
  rdfs:label "Coordinate Path"@en ;
  rdfs:comment "A set of coordinates forming a line on a map, representing a route. An xdd:coordinatePolyline value."@en ;
  rdfs:domain scm:CoordinatePolyline ;
  rdfs:range xdd:coordinatePolyline .

scm:gYearRange
  a owl:DatatypeProperty ;
  rdfs:label "Year"@en ;
  rdfs:comment "A 4-digit year, YYYY, or if uncertain, a range of years. An xdd:gYearRange value."@en ;
  rdfs:domain scm:GYearRange ;
  rdfs:range xdd:gYearRange .

scm:integerRange
  a owl:DatatypeProperty ;
  rdfs:label "Integer"@en ;
  rdfs:comment "A simple number or range of numbers. An xdd:integerRange value."@en ;
  rdfs:domain scm:IntegerRange ;
  rdfs:range xdd:integerRange .

scm:decimalRange
  a owl:DatatypeProperty ;
  rdfs:label "Decimal Number"@en ;
  rdfs:comment "A decimal value or, if uncertain, a range of decimal values. An xdd:decimalRange value."@en ;
  rdfs:domain scm:DecimalRange ;
  rdfs:range xdd:decimalRange .

scm:url
  a owl:DatatypeProperty ;
  rdfs:label "URL"@en ;
  rdfs:comment "A valid url."@en ;
  rdfs:domain scm:Url ;
  rdfs:range xdd:url .

scm:email
  a owl:DatatypeProperty ;
  rdfs:label "Email"@en ;
  rdfs:comment "A valid email address."@en ;
  rdfs:domain scm:Email ;
  rdfs:range xdd:email .

scm:html
  a owl:DatatypeProperty ;
  rdfs:label "HTML"@en ;
  rdfs:comment "A safe HTML string"@en ;
  rdfs:domain scm:HTML ;
  rdfs:range xdd:html .

scm:json
  a owl:DatatypeProperty ;
  rdfs:label "JSON"@en ;
  rdfs:comment "A JSON Encoded String"@en ;
  rdfs:domain scm:JSON ;
  rdfs:range xdd:json .

  scm:SeshatChoices 
  a owl:Ontology;
  rdfs:comment "Properties that can only take a specific set of values are enumerated types and defined here for Seshat"@en ;
  rdfs:label "Seshat Enumerated Types"@en.
  
scm:Confidence
  a owl:Class ;
  rdfs:comment "Tags that can be added to values to indicate confidence in the value of some piece data"@en ;
  rdfs:label "Confidence Tags"@en ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:inferred
      scm:disputed
      scm:uncertain
  ) .

scm:EpistemicState
rdfs:label "Epistemic State"@en ;
rdfs:comment "The existence of a feature in the historical record"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:unknown
 scm:absent
 scm:present
) .

scm:EpistemicFrequency
rdfs:label "Epistemic Frequency"@en ;
rdfs:comment "The frequency of a feature in the historical record"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:unknown_epistemic_frequency
 scm:never
 scm:rare
 scm:frequent
) .

scm:DegreeOfCentralization
rdfs:label "Degree of Centralization"@en ;
rdfs:comment "An indication of how centralized a political authority was"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:quasipolity
 scm:nominal
 scm:loose
 scm:confederated_state
 scm:unitary_state
 scm:unknown_centralization
 scm:no_centralization
) .

scm:Change
rdfs:label "Size of Change"@en ;
rdfs:comment "How much change has taken place"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:unknown_change
 scm:big_decrease
 scm:small_decrease
 scm:stable
 scm:small_increase
 scm:big_increase
) .

scm:ComplexityChange
rdfs:label "Change in complexity"@en ;
rdfs:comment "How much change has taken place in complexity"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:unknown_complexity_change
 scm:organization_collapses
 scm:complexity_decreases
 scm:stable_complexity
 scm:complexity_increases
 scm:big_complexity_increase
) .

scm:SupraPolityRelations
rdfs:label "Supra-Polity Relations"@en ;
rdfs:comment "The relationship between a polity and its paramount power "@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:alliance
 scm:nominal_allegiance
 scm:personal_union
 scm:vassalage
 scm:no_supra_polity_relations
 scm:unknown_supra_polity_relations
) .

scm:PoliticalEvolution
rdfs:label "Political Evolution"@en ;
rdfs:comment "The ways in which a political authority can evolve into another one"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:continuity
 scm:assimilation
 scm:elite_migration
 scm:population_migration
 scm:unknown_evolution
) .

scm:IncomeSource
a owl:Class ;
rdfs:label "Source of Income"@en ;
rdfs:comment "A source of income"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
 scm:state_salary
 scm:governed_population
 scm:land
 scm:no_income
 scm:unknown_income
) .

scm:Frequency
  rdfs:label "Frequency"@en ;
  rdfs:comment "The genrational frequencies of events"@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
  scm:daily
  scm:weekly
  scm:monthly
  scm:seasonally
  scm:yearly
  scm:once_per_generation
  scm:once_in_a_lifetime
  scm:unknown_frequency
) .

scm:AuthorityEmphasis
  rdfs:label "Authority Emphasis"@en ;
  rdfs:comment "Group Authority Emphasis - from leader to collective"@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:egalitarian
      scm:group_solidarity
      scm:group_priority
      scm:leader_priority
      scm:leader_emphasis
      scm:unknown_emphasis
  ) .

scm:AuthoritySharing
  rdfs:label "Authority Sharing"@en ;
  rdfs:comment "The sharing of authority"@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:egalitarian_sharing
      scm:extensive_sharing
      scm:cadre_sharing
      scm:rare_sharing
      scm:exclusive_sharing
      scm:unknown_sharing
  ) .

scm:ExternalContact
  rdfs:label "External Contact"@en ;
  rdfs:comment "Particiption in external contacts"@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:egalitarian_contact
      scm:few_contacts
      scm:nonexclusive_leader_participation
      scm:nonexclusive_leader_control
      scm:exclusive_leader_control
      scm:unknown_contact
  ) .

scm:LeaderDifferentiation
  rdfs:label "Leader Differentiation"@en ;
  rdfs:comment "Differentiation among leaders and followers."@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:egalitarian_differentiation
      scm:no_differentiation
      scm:small_privileges
      scm:extensive_privileges
      scm:exclusive_privileges
      scm:unknown_differentiation
  ) .

scm:LeaderIdentification
  rdfs:label "Leader Indentification"@en ;
  rdfs:comment "Mechanisms by which a leader is identified"@en ;
  a owl:Class ;
  rdfs:subClassOf tcs:Enumerated ;
  owl:oneOf (
      scm:no_leader
      scm:egalitarian_leadership
      scm:leader_treatment
      scm:leader_symbols
      scm:leader_cult
      scm:unknown_identification
  ) .

scm:Standardization
rdfs:label "Standardization"@en ;
rdfs:comment "The standard nature of a feature"@en ;
a owl:Class ;
rdfs:subClassOf tcs:Enumerated ;
owl:oneOf (
  scm:unknown_standardization
  scm:no_standardization
  scm:unstandardized
  scm:moderately_unstandardized
  scm:moderately_standardized
  scm:standardized
) .

scm:daily
  rdfs:label "Daily"@en ;
  rdfs:comment "Occuring every day (or most days)"@en ;
  a scm:Frequency .

scm:weekly
  rdfs:label "Weekly"@en ;
  rdfs:comment "Occurring once per week (or similar frequency)"@en ;
  a scm:Frequency .

scm:monthly
  rdfs:label "Monthly"@en ;
  rdfs:comment "Occurring once per month (or similar frequency)"@en ;
  a scm:Frequency .

scm:seasonally
  rdfs:label "Seasonally"@en ;
  rdfs:comment "Occurring 4 times per year (or similar frequency)"@en 
  a tcs:Frequency.

scm:yearly
  rdfs:label "Yearly"@en ;
  rdfs:comment "Occurring once a year (or similar frequency)"@en ;
  a scm:Frequency .

scm:once_per_generation
  rdfs:label "Once per generation"@en ;
  rdfs:comment "Occurring once a generation (20 years or similar frequency)"@en ;
  a scm:Frequency .

scm:once_in_a_lifetime
  rdfs:label "Once in a lifetime"@en ;
  rdfs:comment "Occurring once in an individual's lifetime"@en ;
  a scm:Frequency .

scm:egalitarian
  rdfs:label "Egalitarian"@en ;
  rdfs:comment "Egalitarian / no formal leaders"@en ;
  a scm:AuthorityEmphasis.

scm:group_solidarity
  rdfs:label "Group Solidarity"@en ;
  rdfs:comment "emphasis placed on group solidarity and group survival "@en ;
  a scm:AuthorityEmphasis .

scm:group_priority
  rdfs:label "Group Priority"@en ;
  rdfs:comment "emphasis shared between group and leader, with greatest importance given to group survival"@en ;
  a scm:AuthorityEmphasis .

scm:leader_priority
  rdfs:label "Leader Priority"@en ;
  rdfs:comment "emphasis shared between group and leader, with greatest importance given to leader survival "@en ;
  a scm:AuthorityEmphasis .

scm:leader_emphasis
  rdfs:label "Leader Emphasis"@en ;
  rdfs:comment "emphasis placed on leaders as the embodiment of the group"@en ;
  a scm:AuthorityEmphasis .

scm:extensive_sharing
  rdfs:label "Extensive Sharing"@en ;
  rdfs:comment "leaders share power extensively with others "@en ;
  a scm:AuthoritySharing .

scm:cadre_sharing
  rdfs:label "Cadre Sharing"@en ;
  rdfs:comment "leaders share power with a large cadre of other leaders"@en ;
  a scm:AuthoritySharing .

scm:rare_sharing
  rdfs:label "Rare Sharing"@en ;
  rdfs:comment "leaders share power with a few other leaders "@en ;
  a scm:AuthoritySharing .

scm:exclusive_sharing
  rdfs:label "Exclusive Sharing"@en ;
  rdfs:comment "leaders exercise exclusive power"@en ;
  a scm:AuthoritySharing .

scm:few_contacts
  rdfs:label "Few contacts"@en ;
  rdfs:comment "few or unimportant"@en ;
  a scm:ExternalContact .

scm:nonexclusive_leader_participation
  rdfs:label "Non-exclusive Participation"@en ;
  rdfs:comment "external contacts are part of leaders' authority, but not exclusive"@en ;
  a scm:ExternalContact .

scm:nonexclusive_leader_control
  rdfs:label "Non-exclusive Control"@en ;
  rdfs:comment "external contacts are key to leaders' authority, but not exclusive"@en ;
  a scm:ExternalContact .

scm:exclusive_leader_control
  rdfs:label "Exclusive Control"@en ;
  rdfs:comment "external contacts are exclusively controlled by leaders"@en ;
  a scm:ExternalContact .


scm:no_differentiation
  rdfs:label "No Differentiation"@en ;
  rdfs:comment "No Differentiation"@en ;
  a scm:LeaderDifferentiation .

scm:small_privileges
  rdfs:label "Some Privileges"@en ;
  rdfs:comment "leaders have some privileges and/or access to resources others do not"@en ;
  a scm:LeaderDifferentiation .

scm:extensive_privileges
  rdfs:label "Extensive Privileges"@en ;
  rdfs:comment "leaders have extensive privileges and access to resources others do not, including special housing and sumptuary goods"@en ;
  a scm:LeaderDifferentiation .

scm:exclusive_privileges
  rdfs:label "Exclusive Privileges"@en ;
  rdfs:comment "lleaders have exclusive privileges and exclusive access to special housing, resources, and sumptuary goods"@en ;
  a scm:LeaderDifferentiation .

scm:no_standardization
  rdfs:label "None"@en ;
  rdfs:comment "No standardization exists"@en ;
  a scm:Standardization .

scm:leader_treatment
  rdfs:label "Identified by treatment"@en ;
  rdfs:comment "leaders are identified by treatment or appearance"@en ;
  a scm:LeaderIdentification .

scm:leader_symbols
  rdfs:label "Identified by symbols"@en ;
  rdfs:comment "leaders are identified by recognized symbols of power or special behaviors"@en ;
  a scm:LeaderIdentification .

scm:leader_cult
  rdfs:label "cult of leadership"@en ;
  rdfs:comment "individual aggrandizement and/or cult of leaders"@en ;
  a scm:LeaderIdentification .

scm:absent
  a scm:EpistemicState;
  rdfs:comment "The feature was absent in this historical context"@en ;
  rdfs:label "Absent"@en .

scm:active
  a scm:GodType ;
  rdfs:comment "Present and active in human affairs but not supportive of human morality"@en ;
  rdfs:label "Active"@en .

scm:alliance
  a scm:SupraPolityRelations ;
  rdfs:comment "belongs to a long-term military-political alliance of independent polities ('long-term' refers to more or less permanent relationship between polities extending over multiple years"@en ;
  rdfs:label "Alliance"@en .

scm:assimilation
  a scm:PoliticalEvolution ;
  rdfs:comment "Assimilation by another political authority in the absence of substantial population replacement"@en ;
  rdfs:label "Cultural Assimilation"@en .

scm:big_complexity_increase
  a scm:ComplexityChange ;
  rdfs:comment "Radical increase in the size and/or organizational complexity"@en ;
  rdfs:label "Radical Increase"@en .

scm:big_decrease
  a scm:Change ;
  rdfs:comment "Dramatic Decrease"@en ;
  rdfs:label "Dramatic Decrease"@en .

scm:big_increase
  a scm:Change ;
  rdfs:comment "Dramatic Increase"@en ;
  rdfs:label "Dramatic Increase"@en .

scm:complexity_decreases
  a scm:ComplexityChange ;
  rdfs:comment " Size and/or organizational complexity decreases."@en ;
  rdfs:label "Decreased Complexity"@en .

scm:complexity_increases
  a scm:ComplexityChange ;
  rdfs:comment "Size and/or organizational complexity increases."@en ;
  rdfs:label "Increased Complexity"@en .

scm:confederated_state
  a scm:DegreeOfCentralization ;
  rdfs:comment "regions enjoy a large degree of autonomy in internal (regional) government. In particular, the regional governors are either hereditary rulers, or are elected by regional elites or by the population of the region; and regional governments can levy and dispose of regional taxes. Use this category for the more centralized "@en ;
  rdfs:label "Confederated State"@en .

scm:continuity
  a scm:PoliticalEvolution ;
  rdfs:comment "Gradual change without any discontinuity"@en ;
  rdfs:label "Continuity"@en .

scm:elite_migration
  a scm:PoliticalEvolution ;
  rdfs:comment "The preceding elites were replaced by new elites coming from elsewhere"@en ;
  rdfs:label "Elite Migration"@en .

scm:frequent
  a scm:EpistemicFrequency ;
  rdfs:comment "The feature was frequent in the historical context"@en ;
  rdfs:label "Frequent"@en .

scm:governed_population
  a scm:IncomeSource ;
  rdfs:comment "means that the official directly collects tribute from the population (for example, the 'kormlenie' system in Medieval Russia)."@en ;
  rdfs:label "Governed Population"@en .

scm:inactive
  a scm:GodType ;
  rdfs:comment "Present but not active in human affairs"@en ;
  rdfs:label "Inactive"@en .

scm:land
  a scm:IncomeSource ;
  rdfs:comment "Living off land supplied by the state."@en ;
  rdfs:label "Land"@en .

scm:loose
  a scm:DegreeOfCentralization ;
  rdfs:comment "the central government exercises a certain degree of control, especially over military matters and international relations. Otherwise the regional rulers are left alone (example: European "@en ;
  rdfs:label "Loose"@en .

scm:moderately_standardized
  a scm:Standardization ;
  rdfs:comment "Moderately standardized (more standard than not)"@en;
  rdfs:label "Moderately Standardized"@en .

scm:moderately_unstandardized
  a scm:Standardization ;
  rdfs:comment "Moderately Unstandardized (more unstandard than not)"@en;
  rdfs:label "Moderately Unstandardized"@en .

scm:moralizing
  a scm:GodType ;
  rdfs:comment "Present, active, and specifically supportive of human morality"@en ;
  rdfs:label "Moralizing"@en .

scm:no_centralization
  a scm:DegreeOfCentralization ;
  rdfs:comment "There is no centralised system"@en ;
  rdfs:label "None"@en .

scm:no_income
  a scm:IncomeSource ;
  rdfs:comment "The state officials are not compensated (example: in the Republican and Principate Rome the magistrates were wealthy individuals who served without salary, motivated by prestige and social or career advancement)"@en ;
  rdfs:label "None"@en .

scm:no_supra_polity_relations
  a scm:SupraPolityRelations ;
  rdfs:comment "No relations with any supracultural entity"@en ;
  rdfs:label "None"@en .

scm:nominal
  a scm:DegreeOfCentralization ;
  rdfs:comment "regional rulers pay only nominal allegiance to the overall ruler and maintain independence on all important aspects of governing, including taxation and warfare. (example: Japan during the Sengoku period)"@en ;
  rdfs:label "Nominal "@en .

scm:nominal_allegiance
  a scm:SupraPolityRelations ;
  rdfs:comment "ay only nominal allegiance to the overall ruler and maintain independence on all important aspects of governing, including taxation and warfare."@en ;
  rdfs:label "Nominal Allegiance"@en .

scm:organization_collapses
  a scm:ComplexityChange ;
  rdfs:comment "Organization collapses."@en ;
  rdfs:label "Collapse"@en .

scm:personal_union
  a scm:SupraPolityRelations ;
  rdfs:comment "the focal polity is united with another, or others, as a result of a dynastic marriage"@en ;
  rdfs:label "Personal Union"@en .

scm:population_migration
  a scm:PoliticalEvolution ;
  rdfs:comment "Evidence for substantial population replacement"@en ;
  rdfs:label "Population Migration"@en .

scm:present
  a scm:EpistemicState ;
  rdfs:comment "The feature was present in this historical context"@en ;
  rdfs:label "Present"@en .

scm:quasipolity
  a scm:DegreeOfCentralization ;
  rdfs:comment "Use if the NGA is inhabited by many politically independent groups"@en ;
  rdfs:label "Quasi-polity"@en .

scm:rare
  a scm:EpistemicFrequency ;
  rdfs:comment "The feature was rare in the historical context"@en ;
  rdfs:label "Rare"@en .

scm:small_decrease
  a scm:Change ;
  rdfs:comment "Minor Decrease"@en ;
  rdfs:label "Minor Decrease"@en .

scm:small_increase
  a scm:Change ;
  rdfs:comment "Minor Increase"@en ;
  rdfs:label "Minor Increase"@en .

scm:stable
  a scm:Change ;
  rdfs:comment "Stable - no change"@en ;
  rdfs:label "Stable"@en .

scm:stable_complexity
  a scm:ComplexityChange ;
  rdfs:comment " Size and/or organizational complexity remains stable."@en ;
  rdfs:label "Stable"@en .

scm:standardized
  a scm:Standardization ;
  rdfs:comment "Standardized across the board"@en;
  rdfs:label "Standardized"@en .

scm:state_salary
  a scm:IncomeSource ;
  rdfs:comment "can be paid either in currency or in kind (e.g., koku of rice)."@en ;
  rdfs:label "State Salary"@en .

scm:unitary_state
  a scm:DegreeOfCentralization ;
  rdfs:comment "regional governors are appointed and removed by the central authorities, taxes are imposed by, and transmitted to the center"@en ;
  rdfs:label "Unitary State"@en .

scm:unknown
 a scm:EpistemicState;
 rdfs:comment "It can be said with a high degree of confidence that it is not known whether the feature was present or absent in the context."@en ;
 rdfs:label "Unknown"@en .

scm:unstandardized
  a scm:Standardization ;
  rdfs:comment "Not standardized at all."@en;
  rdfs:label "Unstandardized"@en .

scm:vassalage
  a scm:SupraPolityRelations ;
  rdfs:comment "A central government exercises a certain degree of control, especially over military matters and international relations. Otherwise the polity is left alone"@en ;
  rdfs:label "Vassalage"@en .

scm:inferred
rdfs:label "Inferred"@en ;
rdfs:comment "The value has been logically inferred from other evidence"@en ;
a scm:Confidence .

scm:disputed
rdfs:label "Disputed"@en ;
rdfs:comment "The evidence is disputed - some believe this data to be incorrect"@en ;
a scm:Confidence .

scm:uncertain
rdfs:label "Uncertain"@en ;
rdfs:comment "The evidence has a high degree of uncertainty"@en ;
a scm:Confidence .

scm:unknown_identification
rdfs:label "Unknown"@en ;
rdfs:comment "How the leader is identified is unknown"@en ;
a scm:LeaderIdentification .

scm:no_leader
rdfs:label "No leader"@en ;
rdfs:comment "There is no leader"@en ;
a scm:LeaderIdentification .


scm:egalitarian_leadership
rdfs:label "Egalitarian"@en ;
rdfs:comment "Egalitarian leadership"@en ;
a scm:LeaderIdentification .

scm:unknown_emphasis
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Emphasis"@en ;
a scm:AuthorityEmphasis.


scm:unknown_epistemic_frequency
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Epistemic Frequency"@en ;
a scm:EpistemicFrequency.


scm:unknown_frequency
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Frequency"@en ;
a scm:Frequency.

scm:unknown_evolution
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Evolution"@en ;
a scm:PoliticalEvolution.

scm:unknown_supra_polity_relations
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Relations"@en ;
a scm:SupraPolityRelations.

scm:unknown_change
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Change"@en ;
a scm:Change.

scm:never
rdfs:label "Never"@en ;
rdfs:comment "Never occurs"@en ;
a scm:EpistemicFrequency.

scm:unknown_centralization
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Centralization"@en ;
a scm:DegreeOfCentralization.

scm:unknown_complexity_change
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown Change"@en ;
a scm:ComplexityChange.

scm:unknown_income
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown source of income"@en ;
a scm:IncomeSource.

scm:unknown_sharing
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown authority sharing"@en ;
a scm:AuthoritySharing.

scm:egalitarian_sharing
rdfs:label "Egalitarian"@en ;
rdfs:comment "Egalitarian authority sharing"@en ;
a scm:AuthoritySharing.

scm:egalitarian_contact
rdfs:label "Egalitarian"@en ;
rdfs:comment "Egalitarian contact access"@en ;
a scm:ExternalContact.

scm:unknown_contact
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown external contacts"@en ;
a scm:ExternalContact.
  
scm:egalitarian_differentiation
rdfs:label "Egalitarian"@en ;
rdfs:comment "Egalitarian differentiation of leaders"@en ;
a scm:LeaderDifferentiation.
  
scm:unknown_standardization
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown standardization levels"@en ;
a scm:Standardization.

scm:unknown_differentiation
rdfs:label "Unknown"@en ;
rdfs:comment "Unknown differentiation"@en ;
a scm:Standardization.

`;