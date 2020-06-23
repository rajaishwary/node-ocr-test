const download = require('images-downloader').images;
const Tesseract = require('tesseract.js');
const tesseract = require("node-tesseract-ocr");

const fs = require('fs');
const path = require('path');

const dest = path.join(__dirname, 'images');
const imagesTextFile = path.join(__dirname, 'text.json');

function downloadImgs() {
    const images = [];
    for (let i = 1; i < 10; i++) {
        images.push(`https://certificate.openocean.in/certi/page_${i}.jpg`);
    }
    console.log(dest, images, '-------->');
    download(images, dest)
        .then(result => {
            console.log('Images downloaded', result);
        })
        .catch(error => console.log("downloaded error", error))
}

// downloadImgs();

function getAllImageText() {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 6,
      }

    const directoryPath = path.join(__dirname, 'images');
    fs.readdir(directoryPath, async function (err, files) {
        if (err) {
            return console.log('UNABLE_TO_READ_DIR: ' + err);
        }
        const imageArr = [];
        const promises = [];

        for (const file of files) {
            const imgPath = path.join(__dirname, "images", file);
            const sizeInBytes = fs.statSync(imgPath).size;
            if (sizeInBytes !== 0) {
                try {
                    if (file === '.DS_Store') return;
                    console.log(`PROCESS: ${file}: ${files.indexOf(file)}`);
                    // promises.push(Tesseract.recognize(
                    //     imgPath,
                    //     'eng',
                    //     {  
                    //         oem: '1',
                    //         psm: '3',
                    //         logger: m => console.log(m) 
                    //     }
                    //   ));
                    promises.push(tesseract.recognize(imgPath, config));
                } catch (err) {
                    console.log(err);
                }
            } else {
                imageArr.push({ [file]: JSON.stringify('SIZE_ZERO') });
            }
        }
        const data = await Promise.all(promises);
        const fileDataObj = files.map((file, index) => {return { file, text: data[index]}});
        console.log(data);
        fs.writeFile(imagesTextFile, JSON.stringify(fileDataObj), function (err) {
            if (err) {
                return console.log(err);
            }
            return;
        });
    });
}

getAllImageText();