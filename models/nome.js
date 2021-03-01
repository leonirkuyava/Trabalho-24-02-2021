const db = require('./DB')

//Criando tabela de cadastro doador no banco de dados
const nomeCadastro = db.sequelize.define('nomeCadastros',{
    nome:{
        type:db.Sequelize.STRING
    }
})


//Cria tabela - somente uma vez
//nomeCadastro.sync({force:true})


//exportando a constante
module.exports= nomeCadastro