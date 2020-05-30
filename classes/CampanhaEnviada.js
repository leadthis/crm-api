class CampanhaEnviada extends Classes
{
    static table = "campanha_enviada";
    static entity = "env";
    static fields = [ "id", "lead", "campanha", "data_envio", "status" ];

}

module.exports = CampanhaEnviada;