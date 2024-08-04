const http = require("http")
const app = http.createServer((req, res) => {
  res.write("On the way to being a full snack developer!")
  res.end()
})

app.listen(3000)

console.log("listening")
