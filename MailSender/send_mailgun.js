var fs = require("fs");

var api_key = 'key-ad8da3d81704ca1314f461';
var domain = 'sanddca4915226.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });


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

    var data = {
        from: '青 <522807@qq.com>',
        to: addrInfo[2],
        subject: '关于项目的发放',
        html: mailContent
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
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