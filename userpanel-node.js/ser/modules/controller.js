const schema = require("./schema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET
const fs = require("fs")


module.exports.signUp = async (req, res) => {
  const {username, password} = await req.body
  const candidate = await schema.findOne({username: username})
  if (!candidate) {
   const crypted = await bcrypt.hash(password, 10);

   const readyToSave = {
    username: username,
    password: crypted,
 
      age: 0,
      gender: "",
      role: "",
      image: ""
    }

   const created = await schema.create(readyToSave)
   created.save()
   fs.mkdirSync(`C:/Users/user/Desktop/userpanel/cli/src/uploads/${username}`, )
   res.json({message: "created"});
  } else {
   res.json({message: "username already exists"})
  }
}


module.exports.signIn = async (req, res, next) => {
 const {username, password} = req.body
 const candidate = await schema.findOne({username: username});
  if (candidate) {
   const compared = bcrypt.compareSync(password, candidate.password)
   if (compared) {
    jwt.sign({candidate}, secret, {expiresIn: "1d"}, (err, token) => {
    res.json({message: `logged in\n window will be reloaded`, token})
   })
   } else {
    return res.status(200).json({message: "wrong password"})
   }
  } else if (!candidate) {
   res.json({message: "username not found\n window will be reloaded"})
  }
}




module.exports.getUserData = async (req, res, next) => {
  const currentToken = await req.body.sessionData
  jwt.verify(currentToken, secret, async (err, data) => {
  const user = await schema.findById(data.candidate._id)
  res.send({username: user.username, age: user.age, gender: user.gender, role: user.role, image: user.image})
 })
}


module.exports.getUsersList = async (req, res, next) => {
 
  const usersList = await schema.find({});
  res.json(usersList);
}



module.exports.editAny = async (req, res) => {
 var _Data = await req.body;
 var sess = await Object.values(_Data)[0];
 var _value = await Object.values(_Data)[1];
 var _key = Object.keys(_Data)[1];
 const ready = [_key][0]
 jwt.verify(sess, secret, (error, result) => {
  if (error) {
   res.send(error)
  } else {
   schema.findByIdAndUpdate({_id: result.candidate._id}, {[_key]: _value}, (err, r) => {
    res.send(err ? err : r)
   })
  }
 })
}
