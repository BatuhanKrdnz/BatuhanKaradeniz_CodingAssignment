const db = require("../utils/db");
const axios = require("axios");

const getRegions = function(countries) {
  const regions = {};

  // Group countries by their respective regions
  for (let i = 0; i < countries.length; i++) {
    const country = countries[i];
    const region = country.region;

    if (!regions[region]) {
      regions[region] = [];
    }

    regions[region].push(country);
  }

  return regions;
}

const getCountries = function (req, res) {
  const conn = db.getDB();
  const Country = conn.model("Country");
  const filter = req.query; // {region: "Apac", name: "Japan"}
  const select = { _id: 0 }; // Do not get "_id" property

  Country.find(filter, select, function (err, data) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
      return;
    }

    res.json({ data: data });
  });
};

const getSalesrep = function (_, res) {
  axios
    .get(process.env.APP_URL + "/countries", {
      headers: {
        "Content-Type": "application/json"
      },
      data: {}
    })
    .then(function(response) {
      console.log(`statusCode: ${response.status}`);

      const countries = response.data.data;
      const regions = getRegions(countries);

      const regionNames = Object.keys(regions); // ["Apac", "Europe", "America"]
      const results = [];

      for (let i = 0; i < regionNames.length; i++) {
        const regionName = regionNames[i];
        const regionCountries = regions[regionName];
        const count = regionCountries.length; // No of countries in that region
        const minReq = Math.ceil(count / 7); // 2
        const maxReq = Math.ceil(count / 3); // 4
        const result = {
          region: regionName,
          minSalesReq: minReq,
          maxSalesReq: maxReq,
        };
        results.push(result);
      }

      res.json({data: results});
    })
    .catch(function(error) {
      console.error(error);
      res.json({ key: "value2" });
    });
};

const getOptimal = function(_, res) {
  axios
    .get(process.env.APP_URL + "/countries", {
      headers: {
        "Content-Type": "application/json"
      },
      data: {}
    })
    .then(function(response) {
      console.log(`statusCode: ${response.status}`);

      const countries = response.data.data;
      const results = [];
      const regions = getRegions(countries); // {"Apec": [{"name": "Japan", "region": "Apec"}, ...], ...}
      const regionNames = Object.keys(regions);

      for (let i = 0; i < regionNames.length; i++) {
        const regionName = regionNames[i];
        const countryList = regions[regionName];
        const count = countryList.length; // No of countries in that region
        const minReq = Math.ceil(count / 7); // 2

        for (let j = 0; j < minReq; j++) {
          const countryCount = Math.ceil(countryList.length / minReq);
          const repCountryList = countryList.slice(j * countryCount, (j + 1) * countryCount);
          const salesRep = {
            region: regionName,
            countryList: repCountryList,
            countryCount: repCountryList.length,
          };
          results.push(salesRep);
        }
      }

      res.json({data: results});
    })
    .catch(function(error) {
      console.error(error);
      res.json({ key: error });
    });
}

module.exports = {
  getCountries: getCountries,
  getSalesrep: getSalesrep,
  getOptimal: getOptimal,
};
