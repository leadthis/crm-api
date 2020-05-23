module.exports = (app) => {
    
    // [POST] => /cliente
    app.post(`/cliente`, async (req, res) => {
        const { body } = req;

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

        const obrigatorios = [ "nome", "sexo", "nascimento", "email" ];

        obrigatorios.forEach(campo => {
            req.assert(campo, `O campo '${campo}' é obrigatorio!`).notEmpty();
        });

        req.assert("email", "Informe um email válido!").isEmail();

        resp.errors = req.validationErrors() || [];

        if(resp.errors.length > 0){
            res.status(400).send(resp);
            return;
        }

        const existe = await Cliente.Get(`email = '${body.email}'`);
        if(existe.length > 0){
            resp.errors.push({
                param: "email",
                msg: "Email já está em uso!"
            });
            return res.status(409).send(resp);
        }

        const id = Util.generateId();
        const data = {
            id: id,
            nome: body.nome,
            email: body.email,
            sexo: body.sexo,
            nascimento: body.nascimento,
            data_inclusao: new Date() / 1000 | 0,
            usuario: session.usuario
        };

        const create = await Cliente.Create(data);

        if(create.status === 0){
            resp.errors.push({
                msg: create.msg
            });
            return res.status(500).send(resp);
        }

        resp.status = 1;
        resp.data = id;
        resp.msg = "Cliente criado com sucesso!";
        res.status(201).send(resp);
    });

    // [GET] => /cliente
    app.get(`/cliente`, async (req, res) => {
        const { query } = req;

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

        let where = `usuario = '${session.usuario}'`;
        where += (query.where) ? `AND ( ${ query.where } )` : "";

        let order_by = (query.order_by) ? query.order_by : "";
        let limit = (query.limit) ? query.limit : "";

        const clientes = await Cliente.Get(where, order_by, limit);

        resp.status = 1;
        resp.data = clientes || [];
        res.send(resp);
    });

};