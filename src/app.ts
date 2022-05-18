import express ,{Application} from 'express';
import {PORT } from './config';
import routes from "./routes";
import db from "./db/models";
import * as bodyParser from "body-parser"
import {errorHandler} from "./config"
const app:Application = express();
const port = PORT || 5000
// app.use(express.json());
// app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json())

require("./config/passport");
app.use("/",routes)
app.use(errorHandler)
db.sequelize.authenticate({ logging: false}).catch(()=>{
    console.log("database not connected ")
}).then(()=>{
   console.log("db connected")
})
app.listen(port, () => {
  console.log(`running on port ${port}`);
});

