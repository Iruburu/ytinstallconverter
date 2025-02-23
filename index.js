import path from 'path'
import express from 'express'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
 
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 1313

app.use(express.json())

console.log(__dirname)

app.get('/', function(req, res) {
    return res.send('Olá, mundo!')
})

app.post('/api/*', function(req, res) {
    const body = req.body

    console.log(body);

    res.send({data: 'Olá, mundo!'})
})

app.get('/*', function(req, res) {

    const params = req.params[0]
    const filePath = path.join(__dirname, params)

    console.log(params)

    res.sendFile(filePath)
})

app.listen(port, function() { 
    console.log('Rodando na porta: ' + port)
})