class Regra extends Classes
{
    static table = "regra";
    static entity = "reg";
    static fields = [ "id", "referencia", "campo", "comparador", "valor", "status" ];
}

module.exports = Regra;