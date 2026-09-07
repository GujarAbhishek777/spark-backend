const express = require("express");
const app = express();

app.use(express.json());

app.use("/abhishek", (req, res) => {
    res.send("Hi Hello Abhishek Gujar")
})
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
