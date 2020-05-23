class Usuario extends Classes
{
    static entity = "usr";
    static table = "usuario";
    static fields = [ "id", "nome", "email", "senha", "data_criacao", "excluido", "status" ];

    static HashPassword(pass, salt){
        const md5 = require('md5');
        pass = md5(pass + "-" + salt);
        return pass;
    }

}

module.exports = Usuario;