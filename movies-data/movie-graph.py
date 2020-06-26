from terminusdb_client import WOQLClient, WOQLQuery
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
                .property("Rating", "xsd:integer", label="Rating of the movie", description="User rating for the movie 0-10")
                .property("Votes", "xsd:integer", label="Votes", description="Number of votes")
                )
    WOQLQuery().woql_and(movie_obj, genre_obj, person_obj).execute(client, "Building Schema for the movie graph")

def loading_data(cleint, filename):
    df = pd.read_csv(filename)
    

db_id = "movie_graph"
client = WOQLClient("http://localhost:6363")
client.connect(key="root", account="admin", user="admin")

existing = client.get_metadata(db_id, client.uid())
if not existing:
    client.create_database(db_id, accountid="admin", label = "Graph of IMDB Movies Data", description = "Create a graph with IMDB movies data")
else:
    client.set_db(db_id)

create_schema(client)
loading_data(client, 'IMDB-Movie-Data.csv')
