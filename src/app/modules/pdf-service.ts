import puppeteer from "puppeteer";

async function generatePDFFromHTML(htmlContent: string) {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    const buffer = await page.pdf({ format: "A4" });

    await browser.close();

    return buffer;
}

export { generatePDFFromHTML };
