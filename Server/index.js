express = require('express')
mongoose = require('mongoose')
cors = require('cors')

const app = express()
app.use(cors())
const connection_string =
  "mongodb+srv://akash03rai:EOv4hguHcH28MOhT@cluster0.mkponft.mongodb.net/";

mongoose.connect(connection_string).then((res) => {
    console.log("Connection successful")
})

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return /^https?:\/\/.+/.test(value);
      },
      message: "Invalid URL format",
    },
  },
  alias: {
    type: String,
    unique: true,
  },
  visits: {
    type: Number,
    default: 0,
    validate: {
      validator: Number.isInteger
    },
  }
});

var Url = mongoose.model('Url', urlSchema);
var base_url = "https://short-url-api-5fwd.onrender.com/";

getRandomString = async () => {
    const len = Math.floor(Math.random() * 7 + 3);
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let aliasString = '';

    for(let i = 0; i < len; i++) {
        const index = Math.floor(Math.random() * 62);
        aliasString += characters.charAt(index);
    }

    const res = await Url.findOne({alias : aliasString});
    if(res != null) return await getRandomString();
    console.log(aliasString)
    return aliasString
}

app.get('/create', async (req, res) => {
    const alias = await getRandomString();
    try {
        input = {
            url : req.query.url,
            alias : alias,
            visits : 0
        }
        await Url.create(new Url(input))
    }

    catch {
        res.status(400).json({url : "Invalid URL"})
        return
    }

    res.json({ url: base_url + alias });
})

app.get('/visits/:id', async (req, res) => {
    const getVisit = await Url.findOne({alias : req.params.id})
    if(getVisit == null) res.status(404).json({data : "Invalid URL"})
    else res.status(200).json({data : getVisit.visits})
})

app.get('/:id', async (req, res) => {
    const check = await Url.findOne({alias : req.params.id});
    if(check == null) res.send("<h1>Invalid URL</h1>");
    else {
        await Url.updateOne({alias : req.params.id}, {visits : check.visits + 1})
        res.redirect(check.url)
    }
})

const port = 80;
app.listen(port, () => {
    console.log("Server Running at port 80")
})