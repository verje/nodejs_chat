var express = require('express');
var router = express.Router();
const {body, validationResult } = require('express-validator');
const modelUser = require('../models/modelUsers');
const multer = require('multer');
//const clientes = require ('../models/clientesSchema');
//const checkAuthentication = require('../handlers/checkAuth');

const storage = multer.diskStorage({
    destination: 'public/images/avatars',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage : storage}).single('photo');

router.get('/', function(req, res) {
    res.render('pages/index');
});

router.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.send(req.file);
    });
});

router.get('/register', function(req, res) {
    res.render('pages/register');
});
router.post('/register', 
    
    body('nickname').not().isEmpty().trim().escape(),
    body('password').isLength({min: 5}),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        // Indicates the success of this synchronous custom validator
        return true;
      }),
        (req, res) => {
        const {nickname, password, re_password, path_picture} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            var err = JSON.stringify(Object.values(errors)[1]);
            var err_to_json = JSON.parse(err);
            error_msg = err_to_json[0].msg
            return res.render('pages/register', {error_msg, nickname});
        }
        modelUser.findOne({'username': req.body.nickname}, (err, user)=>{
            if(err){
                return res.render('pages/register', {error_msg: 'Username already register. Please try diferent one'});
            } else {
                if(user) return res.render('pages/register', {error_msg: 'Username already register. Please try another one'});
                const newUser = new modelUser();
                newUser.username = req.body.nickname;
                newUser.password = req.body.password;
                newUser.image = req.body.path_picture;
                newUser.save(function(err, doc){
                    if(err) res.json(err);
                    else
                    res.render('pages/index', {msg: 'Register Completed Succesfully. You can now login'})
                });

            }
        });
});

router.post('/chat', (req, res)=>{

    const {nickname, password, room} = req.body;

    modelUser.findOne({'username': req.body.nickname, 'password': req.body.password}, (err, user)=>{
        if(user) {
            res.render('pages/chat_room', {user});
        } else {
            res.render('pages/index', {error_msg: 'Incorrect Login information'});
        }

    });
    
});

module.exports = router;