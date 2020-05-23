class Usuario extends Classes
{
    static entity = "usr";
    static table = "usuario";
    static fields = [ "id", "nome", "email", "senha", "data_criacao", "excluido", "status" ];

}

module.exports = Usuario;