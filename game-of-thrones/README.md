# Game of Throne example of using TerminusDB

In Neo4j, there is a [famous example of using the Game of Throne data](https://github.com/neo4j-examples/game-of-thrones) to create a graph visualisation of the character relations. Here we will see if we can do that in TerminusDB, and how.

## Data

Data can be retrieved from An [API of Ice And Fire](https://anapioficeandfire.com/Documentation) by Joakim Skoog.

Alternatively, we will get the data from the follow json files in the [repository](https://github.com/joakimskoog/AnApiOfIceAndFire).

https://raw.githubusercontent.com/joakimskoog/AnApiOfIceAndFire/master/data/houses.json
https://raw.githubusercontent.com/joakimskoog/AnApiOfIceAndFire/master/data/characters.json

## Schema

To recreate the Neo4j example, we need the follow objects.

Person (name, titles, houses, ...)
House (name, allies, follows, followers, founder, words, ...)
Seat (name)
Region (name)
