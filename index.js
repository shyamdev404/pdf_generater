const express = require('express')
const path = require('path')
const ejs = require('ejs')
const app = express()
const puppeteer = require('puppeteer')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


// index page
app.get('/ejs', async function (req, res) {

    const data = req.body

    const htmlContent = await ejs.renderFile(path.join(__dirname, 'views', 'certificate.ejs'), data)

    const browser = await puppeteer.launch({

        headless: true,
        args: ['--no-sandbox', '--disable-web-security', '--js-flags="--max-old-space-size=2048"', '--debug-print']
    });
    // Open a new blank page
    const page = await browser.newPage();

    // Now we use setContent instead of goto
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Use screen CSS instead of print
    // await page.emulateMediaType('screen');

    const pdfPath = path.join(__dirname, 'pdf', 'output.pdf')



    // Render the PDF
    const pdf = await page.pdf({
        path: pdfPath, // Output the result in a local file
        printBackground: true,
        format: 'A4',
    });

    // Close the browser
    await browser.close();



    res.json({ message: "Pdf Generate", pdfPath })
});

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome ." });
});










app.listen(3000, () => {
    console.log('app is running on 3000')
})