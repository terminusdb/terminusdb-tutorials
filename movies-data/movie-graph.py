from terminusdb_client import WOQLClient, WOQLQuery
from terminusdb_client.woqldataframe import query_to_df
import pandas

def create_schema(client):
    # creating objects doctype
    movie_obj = WOQLQuery().doctype("Movie", label="Movie Title", description="Movie short description")
    person_obj = WOQLQuery().doctype("Person", label="Name of the person")
    genre_obj = WOQLQuery().doctype("Genre", label="Genre of a movie")
    # adding property
    movie_obj = (movie_obj
                .property("Director", "Person", label="Dirctor of the movie")
                .property("Cast", "Person", label="Cast of the movie")
                .property("MovieGenre", "Genre", label="Genre of the movie")
                .property("Year", "xsd:integer", label="Year of release")
                .property("Runtime", "xsd:integer", label="Runtime", description="Runtime of the movie in mins")
                .property("Rating", "xsd:decimal", label="Rating of the movie", description="User rating for the movie 0-10")
                .property("Votes", "xsd:integer", label="Votes", description="Number of votes")
                )
    WOQLQuery().woql_and(movie_obj, genre_obj, person_obj).execute(client, "Building Schema for the movie graph")

def loading_data(client, file_url):
    read_csv = WOQLQuery().get(
        WOQLQuery().woql_as("Rank", "v:rank_raw")
                   .woql_as("Title", "v:title_raw")
                   .woql_as("Genre", "v:genre_raw")
                   .woql_as("Description", "v:description_raw")
                   .woql_as("Director", "v:director_raw")
                   .woql_as("Actors", "v:actors_raw")
                   .woql_as("Year", "v:year_raw")
                   .woql_as("Runtime (Minutes)", "v:runtime_raw")
                   .woql_as("Rating", "v:rating_raw")
                   .woql_as("Votes", "v:votes_raw")
                   .woql_as("Revenue (Millions)", "v:rev_raw")
                   .woql_as("Metascore","v:metascore_raw")
    ).remote(file_url)

    prepare_genre_obj = WOQLQuery().split("v:genre_raw", ",", "v:genre_list").member("v:one_genre", "v:genre_list").idgen("doc:Gerne", ["v:one_genre"], "v:genre_objid")

    prepare_actor_obj = WOQLQuery().split("v:actors_raw", ",", "v:actors_list").member("v:one_actor", "v:actors_list").idgen("doc:Person", ["v:one_actor"], "v:actors_objid")

    prepare_director_obj = WOQLQuery().split("v:director_raw", ",", "v:director_list").member("v:one_director", "v:director_list").idgen("doc:Person", ["v:one_director"], "v:director_objid")


    wangles = (
    WOQLQuery().typecast("v:year_raw", "xsd:integer", "v:year_clean")
        .typecast("v:runtime_raw", "xsd:integer", "v:runtime_clean")
        .typecast("v:rating_raw", "xsd:decimal", "v:rating_clean")
        .typecast("v:votes_raw", "xsd:integer", "v:votes_clean")
        .idgen("doc:Movie",["v:title_raw", "v:director_raw"], "v:movie_id")
        )

    insert = (
    WOQLQuery().insert("v:genre_objid", "Genre", label="v:genre_raw")
    .insert("v:actors_objid", "Person", label="v:actors_raw")
    .insert("v:director_objid", "Person", label="v:director_raw")
    .insert("v:movie_id", "Movie", label="v:title_raw", description="v:description_raw")
    .property("Director", "v:director_objid")
    .property("Cast", "v:actors_objid")
    .property("MovieGenre", "v:genre_objid")
    .property("Year", "v:year_clean")
    .property("Runtime", "v:runtime_clean")
    .property("Rating", "v:rating_clean")
    .property("Votes", "v:votes_clean")
    )

    data_prep = WOQLQuery().woql_and(read_csv, prepare_genre_obj, prepare_actor_obj, prepare_director_obj, wangles)

    return WOQLQuery().woql_and(data_prep, insert).execute(client, "Loading data for the movie graph")


db_id = "movie_graph"
client = WOQLClient("http://localhost:6363")
client.connect(key="root", account="admin", user="admin")

existing = client.get_metadata(db_id, client.uid())
if not existing:
    client.create_database(db_id, accountid="admin", label = "Graph of IMDB Movies Data", description = "Create a graph with IMDB movies data")
else:
    client.set_db(db_id)

create_schema(client)
result = loading_data(client, "https://raw.githack.com/terminusdb/terminus-tutorials/master/movies-data/IMDB-Movie-Data.csv")
result_df = query_to_df(result)
print(result)
# print(result_df.columns)
# print("----------------")
# print(result_df["genre_objid"])
