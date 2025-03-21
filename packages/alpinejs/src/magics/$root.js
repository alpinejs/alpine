import { closestRoot } from "../lifecycle.js";
import { magic } from "../magics.js";

magic('root', el => closestRoot(el))
