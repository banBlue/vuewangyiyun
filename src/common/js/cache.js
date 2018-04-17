import storage from 'good-storage'

const HOUSE = '_HOUSE_';

const HISTORY = '_HISTORY_';

//根据传递来的id对收藏列表检索
export function searchoffLine(id) {
  let oldArr = storage.get(HOUSE,[]);

  if(oldArr.indexOf(id) == -1){
    return false
  }else {
    return true
  }
}

//根据id删除收藏列表中的某条歌曲
export function deleteoffLine(id) {
  let oldArr = storage.get(HOUSE,[]);

  //删除掉歌曲
  oldArr.splice(oldArr.indexOf(id),1);
  storage.set(HOUSE,oldArr);
}

//添加进收藏列表
export function addOfflLine(id,song) {
    let oldArr = storage.get(HOUSE,[]);

    //查找id是否存在
    if(oldArr.length > 0){
      if(oldArr.indexOf(id) == -1){
        oldArr.push(id)
      }
    }else {
      oldArr.push(id)
    }

   storage.set(HOUSE,oldArr);
}

export function getOfflLine() {
  return storage.get(HOUSE)
}

export function AllremoveLine() {
  storage.remove(HOUSE)
}


//历史记录
export function addHistory(val) {
  let history = storage.get(HISTORY,[]);

  let flag = true;
  history.forEach((item) => {
    if(val == item){
      flag =false;
    }
  });

  if(flag){
    if(history.length > 4){
      history.length = 4;
    }
    history.unshift(val);
    storage.set(HISTORY,history);
  }
  return getHistory();
}

export function getHistory(){
  return storage.get(HISTORY,[]);
}

export function emptyHistory() {
  storage.set(HISTORY,[]);
  return getHistory();
}

export function deleteHistory(index) {
  let history = storage.get(HISTORY);
  history.splice(index,1);
  storage.set(HISTORY,history);
  return getHistory();
}
