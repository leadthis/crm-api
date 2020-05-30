global.PROD = (process.env.NODE_ENV == "prod");
const app = require("./config")();

const port = (PROD) ? 3000 : 3333;

app.listen(port, async () => {
    console.clear();
    console.log(`Rodando na porta ${port}`);

    const Jobs = require('./Jobs');
    Jobs();
});