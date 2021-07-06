const puppeteer = require('puppeteer');
const config = require('config');


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }

async function saveQuestion(questionId) {
    console.log("+ Collecting question " + questionId )

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Uncomment if you want the screenshot with a different 
    /*await page.setViewport({
        width: 900,
        height: 600,
        deviceScaleFactor: 1,
    });*/

    let metabaseUrl = config.get('metabase.url');

    question = {}
    question.id = questionId;
    question.imagePath = `${questionId}.png`;
    question.url = `${metabaseUrl}question/${questionId}`

    await page.goto(metabaseUrl);
    await page.waitFor('input[name=username]');

    await page.type('input[name=username]', config.get('metabase.user'));
    await page.type('input[name=password]', config.get('metabase.password'));

    await page.keyboard.press('Enter');

    await page.waitForFunction( () => document.querySelector("body").innerText.includes('OUR DATA'));

    await page.goto(question.url, {waitUntil: 'networkidle2'});

    const questionTimeout = 60 * 4 * 1000;
    await page.waitForFunction( () => !document.querySelector(".Loading-message"), { timeout: questionTimeout });

    const text = await page.$('.mr1.Text-r5zl0h-0')
    question.name = await page.evaluate(el => el.textContent, text)

    const graph = await page.$('.Visualization');
    await graph.screenshot({path: question.imagePath});

    await browser.close();

    console.log("- Question collected " + questionId )

    return question;
}

module.exports = saveQuestion