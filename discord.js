require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
var fs = require('fs');

async function mains(){
const client = new Discord.Client(); //create new client
var floor = 2.3;

let embed = new Discord.MessageEmbed()
    .setTitle("1.23 SOL")
    .setAuthor("Vox Punks Club #123 Sold")
    .setColor("#FF0080")
    .addField("Laser | Sol Cap")
    .setDescription("")
    .setURL("https://magiceden.io/item-details/")
    .setThumbnail("https://voxpunksclub.com/images/small/0.jpg");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//make sure this line is the last line
console.log(process.env.CLIENT_TOKEN)
client.login(process.env.CLIENT_TOKEN); //login bot using token


client.on("message", message => { // runs whenever a message is sent
    if (message.content.indexOf("?floor")>-1) { // checks if the message says "?random"
        //const number = Math.random(); // generates a random number
        //message.channel.send(number.toString()); // sends a message to the channel with the number
        if(message.content.indexOf(" ")>-1){
            message.channel.send("Current floor "+floor);
            var _str = message.content.split(" ")[1];
            var _floor = Number(_str);
            if(_floor > 0){
                floor = _floor;
                message.channel.send("Floor set to "+floor);
            }
        }
    }
});

let interval;

client.on('message', async msg => {
  switch (msg.content) {
   //other commands above here...
   case "!eye":
      msg.channel.send("You are now subscribed to eye reminders.");
       interval = setInterval (function () {
        msg.channel.send("Please take an eye break now!")
        .catch(console.error); 
      }, 3600000); //every hour
      break;
  }
})
//894155120395296778

const delay = ms => new Promise(res => setTimeout(res, ms));
var channelid = "894174763226918952"; 
var genChannel = "884023776499601481"; 
//channelid = "892770590237286420";  genChannel = channelid;//dummychannel

 client.on('ready', message => {
    //client.channels.cache.get(channelid).send('I am booted up Wooo Woo, thought I was DeaD here!');
        interval = setInterval (function () {
            //Process for new sales
            let rawdata = fs.readFileSync('./SolScanFetch/result.json');
            let result = JSON.parse(rawdata);

            //update discord status

            //update discord statu


            		//check result already has the data
            for(var i=0; i<result.length;i++){
                try {
                if(result[i].discord=="true"){
                    //console.log("#####   Already processed "+result[i].name)
                    //console.log("one second has elapsed")
                }else{
                    //send discord
                    if(result[i].name == undefined || result[i].name == null || result[i].name == ''){
                        continue;
                    }

                    console.log("#####   Processing "+result[i].name)
                    sleep(5000).then(() => {
                        console.log("one second has elapsed")
                    });

                    if(result[i].name !=null && result[i].name.indexOf("Vox Punks Club")>-1){
                    var id = result[i].name.replace("Vox Punks Club #","");
                  
                    var price = result[i].price;  var emoji;
                    if(price != undefined && price !=null){
                        price = Number(price).toFixed(2);
                        price = price/0.93;
                        price = price.toFixed(2);

                      
                        if(price > 1.8)
                        emoji = "🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀"; 

                        if(price > 2)
                        emoji = "💥💥💥💥💥💥💥💥💥💥💥"; 

                        if(price > 5)
                        emoji = "🚀🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🚀"; 

                        //set volume
                        //console.log(result[0])
                        if(result.length>0){
                            result[0].volume =  Number(result[0].volume) + Number(price);
                            result[0].volume = Number(result[0].volume).toFixed(0);
                            console.log("vol "+result[0].volume)
                            result[0].totalSales =  Number(result[0].totalSales) +1;
                            console.log("totalSales "+result[0].totalSales)
                        }
                    }
                   
                    if(price<=0 && (result[i].name == undefined || result[i].name == null || result[i].name == "")){
                        result[i].discord="true"; result[i].price_error="true";
                        fs.writeFileSync('SolScanFetch/result.json', JSON.stringify(result, null, 4))
                        continue;
                    }

                    if(price==0 || price < 0){
                        price = "Price Check Txn"
                    }

                        embed = new Discord.MessageEmbed()
                            .setTitle("💃ABOVE FLOOR SALE💃 !!!  Price: " +price + " SOL ◎"+ result[i].name+" Sold  "+emoji)
                            .setAuthor("Price: "+ price+" SOL ◎")
                            .setColor("#FF0080")
                            .addField(result[i].time +"UTC")
                            .setDescription("")
                            .setFooter("Market: MagicDen | Volume:  "+result[0].volume +"| Last 24Hr: "+result[0].totalSales+ " Sales ")
                            .setURL("https://explorer.solana.com/tx/"+result[i].txn)
                            .setThumbnail("https://voxpunksclub.com/images/small/"+id+".jpg");

                            delay(10000);
                            client.channels.cache.get(channelid).send(embed)
                            .catch(console.error); 

                            embed.setTitle("🟢 SOLD !!!  Price: " +price + " SOL ◎"+ result[i].name+" Sold  "+emoji);

                            if(price > floor){
                                console.log("Sent to gen");
                                client.channels.cache.get(genChannel).send(embed)
                                .catch(console.error); 

                                

                                if(price > 12){
                                    client.channels.cache.get("884023776499601481").send("@everyone CRAZY SALE OF "+price+" SOL - Some inform the @mods LIFT OFF LIFT OFF 🚀🚀🚀🚀🚀");
                                }else if(price > 8){
                                    client.channels.cache.get("884023776499601481").send(" LIFT OFF LIFT OFF 🚀🚀🚀🚀🚀");
                                }
                            }

                            result[i].discord="true";
                            console.log(result[i].discord); console.log(JSON.stringify(result[i]));
                            fs.writeFileSync('SolScanFetch/result.json', JSON.stringify(result, null, 4))
                    }
                    
                }
            }catch(e){
                console.log(e);
            }
            }
        }, 10000); 
})
}

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

mains()