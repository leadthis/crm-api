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

        const campanha_existe = await Campanha.Get(`titulo = '${body.titulo}'`);
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

};