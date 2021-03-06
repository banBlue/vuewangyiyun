import axios from 'axios';

export function getPlayList(url) {       //获取推荐歌单
  return axios.get(`http://musicapi.leanapp.cn/playlist/detail?id=${url}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getPlaymusic(url) {       //获取推荐单条歌曲
  return axios.get(`http://musicapi.leanapp.cn/music/url?id=${url}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getDetail(url) {       //获取推荐单条歌曲详情
  return axios.get(`http://musicapi.leanapp.cn/song/detail?ids=${url}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}

export function getLyric(id) {       //获取歌词的详细信息
  return axios.get(`http://musicapi.leanapp.cn/lyric?id=${id}`)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    });
}


