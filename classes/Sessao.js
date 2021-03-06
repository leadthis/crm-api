class Sessao extends Classes
{
    static fields = [ "id", "usuario", "tipo_acesso", "ultima_data" ];
    static table = "sessao";

    static async Generate(usuario){
        const data = {
            id: Util.generateId(),
            usuario: usuario,
            token: Util.MD5(usuario + (new Date())),
            ultima_data: (new Date() / 1000 | 0)
        };

        const create = await this.Create(data);

        return (create.status === 1) ? data : false;
    }

    static async Verificar(id){
        let sessao = await this.Get(`id = '${id}'`);

        const now = new Date() / 1000 | 0;
        const limit = now - (3600 * 5);

        if(sessao.length === 0){
            return {
                status: 0,
                msg: "Sessão inválida!"
            };
        }

        sessao = sessao[0];

        this.Update({ ultima_data: now }, `id = '${id}'`);
        
        return{
            status: 1,
            msg: "Sessão válida",
            ...sessao
        };

    }
}

module.exports = Sessao;