
const express = require ("express")
const app = express()

const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")

//const usuario = require("./models/usuario")
const ong = require("./models/ong")
const doacao = require("./models/doacao")
const { removeData } = require("jquery")


//asdasdasds

//configurando multer, para upload de imagem
const multer = require ("multer")

const storage = multer.diskStorage({
    destination:(req,file,cb) => {cb(null,'public/imagens')},
    filename:(req,file,cb) => {cb(null,file.originalname)}
})

const upload = multer ({storage})

//enviar email / importar 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 587, // ou 25
    secure : false, //true for 465, false for other ports
    auth: {
        user: "kuyavaleonir@gmail.com",
        pass: "***" //senha do email
    },
    tls: {rejectUnauthorized : false}
});

    const mailOptions = {
        from : 'kuyavinha12@hotmail.com',
        to : 'kuyavaleonir@gmail.com',
        subject : 'E-mail enviado usando Node!',
        text: 'Bem fácil, não?'
    };

    transporter.sendMail (mailOptions, function (error, info){
        if (error) {
            console.log (error);
        }else {
            console.log('Email enviado:' + info.response);
        }
    });






//Configurar handlebar para
app.engine('handlebars',handlebars({defaultLayout:'main'}))
app.set('view engine','handlebars')

//Configurar o motor de tamplate handlebar
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/static', express.static(__dirname + '/public'));

//chamando ao modeulo express-session 
var session = require ('express-session');

//configuração da sessão
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.get('/', function (req,res){
    res.render ('paginaInicial')

})

app.get('/doeAgora',function(req,res){  
    

     if(req.session.email){
        //res.render('doeAgora')
        ong.findAll().then(function(doacoes){
            res.render('doeAgora', {doacao: doacoes.map(pagamento => pagamento.toJSON())})
        })

    }else{
        res.render('login')
    }
    
})

app.get('/destruir', function(req,res){
   req.session.destroy(function(){
    res.render ('paginaInicial')
});
})

app.get('/cadastro',function(req,res){
    res.render ('cadastro')
})

app.get('/cadastroDoacao', function (req,res){
    if(req.session.email){
    
   res.render ('cadastroDoacao')

}else{
   res.render('login')
}

})

app.get('/cadastroGeral', function(req,res){
    res.render ('cadastroGeral')
})

app.get('/login', function(req,res){
  res.render ('login')
})

app.post('/login',function (req,res){
//essas duas linhas abaixo vão vir do banco de dados
//    req.session.nome = 'andre';
//    req.session.senha = 'repolho123'
//
//    if(req.session.nome == req.body.nome && req.body.senha == 'repolho123'){
//        res.send ("usuario logado")
//    }else{
//        res.send ("usuario não existe")
//    }

    req.session.email = req.body.email;
    req.session.senha = req.body.senha;
    ong.count({where: { email: req.session.email } && {senha: req.session.senha}}).then(function(dados){
        if(dados > 0){
            res.render('paginaInicial')
        }else{
            res.send("Usuário não cadastrado" + dados)
        }
        
    })
    
})


//criar cadastro usuario

app.post('/cadUsuario',function(req,res){
   usuario.create({
       nome:req.body.nome,
        senha:req.body.senha,
        email:req.body.email,
        cpf:req.body.cpf,
        endereco:req.body.endereco,
        complemento:req.body.complemento,
        cidade:req.body.cidade,
        estado:req.body.estado,
        cep:req.body.cep,
        telefoneParaContato:req.body.telefoneParaContato,
        confirmarDados:req.body.confirmarDados

    }).then(function(){
        usuario.findAll().then(function(doadores){
        res.render('cadastro', {doador: doadores.map(pagamento => pagamento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })

})
app.get('/cadastro',function(req,res){
    usuario.findAll().then(function(doadores){
        res.render('cadastro',{doador:doadores.map(pagamento => pagamento.toJSON())})
    })
})

//vamo criar mais uma rota e ela dara para um formulário
app.get('/update/:id', function(req,res){
    ong.findAll({where:{'id' : req.params.id}}).then(function(ongs){
        res.render('atualizaUsuario',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
})

//depois vamos criar essa rota que envia para o banco e depois chama o formulario
app.post('/updateUsuario',function(req,res){
    usuario.update({
            nome:req.body.nome,
            senha:req.body.senha,
            email:req.body.email,
            cpf:req.body.cpf,
            endereco:req.body.endereco,
            complemento:req.body.complemento,
            cidade:req.body.cidade,
            estado:req.body.estado,
            cep:req.body.cep,
            telefoneParaContato:req.body.telefoneParaContato,
            confirmarDados:req.body.confirmarDados},

            {where:{id:req.body.id}}
    ).then(function(){
        usuario.findAll().then(function(doadores){
        res.render('cadastro',{doador:doadores.map(pagamento => pagamento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})

//update ong
app.get('/update/:id', function(req,res){
    usuario.findAll({where:{'id' : req.params.id}}).then(function(doadores){
        res.render('atualizaOng',{doador: doadores.map(pagamento => pagamento.toJSON())})
    })
})

//depois vamos criar essa rota que envia para o banco e depois chama o formulario
app.post('/updateOng',function(req,res){
    ong.update({nome:req.body.email,senha:req.body.senha},{
        where:{id:req.body.codigo}}
    ).then(function(){
        ong.findAll().then(function(ongs){
        res.render('formulario',{ong: ongs.map(cadastramento => cadastramento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})


//criar cadastro doações

app.post('/cadDoacao',function(req,res){
    doacao.create({
        categoria:req.body.categoria,
        descricao:req.body.descricao,
        nivel:req.body.nivel
       
    }).then(function(){
        doacao.findAll().then(function(doacoes){
        res.render('cadastroDoacao', {doacao: doacoes.map(cadastramento1 => cadastramento1.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })

})
app.get('/cadDoacao',function(req,res){
    doacao.findAll().then(function(doacoes){
        res.render('cadastroDoacao',{doacao:doacoes.map(cadastramento1=> cadastramento1.toJSON())})
    })
})

//criar cadastro ong

app.post('/cadastroOng',upload.single('imagem_prod'),function(req,res){
    console.log(req.file.originalname)
    ong.create({
        nomeRazaoSocial:req.body.nome,
        senha:req.body.senha,
        email:req.body.email,
        cpfCnpj:req.body.cpf,
        endereco:req.body.endereco,
        complemento:req.body.complemento,
        cidade:req.body.cidade,
        estado:req.body.estado,
        cep:req.body.cep,
        telefoneParaContato:req.body.telefoneParaContato,
        confirmarDados:req.body.confirmarDados,
        foto:req.file.originalname,
        descricaoOng:req.body.descricao


    }).then(function(){
        ong.findAll().then(function(ongs){
        res.render('cadastroOng', {ong:ongs.map(cadastramento => cadastramento.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })

})
app.get('/cadastroOng',function(req,res){
    ong.findAll().then(function(ongs){
        res.render('cadastroOng',{ong:ongs.map(cadastramento => cadastramento.toJSON())})
    })
})


//Deletar informações Ong

app.get('/delete/:id',function(req,res){
    ong.destroy({
        where:{'id': req.params.id}
    }).then(function(){
        ong.findAll().then(function(ongs){
            res.render('cadastroOng',{ong: ongs.map(
               cadastramento => cadastramento.toJSON())})
        })

      .catch(function(){res.send("não deu certo")
        })
    })
});

//Deletar informações Cadastro Doação

app.post('/delete',function(req,res){
    doacao.destroy({
        where:{'id': req.body.id}
    }).then(function(){
        doacao.findAll().then(function(doacoes){
            res.render('cadastroDoacao',{doacao: doacoes.map(
               cadastramento1 => cadastramento1.toJSON())})
        })

      .catch(function(){res.send("não deu certo")
        })
    })
});

app.listen(3000);