import axios from 'axios';
import wrapPromise from './wrapPromise.js';


/**
* 用wrapPromise函数包装Axios请求
* @param {string} 要获取的URL
* @returns {Promise} 包装的promise
*/
export const  getData = function (url) {
    console.debug(`🗯️ RequestClient->getData, url:${url}`)
    const promise = axios.get(url).then(({data}) => data); 
    return wrapPromise(promise);
}
  