var saveQuestion = require('./questionService');
var mailQuestion = require('./mailService');

async function processPulse(pulse) {
    let questionIds = pulse.questionIds
    let questions = []

    for (let questionId of questionIds) {
        try {
            const question = await saveQuestion(questionId)
            questions.push(question);
        } catch(e) {
            console.error(e);
        }
    }

     return mailQuestion(pulse.subject,pulse.mailTo,questions)
}

async function main() { 
    let args = process.argv.slice(2);
    let pulsesFile = "pulses.json";

    if ( args.length >= 0 ) {
        pulsesFile = args[0];
    }

    console.log("===============SENDING PULSES===============")

    const pulses = require('./'+pulsesFile)
    await Promise.all(pulses.map(p => processPulse(p).catch(e => console.log(e))))

    console.log("===============PULSES SENT===============")

    // In case o error, for an unknow reason the node process gets stuck even tough all promises were resolved
    process.exit(0)
}

main().catch(console.error);