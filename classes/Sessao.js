class Sessao extends Classes
{
    static fields = [ "id", "usuario", "ultima_data" ];
    static table = "sessao";

    static async Generate(usuario){
        const data = {
            id: Util.generateId(),
            usuario: usuario,
            ultima_data: (new Date() / 1000 | 0)
        };

        const create = await this.Create(data);

        return (create.status === 1) ? data : false;
    }
}

module.exports = Sessao;