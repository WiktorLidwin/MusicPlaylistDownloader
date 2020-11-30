const fs = require('fs')
const axios = require('axios');
request = require('request');

url = "https://www.youtube.com/watch?v=aircAruvnKk&list=PL_h2yd2CGtBHEKwEH5iqTZH85wLS-eUzv"

console.log(url)


options = {}
request({ method: 'GET', url, ...(options || {}) }, async (err, res, body) => {
    console.log("hi") ;
    if (err)  console.log(err) ;
    console.log("hi2") ;
    fs.writeFile('Output21', body, (err) => {
        // In case of a error throw err. 
        console.log("h3") ;
        if (err) console.log(err) ;
    })
})

// axios.get(url)
//     .then(response => {
//         getSongIds(response)
//         // id = url.split('=')[1]

//         // TitleRegex = /\\"title\\":\\"(.*?)\\"/;
//         // title = str.match(TitleRegex)[1]
//         // // console.log(title)

//         // AuthorRegex = /\\"author\\":\\"(.*?)\\"/;
//         // author = str.match(AuthorRegex)[1]
//         // // console.log(author)

//         // LengthRegex = /\\"lengthSeconds\\":\\"(.*?)\\"/;
//         // length = str.match(LengthRegex)[1]
//         // // console.log(length)

//         // temp = {
//         //     "author": (author),
//         //     "title": (title),
//         //     "length": (length),
//         //     "id": id
//         // }
//         // console.log(temp)
//         // jsonStr = JSON.stringify(temp);
//         return jsonStr
//     })
//     .catch(error => {
//         console.log(error.message)

//         jsonStr = JSON.stringify(error);
//         return jsonStr
//     });
// function getSongIds(response){
//     console.log("here5")

//     fs.writeFile('Output', response.data, (err) => {
//         // In case of a error throw err. 
//         if (err) throw err;
//     })

//     console.log("here3")


//     str = response.data
    
//     TitleRegex = /\"url\":\"\/watch?v=(.*?)\"/;
//     title = str.match(TitleRegex)
//     console.log("here2")

    
//     fs.writeFile('Output2', title, (err) => {
//         // In case of a error throw err. 
//         if (err) throw err;
//     })

//     console.log("here1")

// }