
const express=require("express");
const https =require("https");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/vaccineDB",{useNewUrlParser:true});
const userSchema= {
  email:String,
  password:String,
  name:String,
  state:String,
  pincode:String

};

const Detail=mongoose.model("Detail",userSchema);



app.get("/",function(req,res){
  const url="https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";
  https.get(url,function(response){
    response.on("data",function(data){
      var weatherData=JSON.parse(data);
      var activecase=weatherData.activeCases;
      var totalCases=weatherData.totalCases;
      var discharged=weatherData.recovered;
      var death =weatherData.deaths;


    res.render("home",{
      activeCases:activecase,
      totalCases:totalCases,
      Discharge:discharged,
      death:death,
      stateInfo:"Enter to get that State Stats",
      SactiveCases:"00000",
        StotalCases:"00000",
        SDischarge:"00000",
        Sdeath:"00000"
    });
  });
  });
});
// app.post("/",function(req,res){
//   const cityName=req.body.city;
//   const apiKey="9ce6b6d9d90c4d2733c01e4123d9a218"
app.post("/",function(req,res){
  var stateName=req.body.stateName;
  const url="https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";
  https.get(url,function(response){
    response.on("data",function(data){
      const weatherData=JSON.parse(data);
      for(var i=0;i<50;i++){
        if(stateName==weatherData.regionData[i].region){
          var sactivecase=weatherData.regionData[i].activeCases;
          var stotalCases=weatherData.regionData[i].totalInfected;
          var sdischarged=weatherData.regionData[i].recovered;
          var sdeath =weatherData.regionData[i].deceased;
          break;
        }
      }
      var activecase=weatherData.activeCases;
      var totalCases=weatherData.totalCases;
      var discharged=weatherData.recovered;
      var death =weatherData.deaths;
    res.render("home",{
      activeCases:activecase,
      totalCases:totalCases,
      Discharge:discharged,
      death:death,
      stateInfo:"Cases in "+stateName+" ",
    SactiveCases:sactivecase,
      StotalCases:stotalCases,
      SDischarge:sdischarged,
      Sdeath:sdeath
    });
  });
  });

});
// ---------------creating object of vaccineInfo------------

 app.get("/login",function(req,res){
   res.render("login")
 });
 app.post("/login",function(req,res){


   Detail.findOne({email:req.body.username},function(err,foundUser){
  if(foundUser){
    var sactiveCase;
    var stotalCases;
    var sDischarged;
    var sdeath;


    // if(foundUser.password===req.body.password){
    bcrypt.compare(req.body.password,foundUser.password).then(function(result) {
    // result == true
    if(result==true){

        var vaccAvailable=[];
      var stateName=foundUser.state;
      const url="https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true";

      https.get(url,function(response){
        response.on("data",function(data){
          const weatherData=JSON.parse(data);
          console.log(weatherData.regionData[1].region);
          console.log(weatherData.regionData[1].activeCases);
          for(var i=0;i<50;i++){
            if(stateName==weatherData.regionData[i].region){
               sactiveCase=weatherData.regionData[i].activeCases;
             stotalCases=weatherData.regionData[i].totalInfected;
               sDischarged=weatherData.regionData[i].recovered;
             sdeath =weatherData.regionData[i].deceased;
              break;
            }
          }


        });
      });

      var pincode=foundUser.pincode;




      let current_datetime = new Date()
let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();


      const url2="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincode+"&date="+formatted_date+"";
      https.get(url2,function(response2){
        response2.on("data",function(data){
          const weatherData2=JSON.parse(data);

          for(var i=0;i<weatherData2.centers.length;i++){
              if(weatherData2.centers[i].sessions[1]!=null){
                if(weatherData2.centers[i].sessions[0].min_age_limit=="18"){
            var newData={
              blockName:weatherData2.centers[i].block_name,
              blockAddress:weatherData2.centers[i].address,
              Avaccine1:weatherData2.centers[i].sessions[0].vaccine,
              Adose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
              Adose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,

              Avaccine2:weatherData2.centers[i].sessions[1].vaccine,
              Adose21:weatherData2.centers[i].sessions[1].available_capacity_dose1,
              Adose22:weatherData2.centers[i].sessions[1].available_capacity_dose1,
              Ovaccine1:"COVISHIELD",
              Odose11:"00",
              Odose12:"00",

              Ovaccine2:"COVAXIN",
              Odose21:"00",
              Odose22:"00"
            };
            }else{
              var newData={
                blockName:weatherData2.centers[i].block_name,
                blockAddress:weatherData2.centers[i].address,
                Avaccine1:"COVISHIELD",
                Adose11:"00",
                Adose12:"00",

                Avaccine2:"COVAXIN",
                Adose21:"00",
                Adose22:"00",

                              Ovaccine1:weatherData2.centers[i].sessions[0].vaccine,
                              Odose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
                              Odose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,

                              Ovaccine2:weatherData2.centers[i].sessions[1].vaccine,
                              Odose21:weatherData2.centers[i].sessions[1].available_capacity_dose1,
                              Odose22:weatherData2.centers[i].sessions[1].available_capacity_dose1
              };

            }
          }else{
            if(weatherData2.centers[i].sessions[0].min_age_limit=="18"){
          var newData={
          blockName:weatherData2.centers[i].block_name,
          blockAddress:weatherData2.centers[i].address,
          Avaccine1:weatherData2.centers[i].sessions[0].vaccine,
          Adose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
          Adose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,

                        Avaccine2:"COVAXIN",
                        Adose21:"00",
                        Adose22:"00",


          Ovaccine1:"COVISHIELD",
          Odose11:"00",
          Odose12:"00",

          Ovaccine2:"COVAXIN",
          Odose21:"00",
          Odose22:"00"
          };

          }else{
          var newData={
          blockName:weatherData2.centers[i].block_name,
          blockAddress:weatherData2.centers[i].address,
          Avaccine1:"COVISHIELD",
          Adose11:"00",
          Adose12:"00",

          Avaccine2:"COVAXIN",
          Adose21:"00",
          Adose22:"00",

                    Ovaccine1:weatherData2.centers[i].sessions[0].vaccine,
                    Odose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
                    Odose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,
                    Ovaccine2:"COVAXIN",
                    Odose21:"00",
                    Odose22:"00"


          };
          }
          }



            vaccAvailable.push(newData);

}





      });
    });
      res.render("profile.ejs",{
        name:foundUser.name,
        state:foundUser.state,
        pincode:foundUser.pincode,
        TOTAL:sactiveCase,
          ACTIVE:stotalCases,
          DISCHARGE:sDischarged,
          DEAD:sdeath,
           vaccAvailable:vaccAvailable
      });
    }
    });
    // hello

  }else{
    console.log(err);
   }
  //   res.send("password is wrong");
  // }
});
 });




 app.get("/signUp",function(req,res){
   res.render("signUp")
 });
 app.post("/profile",function(req,res){
   res.render("profile");
 });

 app.post("/register", function(req,res){

   var username=req.body.username;
   var password=req.body.password;

   var name=req.body.name;
   var state=req.body.state;
   var pincode=req.body.pincode;
   bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    var newUser=new Detail({
      email:username,
      password:hash,
      name:name,
      state:state,
      pincode:pincode
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }

  });
  res.render("login");
 });
});




app.listen(3000,function(req,response1){
console.log("server started");
});




// -------------------------------------------------------vaccine slot-------------------------------------------------------------
//
// for(var i=0;i<weatherData2.centers.length;i++){
//     if(weatherData2.centers[i].sessions[1]!=null){
//       if(weatherData2.centers[i].sessions[0].min_age_limit=="18"){
//   var newData={
//     blockName:weatherData2.centers[i].block_name,
//     blockAddress:weatherData2.centers[i].address,
//     Avaccine1:weatherData2.centers[i].sessions[0].vaccine,
//     Adose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//     Adose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//
//     Avaccine2:weatherData2.centers[i].sessions[1].vaccine,
//     Adose21:weatherData2.centers[i].sessions[1].available_capacity_dose1,
//     Adose22:weatherData2.centers[i].sessions[1].available_capacity_dose1,
//     Ovaccine1:"COVISHIELD",
//     Odose11:"00",
//     Odose12:"00",
//
//     Ovaccine2:"COVAXIN",
//     Odose21:"00",
//     Odose22:"00"
//   };
//   }else{
//     var newData={
//       blockName:weatherData2.centers[i].block_name,
//       blockAddress:weatherData2.centers[i].address,
//       Avaccine1:"COVISHIELD",
//       Adose11:"00",
//       Adose12:"00",
//
//       Avaccine2:"COVAXIN",
//       Adose21:"00",
//       Adose22:"00",
//
//                     Ovaccine1:weatherData2.centers[i].sessions[0].vaccine,
//                     Odose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//                     Odose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//
//                     Ovaccine2:weatherData2.centers[i].sessions[1].vaccine,
//                     Odose21:weatherData2.centers[i].sessions[1].available_capacity_dose1,
//                     Odose22:weatherData2.centers[i].sessions[1].available_capacity_dose1
//     };
//
//   }
// }else{
//   if(weatherData2.centers[i].sessions[0].min_age_limit=="18"){
// var newData={
// blockName:weatherData2.centers[i].block_name,
// blockAddress:weatherData2.centers[i].address,
// Avaccine1:weatherData2.centers[i].sessions[0].vaccine,
// Adose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
// Adose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//
//               Avaccine2:"COVAXIN",
//               Adose21:"00",
//               Adose22:"00",
//
//
// Ovaccine1:"COVISHIELD",
// Odose11:"00",
// Odose12:"00",
//
// Ovaccine2:"COVAXIN",
// Odose21:"00",
// Odose22:"00"
// };
//
// }else{
// var newData={
// blockName:weatherData2.centers[i].block_name,
// blockAddress:weatherData2.centers[i].address,
// Avaccine1:"COVISHIELD",
// Adose11:"00",
// Adose12:"00",
//
// Avaccine2:"COVAXIN",
// Adose21:"00",
// Adose22:"00",
//
//           Ovaccine1:weatherData2.centers[i].sessions[0].vaccine,
//           Odose11:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//           Odose12:weatherData2.centers[i].sessions[0].available_capacity_dose1,
//           Ovaccine2:"COVAXIN",
//           Odose21:"00",
//           Odose22:"00"
//
//
// };
// }
// }


// -----------------new way------------------------

// weatherData2.centers.forEach(function(center){
//
//   var  blockAddress="";
//   var blockName="";
//   var  Avaccine1="";
//   var  Adose11;
//   var  Adose12;
//
//   var  Avaccine2="";
//   var  Adose21;
//   var  Adose22;
// var    Ovaccine1="";
// var    Odose11;
//   var  Odose12;
//
//   var  Ovaccine2="";
//   var  Odose21;
// var    Odose22;
//   blockName=center.block_name;
//   blockAddress=center.address;
//   center.sessions.forEach(function(session){
//
//     if(session.min_age_limit==18){
//         if(session.vaccine=="COVISHIELD"){
//
//
//     Avaccine1=session.vaccine;
//     Adose11=session.available_capacity_dose1;
//     Adose12=session.available_capacity_dose2;
//   }else{
//
//     Avaccine2=session.vaccine;
//     Adose21=session.available_capacity_dose1;
//     Adose22=session.available_capacity_dose1;
//   }
//
// }else{
//
//   if(session.vaccine=="COVISHIELD"){
//
// Ovaccine1=session.vaccine;
// Odose11=session.available_capacity_dose1;
// Odose12=session.available_capacity_dose2;
// }else{
//
// Ovaccine2=session.vaccine;
// Odose21=session.available_capacity_dose1;
// Odose22=session.available_capacity_dose1;
// }
//
//
// }
//   });
// if(Avaccine1==""){
//     Avaccine1="COVISHIELD";
//     Adose11="00";
//     Adose12="00";
// }
// if(Ovaccine1==""){
//     Ovaccine1="COVISHIELD";
//     Adose11="00";
//     Adose12="00";
// }
// if(Avaccine2==""){
//     Avaccine2="COVAXIN";
//     Adose21="00";
//     Adose22="00";
// }
// if(Ovaccine2==""){
//     Ovaccine2="COVAXIN";
//     Odose21="00";
//     Odose22="00";
// }
// console.log(Avaccine2);
// var newData={
//     blockName:blockName,
//       blockAddress:blockAddress,
//       Avaccine1:Avaccine1,
//       Adose11:Adose11,
//       Adose12:Adose12,
//       Avaccine2:Avaccine2,
//       Adose21:Adose21,
//       Adose22:Adose22,
//       Ovaccine1:Ovaccine1,
//       Odose11:Odose11,
//       Odose12:Odose12,
//       Ovaccine2:Ovaccine2,
//       Odose21:Odose21,
//       Odose22:Odose22
// };
//
