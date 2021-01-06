import resolve from "./resolver";
import * as riot from "riot";
import ProjectsList from "./components/projects-list.riot";

(() => {
  riot.register("projects-list", ProjectsList);
  riot.mount("projects-list");
})();
