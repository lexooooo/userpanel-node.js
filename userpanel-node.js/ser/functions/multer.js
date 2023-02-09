const multer = require("multer")
const path = require("path")
const fs = require("fs")
const schema = require("../modules/schema")
const jwt = require("jsonwebtoken")
const routerImg = require("express").Router()

// const storage = multer.diskStorage({
 
//  destination: (req, file, cb) => {
//     cb(null, `cli/src/uploads/root`)
//  },

//  filename:  (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//  }   
// })

let folderName = ""

async function fileReader(user_folder) {
      fs.readdir(process.cwd() + `/cli/src/uploads/${user_folder}`, async (err, files) => {
      const validFIle = files[0].slice(-4)
      if (validFIle == ".gif" || ".png" || ".jpg") {
       fs.unlinkSync(`C:/Users/user/Desktop/userpanel/cli/src/uploads/${user_folder}/${files[0]}`)       
      } else {
       return false
      }

    })
  }




routerImg.post('/', async (req, res, next) => {

  const token = await req.headers.authorization.replace("bearer ", "")

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    await fileReader(data.candidate.username);
    const storage = multer.diskStorage({
 
      destination: (req, file, cb) => {
         cb(null, `cli/src/uploads/${data.candidate.username}`)
      },
     
      filename:  (req, file, cb) => {
         cb(null, Date.now() + path.extname(file.originalname))
      }   
    })


    const upload = multer({storage: storage}).single("image")
    if (err) console.log(err)
    else
    {
      upload(req, res, async (err) => {
       
        if (err) console.log(err)
        else if (req.file.filename.length <= 0)
        {
          return false
        }
        else
        {
          await schema.findByIdAndUpdate({_id: data.candidate._id}, {image: req.file.filename})
          res.send('its done')
        }
      })
    }
  })

})


module.exports = routerImg