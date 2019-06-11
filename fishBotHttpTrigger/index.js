module.exports = async function (context, req) {
    
    const line = require('@line/bot-sdk')

    const client = new line.Client({
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,  
        channelSecret:  process.env.CHANNEL_SECRET,
    });
    
    for (let event of req.body.events ){
        const message  = event.message;
        const token = event.replyToken;
        
        let content;
        let result;
        let searchResult;
        if (message.type === 'image'){
            content = await getContent(context, message, client);
            let response = await getResponse(context,content);
            result = await getResult(context,response);
            searchResult = await getSearchResult(context,result);
        }
        const reply = await selectReplyMessage(context,message,result, searchResult);
        /*const replyMessage = [];
        await replyMessage.push(reply)
        await replyMessage.push(rep)
        context.log(replyMessage)*/
        await client.replyMessage(token, reply)
    }
}

/**
 * 送信されたもののデータの読み込みを行う関数
 * @param {*} context 
 * @param {*} message
 * @param {*} client 
 */
function getContent(context, message, client) {
    return new Promise((resolve, reject) => {
        context.log('start1')
        let content = [];
        try {
            client.getMessageContent(message.id)
            .then((stream) => {
                stream.on('data', (chunk) => {
                    content.push(new Buffer(chunk))    
                });
                stream.on('end',() => {
                    resolve(Buffer.concat(content));
                })
                stream.on('error', (err) => {
                  reject(err);
                });
              });
        } catch(err) {
            reject(err);
        }
    }); 
};

/**
 * Custom visionにデータを送信し、結果を取得する関数
 * @param {*} context 
 * @param {*} content 
 */
async function getResponse(context,content){
    context.log('start2')
    const axios = require('axios');
    
    //APIの呼び出し
    const url = 'https://japaneast.api.cognitive.microsoft.com/customvision/v3.0/Prediction/d5220785-87e6-4779-a458-78da96915749/classify/iterations/Iteration11/image';
    
    const config = {
        headers:{
            'Content-Type':'application/octet-stream',
            'Prediction-Key':process.env.PREDICTION_KEY,
            //サブスクリプションキー
            'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
        }
    }
    const response = await axios.post(url,content,config)
    return response.data;
}

/**
 * 結果の配列を降順にソートし、もっとも可能性の高いものを取得する関数
 * 配列の0番目に最も確率の高いものが入る可能性があるためコメントアウトしているが確定ではないのでソートを推奨
 * @param {*} context 
 * @param {*} response 
 */
async function getResult(context,response){
    context.log('start3')
    /*
    let predictions = await response.predictions;
    //降順にソート
    predictions.sort(function(a,b) {
        if(a.probability > b.probability) {
            return -1;
        } else{
            return 1
        }
    });
    let result = await predictions[0];
    context.log(result);
    return result;
    */
    return response.predictions[0]
}

/**
 * 取得したタグを元にBingでwikiの検索結果を返す関数
 * @param {*} context 
 * @param {*} result 
 */
async function getSearchResult(context,result){
    context.log('start4')
    return new Promise((resolve,reject) => {
        let Bing = require('node-bing-api') ({ 
            accKey: process.env.BING_SEARCH_KEY,
        });

        let fishname = result.tagName;
        let search;
        Bing.web(fishname + "wikipedia",{
            count: 3,
        },function(error,res,body) {
            let string = 'wikipedia';
            for(let array of body.webPages.value){
                if(array.url.indexOf(string) > -1 && array.url.indexOf(encodeURIComponent(fishname)) > -1){
                    context.log('a',array);
                    search = array
                    break;
                }
            }
            resolve(search);
        })

    })
}

/**
 * 送られてきたメーセージに対して送信するメッセージを選択する関数
 * @param context 
 * @param message 
 */
function selectReplyMessage(context,message,result, searchResult){
    context.log('start5')
    let reply;
    context.log(message.type);
    if (message.type === 'image') {
        if (result.probability > 0.7){
            reply = [{
                type: 'text',
                text: '送信された画像は\n種類：' + result.tagName　+ '\n確率：' + (Math.round(result.probability * 1000)/10)+ '%です。',
            }, {
                type: 'text',
                text: searchResult.url,
            }];
        }  else{
            reply = [{
                type: 'text',
                text: '送信された画像は登録されて\nいない魚種、または魚ではな\nい可能性があります。'
            }]
        }  
    } else {
        reply = [{
            type: 'text',
            text: '適切なメッセージを入力してください。',
        }]
    }
    return reply;
}
