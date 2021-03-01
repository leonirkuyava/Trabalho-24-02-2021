//configurações express 
const express = require("express")
 const app = express()
 const nomeCadastro =require("./models/nome")

 const handlebars = require("express-handlebars")
 const bodyParser = require("body-parser")

  //configurar handlebar

  app.engine('handlebars',handlebars({defaultLayout:'main'}))
  app.set('view engine','handlebars')

  app.use(bodyParser.urlencoded({extended:false}))
  app.use(bodyParser.json())
 
  app.use('/static',express.static(__dirname + '/public'))


app.post('/cadNome',function(req,res){
    nomeCadastro.create({
        nome:req.body.nome
    }).then(function(){
        nomeCadastro.findAll().then(function(nomes){
            res.render('index',{nome: nomes.map(cadastrar => cadastrar.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})


app.get('/index',function(req,res){
    nomeCadastro.findAll().then(function(nomes){
        res.render('index',{nome: nomes.map(cadastrar => cadastrar.toJSON())})
    })
})


//criando nova rota para updateDoador
app.get('/updateNome/:id',function(req,res){
    nomeCadastro.findAll({ where:{'id':req.params.id}}).then(function(nomes){
            res.render('updateNome',{nome: nomes.map(cadastrar => cadastrar.toJSON())})
    })

})

//depois vamos criar essa rota que envia para o banco

app.post('/updateNome',function(req,res){
    nomeCadastro.update({
        
        
        nome:req.body.nome},{
            where:{id:req.body.id}}
    ).then(function(){
        nomeCadastro.findAll().then(function(nomes){
            res.render('index',{nome: nomes.map(cadastrar => cadastrar.toJSON())})
    })
    }).catch(function(erro){
        res.send("Erro"+erro)
    })
})

//criando o delete doador
    app.post('/deleteNome',function(req,res){
        nomeCadastro.destroy({
            where:{'id': req.body.id}
        }).then(function(){
            nomeCadastro.findAll().then(function(nomes){
                res.render('index',{nome: nomes.map(cadastrar => cadastrar.toJSON())})
            })
    
          .catch(function(){res.send("Não deu certo")
            })
        })
    })



  app.listen(4000);