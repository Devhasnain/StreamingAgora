const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
// const ApiVideoClient = require('@api.video/nodejs-client');
const Routes = require("./routes");

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));


let API_VIDEO_KEY = "KVFT6TpjuLV549pcakVi5V6E8srqqEP2laPTf4vfz8y"


app.get("/", (req, res) => {
    try {
        return res.status(200).json({ msg: "Hello" })
    } catch (error) {
        return res.status(500).json({ msg: error?.message })
    }
});

// app.get("/streams", async (req, res) => {
//     try {
//         const client = new ApiVideoClient({ apiKey: API_VIDEO_KEY });

//         const result = await client.liveStreams.list()

//         return res.status(200).json(result?.data);

//     } catch (error) {
//         return res.status(200).json({ msg: error?.message ?? "Internal server error." })
//     }
// })

app.use("/api", Routes);

module.exports = app;