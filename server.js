const express = require("express");
const server = express();

//configurar os arquivos extras
server.use(express.static('public'));

//abilitar o body
server.use(express.urlencoded({ extended : true} ))

//connexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Samanta252742',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});

//configurando a template agen
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express:server,
    noCache: true,
})

//fista de dados
/*const donors = [
    {
        name:"Cesar Henrique",blood:"O+"
    },{
        name:"Cesar Almeida", blood:"O+"
    },{
        name:"Edina Borges",blood:"A+"
    },{
        name:"Gabriel Olimpio", blood:"A+"
    }

]*/

//configurar a apresentação da pagina
server.get("/", function(req, res){

    db.query('SELECT * FROM donors', function(err,result){
        if(err) return res.send('erro no banco de dado');
        const donors = result.rows;
        return res.render("index.html", { donors });
    })

    
});
server.post("/", function(req,res){
    //pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    if(name == '' || email == ''|| blood == ''){
        return res.send('Todos Os Campos são obrigatorios');
    }else{
        //coloca valor dentro do banco de dados
        const query = `INSERT INTO donors ("name","email","blood") VALUEs ($1, $2, $3)`;
        const values = [name,email,blood]
        db.query(query,values, function(err){
            if(err){
                return res.send('Erro ao cadastrar');
            }
            return res.redirect("/");
        });
    }
    
    
    //coloca dentro do array
   /* donors.push({
        name:name,
        blood:blood,
    })*/
    
})

//ligar o servidor usando a porta 3000
server.listen(3000);