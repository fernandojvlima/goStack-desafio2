const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4")

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const repos = repositories;
  response.json(repos)

});

app.post("/repositories", (request, response) => {
  //Utilizando desestruturação para separar as variáveis.
  const { title, url, techs, likes = 0 } = request.body;

  //Definindo o formato solicitado de registro, com id criado pela biblioteca uuid()
  const repository = { id: uuid(), title, url, techs, likes }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id === id)
  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Repository not founded"
    })
  }

  const editedRepo = { id, title, url, techs };
  repositories[repoIndex] = editedRepo;
  return response.json(editedRepo)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repository => repository.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({
      error: "Error deleting, try again"
    })
  }
  repositories.splice(repoIndex, 1)
  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(400).send()
  }

  repository.likes += 1;

  return response.json(repository)

});

module.exports = app;
