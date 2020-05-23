class Cliente extends Classes
{
    static table = "cliente";
    static entity = "cli";
    static fields = [ "id", "nome", "email", "sexo", "nascimento", "data_inclusao", "data_status", "usuario", "status" ];
}

module.exports = Cliente;