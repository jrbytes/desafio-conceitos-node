const express = require("express")
const cors = require("cors")
const { uuid, isUuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (request, response) => {
  return response.json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(), title, url, techs, likes: 0
  }

  repositories.push(repository)
  
  return response.json(repository)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (!isUuid(id)) {
    return response.status(400).json({error: 'Invalid ID'})
  }
  
  if (repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  const likesSearch = repositories.find(repo => repo.id === id)
  
  const repository = {
    id, title, url, techs, likes: likesSearch.likes
  }

  repositories[repoIndex] = repository

  return response.json(repository)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)
  
  if (repoIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }
  
  const searchRepo = repositories.find(repo => repo.id === id)

  searchRepo.likes++

  return response.json(searchRepo)
})

module.exports = app