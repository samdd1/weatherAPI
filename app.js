const bodyParser = require("body-parser")
const express = require("express")
const https = require("https")
const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html")
})

app.post("/city",function(req,res){
    var city = req.body.city;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=c1dce56d74908012ceafaa7fb33120fc";
    https.get(url,function(response){
       
        var value = "";
            response.on("data",function(data){
                value+=data;
            })
            response.on("end",function(){
                   const ans = JSON.parse(value)
                   var temptext = ans.main.temp
                   var temp = parseFloat(temptext)
                   temp = temp - 273.15
                   temp = temp.toFixed(2)
                   var des = ans.weather[0].description
                   const pic = ans.weather[0].icon;
                   const wind = ans.wind.speed;
                   const humidity = ans.main.humidity;
                   const image = "https://openweathermap.org/img/wn/"+ pic +"@2x.png";
                   res.send(`
                            
                   <html>
                   <head>
                       <title>Temperature in ${city}</title>
                       <style>
                           body {
                               font-family: Arial, sans-serif;
                               background-image:url('wa.jpg')

                               
                           }
                           h1 {
                           
                               font-size: 40px;
                              
                             
                           }
                           .temperature {
                               font-size: 60px;
                               font-weight: bold;
                               margin-top: 30px;
                               display:inline;
                           }
                           img {
                               margin-top: 50px;
                               width: 150px;
                               display:inline;
                               position:absolute;
                               left: 15px;
                           }
                           .ans {
                            background-color: rgb(179, 179, 179);
                            padding: 30px;
                            border-radius: 10px;
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 300px;
                            margin-top: 260px;
                            box-shadow: inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
                          }
                          
                          @media (max-width: 900px) {
                            .ans {
                              width: 230px;
                              left: 50%;
                              transform: translateX(-50%);
                            }
                          }
                           h3{
                            font-size: 40px;
                              
                            margin-top: 80px;
                           }
                           h5{
                            font-size: 21px;
                              
                           
                           }
                          

                        button{
                            background-color:orange;
                            padding:20px;
                            border-radius:20px;
                            color:white;
                            cursor:pointer;

                        }
                       </style>
                   </head>
                   <body>
                   <div class = "ans">
                       <h1> ${city}</h1>
                       <div class="temperature">${temp} &deg;C</div>
                       <img src="${image}" alt="Weather icon">
                       <h3>${des}</h3>
                       <h5>Wind - ${wind}</h5>
                       <h5>Humidity - ${humidity}</h5>
                           <form action = "/failure" method = "POST">
                           <button type= "submit">Go Back</button>
                           </form>
                       </div>

                   </body>
               </html>
                   `)

            })
            
    })

})

app.post("/failure",function(req,res){
    res.redirect("/")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server is listening")
})
