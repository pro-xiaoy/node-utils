# 前端项目组图片压缩管理
> 最近优化整理项目，发现很多同学对导入的图片基本上不存在压缩这个概念，不谈论到打开网站的响应速度，就打包完的大小可能都会有很大的影响。写了以下这个小工具用于判断项目中图片是否压缩。
## 压缩工具
    建议使用的熊猫压缩

* 原理介绍
 
    根据官网[熊猫压缩](https://tinypng.com/)介绍，主要是使用Quantization的技术，通过合并图片中相似的颜色，通过将 24 位的 PNG 图片压缩成小得多的 8 位色值的图片，并且去掉了图片中不必要的 metadata（元数据，从 Photoshop 等工具中导出的图片都会带有此类信息），这种方式几乎能完美支持原图片的透明度。有部分文档指出tinypng同时采用了pngquant、optipng、adV**g几种脚本。图片的压缩率能达到50%以上。
## 图片压缩和非压缩以后的区别
    介于google的搜索我们发现如果是直接通过PSD切图切出来的图片在他本身的文件名字符集的介于第55-60位的字符是adobe。以此作为判断是否需要压缩。

## 使用NODE遍历文件
    NODE代码
```js
dileDisplay(filePath);
function dileDisplay(filePath) {
    // 遍历文件夹
    fs.readdir(filePath, (err, files) => {
        if(err) {
            console.error('err+++', err)
        } else {
            files.forEach((filename) => {
                let filedir = path.join(filePath, filename)
                // 判断文件是否存在
                fs.stat(filedir, (error, stats) => {
                    if(error) {
                        console.error('error+++', error)
                    } else {
                        // 判断类型
                        let isFile = stats.isFile();
                        let isDir = stats.isDirectory()
                        if(isFile) {
                            // 判断是否是压缩文件
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
```
## 判断图片是否压以及文件路径
```js
function isCompressed(imagePath, filename) {
    const data = fs.readFileSync(imagePath)
    const result = data.toString('utf-8', 50, 55).toLowerCase()
    //  === -1就是已经压缩过的图片
    if(result.indexOf('adobe') >= 0) {
        console.log(`图片需要压缩: ${filename}  文件坐在目录: ${imagePath}`)
    }
    return result.indexOf('adobe') === -1
}

```
## 完整代码
```js
const fs = require('fs')
const path = require('path')
// 因个人项目
let imgFilePath = 'E:\\works\\xxx\\src\\assets'

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

```
## 总结
    本次脚本的编写主要目的:
    
1. 优化项目中硬性占用大量内存的文件
2. 规范项目编写
3. 基础建设的增加，业务代码重要的同时更好的提升自己的能力吧

