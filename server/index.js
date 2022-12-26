const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');




const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/twitter-clone');
const mews = db.get('mews');
const filter = new Filter();

app.use(cors());
app.use(express.json());


app.get('/', (request,response) => {
    response.json({
        message: 'Meower🤣😊'
    });
});

app.get('/mews', (request,response) => {
    mews
        .find()
        .then(mews => {
            response.json(mews);
        });
});

function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
            mew.Content && mew.Content.toString().trim() !== '';    
}

app.use(rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	max: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

app.post('/mews', (request,response) => {
   if(isValidMew(request.body)) {
    // insert it into database.
    const mew = {
        name: filter.clean(request.body.name.toString()),
        content: filter.clean(request.body.Content.toString()),
        created: new Date()
    };
    mews
        .insert(mew)
        .then(createdMew => {
        response.json(createdMew);
    });
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
