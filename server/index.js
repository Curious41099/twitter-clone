const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request,response) => {
    response.json({
        message: 'Meow🤣😊'
    });
});

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
            mew.Content && mew.Content.toString().trim() !== '';    
}

app.post('/mews', (request,response) => {
   if(isValidMew(request.body)) {
    // insert it into database.
    const mew = {
        name: request.body.name.toString(),
        content: request.body.Content.toString()
    };
   }
   else{
    response.status(422);
    response.json({
        message: 'Hey, name ans content are required!!!'
    });
   }
});

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});
