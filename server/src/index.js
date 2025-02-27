const dotenv = require('dotenv');
const express = require('express'); 
const app = express();
const cors = require('cors');   
const  {createServer} = require('http');


//config evn
dotenv.config();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





console.log('Duc Anh dep trai vai l');
app.get('/', (req, res) => {
    res.send('Duc Anh dep trai vai l');
});






const httpServer = createServer(app);
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
