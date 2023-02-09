const router = require("express").Router()
const controller = require('./controller')
const multer = require("../functions/multer")

router.post('/', controller.signUp)
router.post('/signin', controller.signIn)
router.post('/getuserdata', controller.getUserData)
router.post("/editany", controller.editAny)
router.post("/getallusers", controller.getUsersList)

module.exports = router
