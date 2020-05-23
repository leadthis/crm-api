module.exports = (app) => {

    // [POST] => /usuario
    app.post("/usuario", async (req, res) => {
        const { body } = req;

        const resp = {
            status: 0,
            msg: "",
            errors: [],
            data : null,
        };

        let obrigatorias = [ "nome", "email", "senha" ];

        obrigatorias.forEach(campo => {
            req.assert(campo, `O campo '${campo}' é obrigatorio!`).notEmpty();
        });

        req.assert("email", "Informe um email válido!").isEmail();

        resp.errors = req.validationErrors();

        if(resp.errors.length > 0){
            res.status(400).send(resp);
            return;
        }
        

        const exists = await Usuario.Get(`email = '${body.email}'`);
        
        if(exists.length > 0){
            resp.errors.push({
                param: "email",
                msg: "Este email já está sendo utilizado!"
            });
            res.status(400).send(resp);
            return;
        }
        
        const id = Util.generateId();
        const data = {
            id: id,
            nome: body.nome,
            email: body.email,
            senha: Usuario.HashPassword(body.senha, id),
        };

        const create = await Usuario.Create(data);

        if(create.status !== 1){
            resp.errors.push({
                msg: create.msg
            });
            res.status(500).send(resp);
            return;
        }

        resp.status = 1;
        resp.data = id;
        resp.msg = "Usuário criado com sucesso!";
        res.send(resp);
    });
    
    // [GET] => /usuario
    app.get("/usuario", async (req, res) => {

    });
    
    // [GET] => /usuario/:id
    app.get("/usuario/:id", async (req, res) => {});
    
    // [PUT] => /usuario/:id
    app.put("/usuario/:id", async (req, res) => {});
    
    // [DELETE] => /usuario
    app.delete("/usuario/:id", async (req, res) => {});

};