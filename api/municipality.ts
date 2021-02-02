import { NowRequest, NowResponse } from "@vercel/node";
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

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (req.query.id === undefined) {
    return res.status(400).json({ message: "Please provide a `id` parameter" });
  }

  const source = getSource();

  const municipality = await getMunicipality({ id: req.query.id, source });

  if (!municipality) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(municipality);
};
