const fs = require('fs');
const pdfParse = require('pdf-parse');

const testFile = 'c:\\Users\\iamra\\OneDrive\\Desktop\\Hiresense\\backend\\uploads\\1771868093769-1.pdf';

const test = async () => {
    try {
        if (!fs.existsSync(testFile)) {
            console.log('File does not exist');
            return;
        }
        const dataBuffer = fs.readFileSync(testFile);
        console.log('File read, size:', dataBuffer.length);
        const data = await pdfParse(dataBuffer);
        console.log('Text extracted:', data.text.substring(0, 100) + '...');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

test();
