const {
  Source
} = require("rdf-cube-view-query");

const getMunicipalies = async ({ name, limit, source }) => {
  const iri = `https://register.ld.admin.ch/municipality/${id}`;

  const sparql = `{
    SELECT DISTINCT ("municipality" AS ?type) (?municipality AS ?iri) (?municipalityLabel AS ?name) WHERE {
      GRAPH <https://lindas.admin.ch/fso/agvch> {
        VALUES ?class { <https://schema.ld.admin.ch/Municipality> <https://schema.ld.admin.ch/AbolishedMunicipality> }
        ?municipality a ?class .
        ?municipality <http://schema.org/name> ?municipalityLabel .
      }
      FILTER (regex(?municipalityLabel, ".*${name}.*", "i"))
    } LIMIT ${limit}
  }`;

  const results = await source.client.query.select(sparql);

  return results.length > 0
    ? {
        municipalities: results.map((r) => {
          return { id, name: r.name.value };
        }),
      }
    : null;
};

module.exports = (req, res) => {
  const source = new Source({
    endpointUrl:
      process.env.SPARQL_ENDPOINT ?? "https://test.lindas.admin.ch/query",
    // user: '',
    // password: ''
  });

  const municipalities = await getMunicipalies({name: req.query.name, limit: 100, source});


  res.json(municipalities);
};
