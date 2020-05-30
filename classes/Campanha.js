class Campanha extends Classes
{
    static table = "campanha";
    static entity = "cam";
    static fields = [ "id", "titulo", "jornada", "usuario", "excluido", "status" ];

}

module.exports = Campanha;