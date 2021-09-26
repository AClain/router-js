import { Router } from "./router.js";
import { routes } from "./routes.js";

let router = new Router(routes);

router.init(routes);
router.run();
