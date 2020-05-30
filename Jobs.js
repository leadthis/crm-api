const Jobs = async () => {

    const campanhas = await Campanha.Get(`jornada = "" OR jornada is NULL AND status = 1`);

    campanhas.forEach(async campanha => {
        const usuario = (await Usuario.Get(`id = '${campanha.usuario}'`))[0];
        if(!usuario){ return; }
        
        const regras = await Regra.Get(`referencia = '${Campanha.entity}:${campanha.id}'`);
        if(regras.length == 0) return;

        const campanhasEnviadas = (await CampanhaEnviada.Get(`campanha = '${campanha.id}'`)).map(x => x.cliente);

        const campos_regras = [];
        regras.forEach(regra => {
            if(!campos_regras.includes(regra.campo)){
                campos_regras.push(regra.campo);
            }
        });


        const __regras = [];
        campos_regras.forEach(campo => {
            const _regras = regras.filter(x => x.campo == campo);
            
            if(_regras.length > 1){
                __regras.push({
                    campo: campo,
                    comparador: "in",
                    valor: `('${ _regras.map(x => x.valor).join("', '") }')`
                });
            }else{
                __regras.push({
                    campo: campo,
                    comparador: "=",
                    valor: _regras[0].valor
                });
            }

        });

        const regras_query = (__regras.map((regra) => {
            let campo = (["id", "status"].includes(regra.campo)) ? "`cliente`." + regra.campo : regra.campo

            let valor = regra.valor;
            if(regra.valor.indexOf("AGO") >= 0){
                const today = new Date();
                const date = new Date();

                const value = Number(regra.valor.replace(/\D+/g, ""));

                if(regra.valor.indexOf("YEARS_AGO") >= 0){
                    date.setFullYear(today.getFullYear() - value);
                }

                if(regra.valor.indexOf("MONTHS_AGO") >= 0){
                    date.setMonth(today.getMonth() - value);
                }

                if(regra.valor.indexOf("DAYS_AGO") >= 0){
                    date.setDate(today.getDate() - value);
                }

                valor = date / 1000 | 0;
            }

            if(regra.valor.indexOf("(") == 0){
                valor = regra.valor.replace(/"/g, "'");
            }

            return `${campo} ${regra.comparador} '${valor}'`;
        })).join(" AND ");

        const clientes = await Cliente.Get(regras_query);
        if(!clientes || clientes.length == 0) return;

        clientes.forEach(async cliente => {
            
            const mail = new Mailer();
            mail.to = cliente.email;
            mail.subject = "Teste";
            mail.message = "Teste";
            if(await mail.Send()){

                const enviado = {
                    id: Util.generateId(),
                    cliente: cliente.id,
                    campanha: campanha.id,
                    data_envio: new Date() / 1000 | 0
                };

                CampanhaEnviada.Create(enviado);
            }
        });


    });

};

module.exports = Jobs;