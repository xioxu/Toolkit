var fs = require("fs");
var Sendcloud = require('sendcloud');

var api_user = 'xioxu1';
var domain = 'sc1.datafiddle.net';
var api_key = "vBS0xoJlidhP";

 var sc = new Sendcloud(api_user,api_key,'522807@qq.com','青');
var mailTemlpate = fs.readFileSync("mail.template").toString();
 

function sendMail(addrInfo, mailTemlpate) {
    var name = addrInfo[0].substr(0, 1);

    if (addrInfo[3] == "M") {
        name += "先生";
    } else if (addrInfo[3] == "F") {
        name += "女士";
    } else {
        name += "先生/女士";
    }

    var mailContent = mailTemlpate.replace("@name", name);
console.log(mailContent);
  sc.send(addrInfo[2],'关于项目的发放',mailContent).then(function(info){
    console.log(info);
});

}

var lineReader = require('readline').createInterface({
    terminal: false,
    input: fs.createReadStream('address.txt')
});

lineReader.on('line', function (line) {
    var addr = line.split(",");

    sendMail(addr, mailTemlpate);
});