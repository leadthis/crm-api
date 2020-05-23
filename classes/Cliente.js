class Cliente extends Classes
{
    static table = "cliente";
    static entity = "cli";
    static fields = [ "id", "nome", "email", "sexo", "nascimento", "data_inclusao", "usuario", "status" ];
}

module.exports = Cliente;