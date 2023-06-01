import App from "./app";
import { Pm2WatcherRoutes } from "./routes/pm2Watcher.route";

const app = new App([new Pm2WatcherRoutes()]);

app.listen();
