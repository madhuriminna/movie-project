const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
let db = null;
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost/3000/");
    });
  } catch (e) {
    console.log(`DataBase Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/movies/", async (request, response) => {
  const getAllMovies = `
        select 
        movie_name
        from 
        movie;`;
  const getMovies = await db.all(getAllMovies);
  response.send(getMovies);
});

app.post("/movies/", async (request, response) => {
  const newMovie = request.body;
  const { directorId, movieName, leadActor } = newMovie;
  const addMovie = `insert into movie (director_id,movie_name,lead_Actor)
    values ('${directorId}','${movieName}','${leadActor}');`;
  await db.run(addMovie);
  response.send("Movie successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const mQuery = `select * from movie
  where movie_id=${movieId};`;
  const getDetails = await db.get(mQuery);
  response.send(getDetails);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const updateMovie = request.body;
  const { directorId, movieName, leadActor } = updateMovie;
  const updateQuery = `
update movie set 
director_id='${directorId}',
movie_name='${movieName}',
lead_actor='${leadActor}'
where 
movie_id=${movieId};`;
  await db.run(updateQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
    delete from movie where movie_id=${movieId};`;
  await db.run(deleteQuery);
  response.send("Movie Deleted");
});

app.get("/directors/", async (request, response) => {
  const getAllDirectors = `
        select 
        *
        from 
        director;`;
  const getDirect = await db.all(getAllDirectors);
  response.send(getDirect);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getdirectors = `
        select 
        *
        from 
        movie
        where
        director_id=${directorId};`;
  const getMoviesdirect = await db.all(getdirectors);
  response.send(getMoviesdirect);
});
