const Jobs = async () => {

    const campanhas = await Campanha.Get(`jornada = "" OR jornada is NULL`);

    campanhas.forEach(async campanha => {
        const regras = await Regra.Get(`referencia = '${Campanha.entity}:${campanha.id}'`);
        
        const query = (regras.map((regra) => {
            return `${regra.campo} ${regra.comparador} '${regra.valor}'`;
        })).join(" AND ");

        const clientes = await Cliente.Get(query);
    });

};

module.exports = Jobs;