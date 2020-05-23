class Jornada extends Classes
{
    static table = "campanha";
    static entity = "jor";
    static fields = [ "id", "titulo", "usuario", "status" ];
}

module.exports = Jornada;