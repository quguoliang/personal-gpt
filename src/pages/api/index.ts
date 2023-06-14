export function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return { file: new File([u8arr], filename, { type: mime }), type: mime };
}
