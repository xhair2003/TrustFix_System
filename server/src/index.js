const dotenv = require('dotenv');
const express = require('express'); 
const app = express();
const cors = require('cors');   
const  {createServer} = require('http');


//config evn
dotenv.config();
const connectDB = require('../config/connect_db');  
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 









connectDB().then(() => {
    console.log('Database connected');
}
).catch((err) => {
    console.log('Error connecting to database', err);
}
);


const httpServer = createServer(app);
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
