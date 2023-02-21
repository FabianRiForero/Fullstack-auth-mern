import app from "./app.js";
// import db from './database/config/config.js';

const main = async () => {
    // await db.sync();
    app.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`));
}

main();