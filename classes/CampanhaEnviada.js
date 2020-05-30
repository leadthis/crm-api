class CampanhaEnviada extends Classes
{
    static table = "campanha_enviada";
    static entity = "env";
    static fields = [ "id", "cliente", "campanha", "data_envio", "status" ];

}

module.exports = CampanhaEnviada;