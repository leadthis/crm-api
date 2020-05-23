class Campanha extends Classes
{
    static table = "campanha";
    static entity = "cam";
    static fields = [ "id", "titulo", "jornada", "usuario", "status" ];

}

module.exports = Campanha;