import resolve from "./resolver";
import * as riot from "riot";
import DataTable from "./table.riot";

(async () => {
  const data = await resolve();

  riot.register("data-table", DataTable);
  riot.mount("data-table", { data });
  
  // TODO SHOW ERROR MESSAGE
})().catch((err) => console.error(err));
