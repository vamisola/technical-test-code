const fs = require("fs");
const dataFile = "./data/company.json";
const _ = require("underscore");

module.exports = (app) => {
    let companies = {};
    let filterActive = {};
    let filterInactive = {};

    fs.readFile(dataFile, "utf-8", (err, data) => {
        if (err) throw err;
        let parsedData = JSON.parse(data);
        companies = parsedData;
        console.log(companies);

        filterActive =  _.where(companies.company, {status: "active"});
        console.log(filterActive);

        filterInactive = _.where(companies.company, {status: "inactive"});
        console.log(filterInactive);


    });

    app.get('/', (req, res) => {
        res.render("login");
    });

    app.get('/companies', (req, res) => {
        res.render("landing", {
            companies: companies, filterActive: filterActive, filterInactive:filterInactive
        });
    });

    app.post('/companies', (req,res) => {
        let optradio =  req.body.optradio;
        console.log(optradio);
    });
}