const fs = require("fs");
const parse = require("csv-parse").parse;
// const csv = require("csv-parser");
const extract = require("extract-zip");
// const parse = __parse;
function doFileMagick(filePath, callback) {
    fs.readFile(filePath, "utf8", function (err, data) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        // console.log("data");
        parse(data, { columns: true }, function (err, output) {
            console.log("parsed");
            if (err) {
                return callback(err);
            }
            callback(null, output);
        });
    });
}

function deleteFile(path) {
    fs.unlink(path, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

async function extracFile(file, dest) {
    try {
        await extract(file, { dir: dest });
        deleteFile(file);
        return true;
    } catch (err) {
        console.log(err);
        return false;
        // handle any errors
    }
}

module.exports = { doFileMagick, deleteFile, extracFile };
