const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

// configuração do CORS para aceitar vários protocolos de requisição
const configCors = {
    origin:"*",
    optionsSuccessStatus:200
}


// configuração da comunicação com o banco de dados mongodb
const url="mongodb+srv://edilsonsilva:Alunos123@clustercliente.gxz3l.mongodb.net/lojadb?retryWrites=true&w=majority";
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});

//Construção da tabela Produtos
const tbproduto = mongoose.Schema({
    nomeproduto:String,
    descricao:String,
    quantidade:Number,
    preco:String,
    foto:String
});
//Contrução do modelo de tabela no mongodb
const Produto = mongoose.model("produto",tbproduto);


// Construção da estrutura da tabela carrinho
const tbcarrinho = mongoose.Schema({
    idproduto:String,
    nomeproduto:String,
    preco:String,
    foto:String
});
// Criaçã da tabela carrinho
const Carrinho = mongoose.model("carrinho",tbcarrinho);



//criação dos endpoints para o modelo produto.
// Vamos iniciar com a rota para efetuar o cadastro dos produtos
// Esta rota recebe o verbo POST(Postar os dados do Produto)
app.post("/produto/cadastro",cors(configCors),(req,res)=>{
    const dados = new Produto(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:"Produto cadastrado"});
    }).catch((erro)=>console.error(`Erro ao tentar cadastrar ${erro}`));
});

app.put("/produto/atualizar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro a tentar atualizar ${erro}`});
            return;
        }
        res.status(200).send({rs:"Produto atualizado."});
    });

});
app.delete("/produto/deletar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro a tentar deletar ${erro}`});
            return;
        }
        res.status(204).send({rs:"Produto deletado."});
    });
});
app.get("/produto/listar",cors(configCors),(req,res)=>{
    Produto.find((erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Ocorreu um erro ao tentar listar os produtos ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });


});
app.get("/produto/codproduto/:id",cors(configCors),(req,res)=>{
    Produto.findById(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar consultar o produto ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});
app.get("/produto/nomeproduto/:nome",cors(configCors),(req,res)=>{
    Produto.find({nomeproduto:req.params.nome},(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Erro ao tentar consultar o produto ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    })

});


// -------- Criação das rotas para o carrinho
app.post("/carrinho/adicionar",cors(configCors),(req,res)=>{
    const dados = new Carrinho(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:"Item adicionado"});
    }).catch((error)=>console.error(`Ocorreu um erro ao tentar adicionar o item ao carrinho -> ${error}`));
});

app.get("/carrinho/itens",cors(configCors),(req,res)=>{
    Carrinho.find((error,dados)=>{
        if(error){
            res.status(400).send({rs:`Ocorreu um erro ao tentar listar os itens do carrinho -> ${error}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});
app.delete("/carrinho/removeritem/:id",cors(configCors),(req,res)=>{
    Carrinho.findByIdAndDelete(req.params.id,(error,dados)=>{
        if(error){
            res.status(400).send({rs:`Ocorreu um erro ao tentar remover este item -> ${error}`});
            return;
        }
        res.status(204).send({rs:'item removido'});
    });
});



app.listen("5000",()=>console.log("Servidor online na porta 5000"));