class Mailer{
    constructor(){
        
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport({
            name: "outlook",
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        });

        this.from = process.env.EMAIL_FROM;
    }
    
    async Send(){
        return new Promise((resolve, reject) => {
            var obrigatorios = [ "to", "subject", "message" ];
            var errors = [];
    
            obrigatorios.forEach(campo => {
                if(!(this[campo])){
                    errors.push({
                        status: 0,
                        msg: "O campo '" + campo + "' precisa ser definido!"
                    });
                }
            });
    
            if(errors.length > 0){
                reject({
                    errors: errors,
                    status: 0
                });
                return;
            }
    
            const mailOptions = {
                from: this.from,
                to: this.to,
                subject: this.subject,
                html: this.message
            };
            
            this.transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    resolve(error);
                } else {
                    resolve(info);
                }
            });
        })

    }

    static AlertaLead(){
        const mail = {};
        mail.titulo = "Alerta de Lead!";
        mail.mensagem = "Uma Lead que bate com um dos seus filtros acabou de ser adicionada!";
        mail.email += `<html>`;
        mail.email += `    <body style="width:600px; margin:0; padding:0;font-family:Circular, Helvetica, Arial, sans-serif; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">`;
        mail.email += `        <div style="width:100%; height:80px; background-color:#3C8DBC; line-height: 80px; text-align: center;">`;
        mail.email += `            <span style="color:white;font-size:30px"> <b>Lead</b>This </span>`;
        mail.email += `        </div>`;
        mail.email += `        <div style="width:100%; height: 300px;">`;
        mail.email += `            <div style="width: 80%; height: 200px; background-color:white; text-align: center; padding: 25px 10%">`;
        mail.email += `                <h2 style="border:none;margin:0px;padding:0px;text-decoration:none;color:rgb(0, 0, 0);font-size:40px;font-weight:bold;line-height:45px;letter-spacing:-0.04em;text-align:center;">Alerta de Lead!</h2>`;
        mail.email += `                <p>`;
        mail.email += `                    Uma Lead do seu interesse acabou de ser adicionada! `;
        mail.email += `                </p>`;
        mail.email += `                <p>`;
        mail.email += `                    <a href="${(PROD) ? "https://app.leadthis.com.br" : "http://localhost:3000/"}">Clique aqui para comprar</a>`;
        mail.email += `                </p>`;
        mail.email += `            </div>`;
        mail.email += `            <div style="max-width:100%; min-height: 30px; background-color: #F7F7F7; padding: 5px 0 5px 20px">`;
        mail.email += `                <p style="color: #88898C; font-size: 20px;"><b>Lead</b>This</p>`;
        mail.email += `                <p>`;
        mail.email += `                    <small style="color: #ddd;">by Lumine - 2020</small>`;
        mail.email += `                </p>`;
        mail.email += `            </div>`;
        mail.email += `        </div>`;
        mail.email += `    </body>`;
        mail.email += `</html>`;
        return mail;
    }

    static SolicitarNovaSenha(link){
        const mail = {};
        mail.titulo = "LeadThis - Nova Senha!";
        mail.email  = '';
        mail.email += '<html>';
        mail.email += '   <body style="width:600px; margin:0; padding:0;font-family:Circular, Helvetica, Arial, sans-serif; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">';
        mail.email += '       <div style="width:100%; height:80px; background-color:#3C8DBC; line-height: 80px; text-align: center;">';
        mail.email += '           <span style="color:white;font-size:30px"> <b>Lead</b>This </span>';
        mail.email += '       </div>';
        mail.email += '       <div style="width:100%; height: 300px;">';
        mail.email += '           <div style="width: 80%; height: 200px; background-color:white; text-align: center; padding: 25px 10%">';
        mail.email += '               <h2 style="border:none;margin:0px;padding:0px;text-decoration:none;color:rgb(0, 0, 0);font-size:40px;font-weight:bold;line-height:45px;letter-spacing:-0.04em;text-align:center;">Você solicitou uma nova senha?</h2>';
        mail.email += '               <p style="font-size: 25px;"> Aqui vai o link onde você pode definir uma nova senha: <a href="' + link + '">Clique aqui</a> </p>';
        mail.email += '           </div>';
        mail.email += '           <div style="max-width:100%; min-height: 30px; background-color: #F7F7F7; padding: 5px 0 5px 20px">';
        mail.email += '               <p style="color: #88898C; font-size: 20px;"><b>Lead</b>This</p>';
        mail.email += '               <p><small style="color: #ddd;">by Lumine - 2020</small></p>';
        mail.email += '           </div>';
        mail.email += '       </div>';
        mail.email += '   </body>';
        mail.email += '</html>';
        return mail;
    }

    static DesignarLead(){
        const mail = {};
        mail.titulo = "Há uma Lead para você!";
        mail.mensagem = "Um Lead foi designada para você! Dê uma olhada!";
        return mail;
    }

    static PlanoErroPagamento() {
        const mail = {};
        mail.titulo = "Plano não Pago!";
        mail.mensagem = "Houve um erro com o pagamento do seu plano! Verifique seu cartão de créditos e tente novamente!";
        return mail;
    }

    static ConvidarFuncionario(usuario, funcionario, link){
        const mail = {};
        mail.titulo = "LeadThis - Convite!";
        mail.email  = '<html>';
        mail.email += '   <body style="width:600px; margin:0; padding:0;font-family:Circular, Helvetica, Arial, sans-serif; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">';
        mail.email += '       <div style="width:100%; height:80px; background-color:#3C8DBC; line-height: 80px; text-align: center;">';
        mail.email += '           <span style="color:white;font-size:30px"> <b>Lead</b>This </span>';
        mail.email += '       </div>';
        mail.email += '       <div style="width:100%; height: 300px;">';
        mail.email += '           <div style="width: 80%; height: 200px; background-color:white; text-align: center; padding: 25px 10%">';
        mail.email += '               <h2 style="border:none;margin:0px;padding:0px;text-decoration:none;color:rgb(0, 0, 0);font-size:40px;font-weight:bold;line-height:45px;letter-spacing:-0.04em;text-align:center;">';
        mail.email += '                     Olá, ' + funcionario + '!';
        mail.email += '               </h2>';
        mail.email += '               <p style="font-size: 25px;">';
        mail.email += '                     O nosso usuário ' + usuario + ' te enviou um convite para fazer parte de sua equipe!<br><br>';
        mail.email += '                     Para aceitar, basta <a href="' + link + '">clicar aqui</a>';
        mail.email += '               </p>';
        mail.email += '           </div>';
        mail.email += '           <div style="max-width:100%; min-height: 30px; background-color: #F7F7F7; padding: 5px 0 5px 20px">';
        mail.email += '               <p style="color: #88898C; font-size: 20px;"><b>Lead</b>This</p>';
        mail.email += '               <p><small style="color: #ddd;">by Lumine - 2020</small></p>';
        mail.email += '           </div>';
        mail.email += '       </div>';
        mail.email += '   </body>';
        mail.email += '</html>';
        return mail;
    }
    
    static ConvidarUsuario(usuario, link){
        const mail = {};
        mail.titulo = "LeadThis - Convite!";
        mail.email  = '<html>';
        mail.email += '   <body style="width:600px; margin:0; padding:0;font-family:Circular, Helvetica, Arial, sans-serif; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto;">';
        mail.email += '       <div style="width:100%; height:80px; background-color:#3C8DBC; line-height: 80px; text-align: center;">';
        mail.email += '           <span style="color:white;font-size:30px"> <b>Lead</b>This </span>';
        mail.email += '       </div>';
        mail.email += '       <div style="width:100%; height: 300px;">';
        mail.email += '           <div style="width: 80%; height: 200px; background-color:white; text-align: center; padding: 25px 10%">';
        mail.email += '               <h2 style="border:none;margin:0px;padding:0px;text-decoration:none;color:rgb(0, 0, 0);font-size:40px;font-weight:bold;line-height:45px;letter-spacing:-0.04em;text-align:center;">';
        mail.email += '                     Olá!';
        mail.email += '               </h2>';
        mail.email += '               <p style="font-size: 25px;">';
        mail.email += '                     O nosso usuário ' + usuario + ' te enviou um convite para fazer utiluzar a nossa plataforma LeadThis!<br><br>';
        mail.email += '                     Para aceitar, basta <a href="' + link + '">clicar aqui</a>';
        mail.email += '               </p>';
        mail.email += '           </div>';
        mail.email += '           <div style="max-width:100%; min-height: 30px; background-color: #F7F7F7; padding: 5px 0 5px 20px">';
        mail.email += '               <p style="color: #88898C; font-size: 20px;"><b>Lead</b>This</p>';
        mail.email += '               <p><small style="color: #ddd;">by Lumine - 2020</small></p>';
        mail.email += '           </div>';
        mail.email += '       </div>';
        mail.email += '   </body>';
        mail.email += '</html>';
        return mail;
    }

    static AprovarSolicitacao(){
        const mail = {};
        mail.titulo = "Sua solicitação foi aprovada!";
        mail.mensagem = "Um administrador acabou de aprovar a sua solicitação!";
        return mail;
    }

    static RecusarSolicitacao(){
        const mail = {};
        mail.titulo = "Sua solicitação foi recusada!";
        mail.mensagem = "Um administrador acabou de recusar a sua solicitação!";
        return mail;
    }

}

module.exports = Mailer;