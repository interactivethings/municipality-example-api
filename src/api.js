module.exports = ({ query, limit }) => {
  return `{
  SELECT DISTINCT ("municipality" AS ?type) (?municipality AS ?iri) (?municipalityLabel AS ?name) WHERE {
    GRAPH <https://lindas.admin.ch/fso/agvch> {
      VALUES ?class { <https://schema.ld.admin.ch/Municipality> <https://schema.ld.admin.ch/AbolishedMunicipality> }
      ?municipality a ?class .
      ?municipality <http://schema.org/name> ?municipalityLabel .
    }
    FILTER (regex(?municipalityLabel, ".*${query}.*", "i"))
  } LIMIT ${limit}
}`;
};
