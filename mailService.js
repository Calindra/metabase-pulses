const nodemailer = require("nodemailer");
const config = require('config');

function getHtml(questions) {
    let html = ""
    for ( question of questions ) {
        html += `<a href="${question.url}"><h3>${question.name}</h3></a>
                 <img src="cid:${question.id}"/>
                 <br/><br/>`
    }
    return html
}

function getAttachments(questions) {
    attachments = [];

    for ( question of questions ) {
        attachments.push({
            filename: `${question.imagePath}`,
            path: `./${question.imagePath}`,
            cid: `${question.id}`
        })
    }

    return attachments;
}

async function mailQuestion(subject,mailTo,questions) {
    let transporter = nodemailer.createTransport({
        host: config.get('smtp.host'),
        port: 587,
        secure: false, 
        auth: {
            user: config.get('smtp.user'),
            pass: config.get('smtp.password')
        }
        });

        let info = await transporter.sendMail({
        from: config.get('smtp.sender'),
        to: mailTo,
        subject: subject, 
        text: "Pulses report",
        html: getHtml(questions),
        attachments: getAttachments(questions)});

        console.log("Message sent: %s", info.messageId);
}

module.exports = mailQuestion
