module.exports = (app) => {

    // [POST] => /campanha
    app.post(`/campanha`, async (req, res) => {
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

        const obrigatorios = [ "titulo", "regras" ];

        obrigatorios.forEach(campo => {
            req.assert(campo, `O campo '${campo}' é obrigatório!`).notEmpty();
        });

        resp.errors = req.validationErrors() || [];

        if(body.regras && !Array.isArray(body.regras)){
            resp.errors.push({
                param: "regras",
                msg: "É preciso fornecer um Array de Regras!"
            });
        }

        if(resp.errors.length > 0){
            return res.status(400).send(resp);
        }

        const campanha_existe = await Campanha.Get(`titulo = '${body.titulo}' AND usuario = '${session.usuario}' AND excluido = 0`);
        if(campanha_existe.length > 0){
            resp.errors.push({
                param: "titulo",
                msg: "Já existe uma campanha com este título!"
            });
            return res.status(409).send(resp);
        }

        const campanha_id = Util.generateId();
        const data = {
            id: campanha_id,
            titulo: body.titulo,
            usuario: session.usuario
        };
        
        body.regras.forEach(regra => {
            Regra.Create({
                id: Util.generateId(),
                referencia: `${Campanha.entity}:${campanha_id}`,
                campo: regra.campo,
                comparador: regra.comparador,
                valor: regra.valor
            });
        });

        const create = await Campanha.Create(data);

        if(create.status !== 1){
            resp.errors.push({
                msg: create.msg
            });
            return res.status(500).send(resp);
        }

        resp.status = 1;
        resp.msg = "Campanha criada!";
        res.status(201).send(resp);
    });

    // [GET] => /campanha
    app.get(`/campanha`, async (req, res) => {
        const query = req.query;
        const resp = {};
        resp.status = 0;
        resp.data = null;
        resp.errors = [];

        if(!req.headers['authorization']){
            resp.errors.push({
                location: "header",
                param: "Authorization",
                msg: "A Session ID precisa ser informada!"
            });
            res.status(401).send(resp);
            return;
        }

        const session = await Sessao.Verificar(req.headers['authorization']);
        if(session.status !== 1){
            resp.errors.push(
                {
                    "location": "params",
                    "param": "sid",
                    "msg": session.msg
                }
            );

            res.status(403).send(resp);
            return;
        }

        let where = `usuario = '${session.usuario}' AND excluido = 0`;
        where += (query.where) ?  ` AND (${query.where})` : "";
        let order_by = (query.order_by) ? query.order_by : "";
        let limit = (query.limit) ? query.limit : "";

        const campanhas = await Campanha.Get(where, order_by, limit);

        const count = await Campanha.Count(where);

        res.set("X-TOTAL-COUNT", count);

        resp.status = 1;
        resp.data = campanhas;
        res.send(resp);
    });

    // [DELETE] => /campanha/:id
    app.delete(`/campanha/:id`, async (req, res) => {
        const { params } = req;
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
            res.status(401).send(resp);
            return;
        }

        const session = await Sessao.Verificar(req.headers['authorization']);
        if(session.status !== 1){
            resp.errors.push(
                {
                    "location": "params",
                    "param": "sid",
                    "msg": session.msg
                }
            );

            res.status(403).send(resp);
            return;
        }

        let campanha = await Campanha.Get(`id = '${params.id}' AND usuario = '${session.usuario}' AND excluido = 0`);

        if(campanha.length == 0){
            resp.errors.push({
                param: "id",
                msg: "Campanha não encontrada!"
            });
            return res.status(404).send(resp);
        }

        campanha = campanha[0];

        const excluir = await Campanha.Delete(`id = '${params.id}'`);

        if(excluir.status !== 1){
            resp.errors.push({
                msg: "Erro ao excluir"
            });
            return res.status(500).send(resp);
        }

        resp.status = 1;
        resp.msg = "Campanha excluída com sucesso!";
        res.send(resp);
    });

    // [GET] => /campanha/:id
    app.get(`/campanha/:id`, async (req, res) => {
        const { params } = req;
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
            res.status(401).send(resp);
            return;
        }

        const session = await Sessao.Verificar(req.headers['authorization']);
        if(session.status !== 1){
            resp.errors.push(
                {
                    "location": "params",
                    "param": "sid",
                    "msg": session.msg
                }
            );

            res.status(403).send(resp);
            return;
        }

        let campanha = await Campanha.Get(`id = '${params.id}' AND usuario = '${session.usuario}' AND excluido = 0`);

        if(campanha.length == 0){
            resp.errors.push({
                param: "id",
                msg: "Campanha não encontrada!"
            });
            return res.status(404).send(resp);
        }

        campanha = campanha[0];
        campanha.regras =  await Regra.Get(`referencia = '${Campanha.entity}:${campanha.id}'`);
        
        resp.status = 1;
        resp.data = campanha;
        res.send(resp);
    });

};