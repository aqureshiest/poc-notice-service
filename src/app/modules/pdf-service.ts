import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import * as os from "os";
import { spawn } from "child_process";

const writeFileAsync = promisify(fs.writeFile);

async function generatePDFFromHTML(htmlContent: string, password: string = "1234") {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(htmlContent);

    // Generate the PDF
    const buffer = await page.pdf({ format: "A4" });

    await browser.close();

    // if pdf needs to be password protected
    if (password) {
        return await passwordProtectPDF(buffer, password);
    }

    return buffer;
}

async function passwordProtectPDF(buffer: Buffer, password: string) {
    return new Promise<Buffer>(async (resolve, reject) => {
        // Save the PDF buffer to a local temporary file
        const tempDir = os.tmpdir();
        const tempFileName = `output_${Date.now()}.pdf`;
        const tempFilePath = path.join(tempDir, tempFileName);
        const protectedFilePath = path.join(tempDir, `protected_${Date.now()}.pdf`);
        let protectedPdfBuffer;

        try {
            await writeFileAsync(tempFilePath, buffer);
            console.log(`PDF saved to ${tempFilePath}`);

            const qpdfProcess = spawn("qpdf", [
                "--encrypt",
                password,
                password,
                "256",
                "--",
                tempFilePath,
                protectedFilePath,
            ]);

            qpdfProcess.on("close", async (code) => {
                console.log(`qpdf process exited with code ${code}`);

                // Read the protected PDF back into a buffer
                protectedPdfBuffer = await fs.promises.readFile(protectedFilePath);

                // Clean up the temporary files
                await fs.promises.unlink(tempFilePath);
                await fs.promises.unlink(protectedFilePath);

                if (code === 0) {
                    console.log(`PDF protected and saved to ${protectedFilePath}`);
                    resolve(protectedPdfBuffer);
                } else {
                    reject(`qpdf process exited with code ${code}`);
                }
            });
        } catch (err) {
            console.error("Error saving PDF:", err);
            reject(err);
        }
    });
}

export { generatePDFFromHTML };
