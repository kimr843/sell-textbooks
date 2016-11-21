var oracledb      = require('oracledb'),
    dbConfig      = require('./dbConfig'),
    express       = require('express'),
    app           = express(),
    path          = require('path'),
    statsQuery  = require('./queries/Statistic');
    

    app.set("view engine", "ejs");
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(__dirname+"/public"));
    
    oracledb.getConnection(
        {
          user          : dbConfig.username,
          password      : dbConfig.password,
          connectString : dbConfig.connectString
        },
        function(err, connection)
        {
          if (err) { console.error(err.message); return; }
          console.log('Connection was successful!');

          
          //Express Routes

          //Landing
          app.get('/', function (req, res) {
            var countLastMonth;
            var percentDiff;
            var countCurrentMonth;
            connection.execute(statsQuery.countLastMonthQuery, function(err,result){
                      if(err) {console.error(err.message); return;}
                      //console.log(result.rows[0][0]);
                      countLastMonth = result.rows[0][0];   

                      connection.execute(statsQuery.percentageDiff, function(err,result){
                          if(err) {console.error(err.message); return;}
                          //console.log(result.rows[0][0]);
                          percentDiff = Math.round(result.rows[0][0]); 
                      
                          connection.execute(statsQuery.countCurrentMonthQuery, function(err,result){
                              if(err) {console.error(err.message); return;}
                              //console.log(result.rows[0][0]);
                              countCurrentMonth = result.rows[0][0]; 
                              res.render("landing",{countLastMonth: countLastMonth, countCurrentMonth: countCurrentMonth, percentDiff: percentDiff});   
                      });   
                });      
            }); 
                
          });


          //Sell
          app.get('/sell', function (req, res) {
            res.render("sell");
          });

          //Buy
          app.get('/buy', function (req, res) {
            res.render("buy");
          });

          //User - Sign up
          app.get('/signup',function (req, res) {
             res.render("signup");
          });

          //User - Login
          app.get('/login',function (req, res) {
             res.render("login");
          });

          //Redirect
          app.use(function(req,res){
            res.sendStatus(404);
          });

          app.listen(3000, function () {
            console.log('App listening on port 3000!');
          });

        });

