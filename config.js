const express = require("express");
const consign = require("consign");
const bodyparser = require("body-parser");
const expressValidator = require("express-validator");


const cors = require('cors');


module.exports = () => {
    const app = express();

    app.use(cors());
    app.use(bodyparser.urlencoded({extended: true}));
    app.use(bodyparser.json());
    app.use(expressValidator());

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        // res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });
    
    var fs = require("fs");
    var directories = [ "Tools", "classes" ];
    directories.forEach(dir => {
        try{
            var files = fs.readdirSync(dir);
            files.forEach(function (file) {
                var Class = require("./" + dir + "/" + file);
                global[file.split(".")[0]] = Class;
            });
        }catch(e){
            console.log(e);
        }
    });

    consign().include("controllers").into(app);
    return app;
};

