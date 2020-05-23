class Cliente extends Classes
{
    static table = "cliente";
    static entity = "cli";
    static fields = [ "id", "nome", "sexo", "nascimento", "data_inclusao", "status" ];
}

module.exports = Cliente;