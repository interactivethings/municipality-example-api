import { getSource } from "../src/api";

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

module.exports = async (req, res) => {
  const source = getSource();

  const municipality = await getMunicipality({ id: req.query.id, source });

  res.json(municipality);
};
