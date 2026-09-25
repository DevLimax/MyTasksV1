import express from "express";
import cors from 'cors';
import router from "./api/express/api";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(router);
app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
