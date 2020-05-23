const app = require("./config/custom-express")();

const port = 3333;

app.listen(port, async () => {
    console.clear();
    console.log(`Rodando na porta ${port}`);
});