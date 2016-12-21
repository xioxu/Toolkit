
var fs = require("fs");
var request = require("request");

var MailSend = require('./submail_sdk/mailSend.js')


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

    var mailSend = new MailSend()

    mailSend.add_to(addrInfo[2]);
    mailSend.set_from('auto_license@bim.tztech.net');
    mailSend.set_subject('关于项目的发放');
    mailSend.set_html(mailContent);
    mailSend.send();

}

var lineReader = require('readline').createInterface({
    terminal: false,
    input: fs.createReadStream('address.txt')
});

lineReader.on('line', function (line) {
    var addr = line.split(",");

    sendMail(addr, mailTemlpate);
});