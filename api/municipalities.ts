import { NowRequest, NowResponse } from "@vercel/node";
import { getSource } from "../src/api";

const { Source } = require("rdf-cube-view-query") as any;

const getMunicipalies = async ({ name, limit, source }) => {
  const sparql = `
    SELECT DISTINCT ("municipality" AS ?type) (?municipality AS ?iri) (?municipalityLabel AS ?name) WHERE {
      GRAPH <https://lindas.admin.ch/fso/agvch> {
        VALUES ?class { <https://schema.ld.admin.ch/Municipality> <https://schema.ld.admin.ch/AbolishedMunicipality> }
        ?municipality a ?class .
        ?municipality <http://schema.org/name> ?municipalityLabel .
      }
      FILTER (regex(?municipalityLabel, ".*${name}.*", "i"))
    } LIMIT ${limit}
  `;

  const results = await source.client.query.select(sparql);

  console.log(sparql);

  return {
    municipalities: results.map((r) => {
      return {
        id: r.iri.value.replace(
          "https://register.ld.admin.ch/municipality/",
          ""
        ),
        name: r.name.value,
      };
    }),
  };
};

module.exports = async (req: NowRequest, res: NowResponse) => {
  if (!req.query.name) {
    return res
      .status(400)
      .json({ message: "Please provide a `name` parameter" });
  }

  const source = getSource();

  const municipalities = await getMunicipalies({
    name: req.query.name,
    limit: 100,
    source,
  });

  res.json(municipalities);
};
