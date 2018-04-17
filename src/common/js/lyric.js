export function setLyric(lyric) {
  let arr = lyric.split("\n");
  let re = /\[\d*:\d*((\.|\:)\d*)*\]/g;
  let arr1 = [];

  for(let i=0;i<arr.length;i++) {
    let s = arr[i].match(re)?formatTime(arr[i].match(re)[0]):0;

    arr1.push({
      t:s,
      s:arr[i].slice(arr[i].indexOf("]")+1,arr[i].length)
    })
  }

  function formatTime(num) {
    num = num.substring(1,num.length - 1);
    let arrTime = num.split(":");
    return (parseFloat(arrTime[0]*60) + parseFloat(arrTime[1])).toFixed(2)
  }
  return arr1.slice(0,arr1.length-1);
}

