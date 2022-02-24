/*
 * @Author: 姜彦汐
 * @Date: 2021-09-30 22:21:19
 * @LastEditors: 姜彦汐
 * @LastEditTime: 2022-02-24 14:51:59
 * @Description: 
 * @Site: https://www.undsky.com
 */
const path = require('path')
const exec = require('child_process').exec
const gm = require('gm').subClass({
    imageMagick: true
})

module.exports = {
    image: function () {
        const {
            app,
            config,
            ctx
        } = this;

        /**
         * @description: 调整图片大小，如果要保留图片宽高比可以固定宽或高另一边设置为 null
         * @param {*} image
         * @param {*} width
         * @param {*} height
         * @param {*} output
         * @return {*}
         */
        function resize(image, width, height, output) {
            return new Promise((resolve, reject) => {
                gm(image)
                    .resize(width, height)
                    .write(output, err => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    })
            });
        }

        /**
         * @description: 圆形图片
         * @param {*} img
         * @param {*} size
         * @param {*} output
         * @return {*}
         */
        function circle(img, size, output) {
            return new Promise(function (resolve, reject) {
                gm(size, size, 'none')
                    .fill(img)
                    .drawCircle(size / 2, size / 2, size / 2, 0)
                    .write(output, err => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    })
            });
        }

        /**
         * @description: 圆角
         * @param {*} img
         * @param {*} width
         * @param {*} height
         * @param {*} round
         * @param {*} output
         * @return {*}
         */
        function roundedCorner(img, width, height, round, output) {
            return new Promise(function (resolve, reject) {
                const maskImg = path.join(path.parse(output).dir, `mask${new Date().getTime()}.png`)
                exec(`convert -size ${width}x${height} xc:none -draw "roundrectangle 0,0,${width},${height},${round},${round}" ${maskImg}`, (err, stdout, stderr) => {
                    if (err) {
                        reject(err)
                    } else {
                        gm(img)
                            .resize(width, height)
                            .write(output, err => {
                                if (err) {
                                    reject(err)
                                } else {
                                    exec(`convert ${output} -matte ${maskImg} -compose DstIn -composite ${output}`, (err, stdout, stderr) => {
                                        if (err) {
                                            reject(err)
                                        } else {
                                            resolve()
                                        }
                                    })
                                }
                            })
                    }
                })
            });
        }

        return {
            resize,
            circle,
            roundedCorner
        }
    }
}