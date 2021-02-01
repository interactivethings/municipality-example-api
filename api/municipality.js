const {
  Source
} = require("rdf-cube-view-query");

const getMunicipality = async ({ id, source }) => {
  const iri = `https://register.ld.admin.ch/municipality/${id}`;

  const sparql = `
SELECT DISTINCT ?name {
  <${iri}> <http://schema.org/name> ?name.
}
  `;

  const result = (await source.client.query.select(sparql))[0];

  return result ? { id, name: result.name.value } : null;
};


module.exports = (req, res) => {

  const source = new Source({
    endpointUrl:
      process.env.SPARQL_ENDPOINT ?? "https://test.lindas.admin.ch/query",
    // user: '',
    // password: ''
  });


  const municipality = await getMunicipality({id: req.query.id, source});



  res.json(municipality);
};
