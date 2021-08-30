import { Source } from "rdf-cube-view-query";

export const getSource = () =>
  new Source({
    endpointUrl: process.env.SPARQL_ENDPOINT || "https://lindas.admin.ch/query",
    // user: '',
    // password: ''
  });
