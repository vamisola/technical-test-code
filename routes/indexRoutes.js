const fs = require("fs");
const dataFile = "./data/company.json";

module.exports = (app) => {
    let companies = {};

    fs.readFile(dataFile, "utf-8", (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        companies = parsedData;
        console.log(companies);
    });

    app.get('/', (req, res) => {
        res.render("login");
    });

    app.get('/companies', (req, res) => {
        res.render("landing", {
            companies: companies
        });
    });

    app.post('/companies', (req,res) => {
        let optradio =  req.body.optradio;
        console.log(optradio);
    });
}