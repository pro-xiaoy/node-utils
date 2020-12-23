const fs = require('fs')
const path = require('path')
let imgFilePath = 'E:\\works\\mcep\\src\\assets'

var filePath = path.resolve(imgFilePath);
dileDisplay(filePath);
function dileDisplay(filePath) {
    fs.readdir(filePath, (err, files) => {
        if(err) {
            console.error('err+++', err)
        } else {
            files.forEach((filename) => {
                let filedir = path.join(filePath, filename)
                fs.stat(filedir, (error, stats) => {
                    if(error) {
                        console.error('error+++', error)
                    } else {
                        let isFile = stats.isFile();
                        let isDir = stats.isDirectory()
                        if(isFile) {
                            isCompressed(filedir, filename)
                        }
                        if(isDir) {
                            dileDisplay(filedir)
                        }
                    }
                })
            })
        }
    })
}


function isCompressed(imagePath, filename) {
    const data = fs.readFileSync(imagePath)
    const result = data.toString('utf-8', 50, 55).toLowerCase()
    //  === -1就是已经压缩过的图片
    if(result.indexOf('adobe') >= 0) {
        console.log(`图片需要压缩: ${filename}  文件坐在目录: ${imagePath}`)
    }
    return result.indexOf('adobe') === -1
}
