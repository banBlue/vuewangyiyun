import axios from 'axios';
import jsonp from 'common/js/jsonp';

export  function getSearch(str) {
  return axios.get(`http://musicapi.leanapp.cn/search?keywords=${str}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&_=1521004217962'

  const options = {
    param:'jsonpCallback'
  };
  const data = Object.assign({},{
    platform:'h5',
    uin:0,
    needNewCode:1,
  });
  return jsonp(url,data,options)
}
