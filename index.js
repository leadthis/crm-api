const app = require("./config")();

const port = 3333;

app.listen(port, async () => {
    console.clear();
    console.log(`Rodando na porta ${port}`);
});