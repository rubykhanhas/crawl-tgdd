import "module-alias";
import {addAliases} from "module-alias";
import path from "path";

addAliases({
  "@": path.join(__dirname, "src"),
});
