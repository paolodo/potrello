import { ObjectId } from 'mongodb';

async function signup(req, reply) {
  const { username, password, email } = req.body

  const users = this.mongo.db.collection("users")
  const data = { username, password, email }
  const findEmail = await users.findOne({ email: email })
  console.log(findEmail)
  if (findEmail) {
    reply.code(500).send({ message: "email already in use" })
  }
  const findUser = await users.findOne({ username: username })
  if (findUser) {
    reply.code(500).send({ message: "username already in use" })
  }
  const result = await users.insertOne(data)
  return { token: this.jwt.sign({ username }) }
}

async function login(req, reply) {
  const { password, email } = req.body
  const users = this.mongo.db.collection("users")

  const result = await users.findOne({ email: email })
  if (result) {
    if (password === result.password) {
      return { token: this.jwt.sign({ email }) }
    } else {
      reply.code(500).send({ message: "wrong password" })
    }
  }
  reply.code(400).send({ message: "user not found" })
}
async function getUser(req, reply) {
  const users = this.mongo.db.collection("users")
console.log(new ObjectId(req.params.id))
  const result = await users.findOne({ _id: new ObjectId(req.params.id) })
  if (result) {
    
    return reply.send(result)
  }
  reply.code(404).send({ message: "Not found" })
}
export { signup, login, getUser }
