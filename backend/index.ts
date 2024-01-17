import {BootstrapApp} from "./app";

BootstrapApp().then(app => {
    if (app) {
        const port = process.env.PORT || 3001;
        app.listen(port, () => console.log(`App listening on PORT ${port}`));
    }
    else {
        console.error("Failed to bootstrap the app!")
    }
}).catch(err => console.error(err))