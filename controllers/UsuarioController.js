module.exports = (app) => {

    // [POST] => /usuario
    app.post("/usuario", async (req, res) => {
        const { body } = req;

        const resp = {};
        resp.status = 0;
        resp.data = null;
        resp.errors = [];

        let obrigatorias = [ "nome", "email", "senha" ];

        obrigatorias.forEach(campo => {
            req.assert(campo, `O campo '${campo}' é obrigatorio!`).notEmpty();
        });

        req.assert("email", "Informe um email válido!").isEmail();

        resp.errors = req.validationErrors() || [];

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
            data_criacao: new Date() / 1000 | 0
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
        res.status(201).send(resp);
    });

    // [POST] => /usuario/login
    app.post("/usuario/login", async (req, res) => {
        const { body } = req;

        const resp = {
            status: 0,
            msg: "",
            data: null,
            errors: []
        };
        
        const obrigatorios = [ "email", "senha" ];
        obrigatorios.forEach(campo => {
            req.assert(campo, `O campo '${campo}' é obrigatório!`).notEmpty();
        });
        
        req.assert("email", `Informe um email válido!`).isEmail();

        const validators = req.validationErrors();
        resp.errors = (validators) ? resp.errors.concat(validators) : resp.errors;

        if(resp.errors.length > 0){
            res.status(400).send(resp);
            return;
        }

        let usuario = await Usuario.Get(`email = '${body.email}'`);
        if(usuario.length == 0){
            resp.errors.push({
                param: "email",
                msg: "Email não encontrado!"
            });
            return res.status(404).send(resp);
        }

        usuario = usuario[0];

        if(usuario.senha !== Usuario.HashPassword(body.senha, usuario.id)){
            resp.errors.push({
                param: "senha",
                msg: "Senha incorreta!"
            });
            return res.status(401).send(resp);
        }

        const session = await Sessao.Generate(usuario.id);
        if(session === false){
            resp.errors.push({
                location: "login",
                msg: "Erro ao realizar Login"
            });
            return res.status(500).send(resp);
        }

        resp.status = 1;
        resp.msg = "Login realizado com sucesso!";
        resp.data = {
            sid: session.id,
            date: session.ultima_data
        };
        res.send(resp);
    });
    
    // [POST] => /usuario/logout
    app.post(`/usuario/logout`, async (req, res) => {
        const resp = {
            status: 0,
            data: null,
            errors: []
        };

        if(!req.headers['authorization']){
            resp.errors.push({
                location: "header",
                param: "Authorization",
                msg: "A Session ID precisa ser informada!"
            });
            res.status(403).send(resp);
            return
        }
        
        const sessao = await Sessao.Get(`id = '${req.headers["authorization"]}'`);
        
        if(sessao.length == 0){
            resp.errors.push({
                param: "sid",
                msg: "Sessão não encontrada."
            });
            res.status(404).send(resp);
            return;
        }
        
        Sessao.Delete(`id = '${req.headers["authorization"]}'`);
        
        resp.status = 1;
        resp.msg = "Logout com sucesso!";
        res.send(resp);
    });
    
    // [GET] => /usuario/:id
    app.get("/usuario/perfil", async (req, res) => {
        const resp = {
            status: 0,
            msg: "",
            data: null,
            errors: []
        };

        if(!req.headers['authorization']){
            resp.errors.push({
                location: "header",
                param: "Authorization",
                msg: "A Session ID precisa ser informada!"
            });
            return res.status(403).send(resp);
        }

        const session = await Sessao.Verificar(req.headers['authorization']);

        if(session.status == 0){
            resp.errors.push(
                {
                    "location": "params",
                    "param": "sid",
                    "msg": session.msg
                }
            );
            return res.status(403).send(resp);
        }

        const usuario = (await Usuario.Get(`id = '${session.usuario}'`))[0];
        resp.status = 1;
        resp.data = usuario;
        res.send(resp);
    });
    

};