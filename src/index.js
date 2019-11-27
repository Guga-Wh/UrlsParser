const express = require('express')
require('./db/mongoose')
const urlRouter = require('./router/url')

const port = process.env.PORT
const app = express()

app.use(express.json())
app.use(urlRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})