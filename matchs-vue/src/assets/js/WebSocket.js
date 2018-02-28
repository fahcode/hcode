const wsConnection = async(url) => {
    if(window.WebSocket == undefined) {
        alert('浏览器不支持WebSocket')
        return false;
    }
    let _WebSocket = await new WebSocket(url);
    //_WebSocket.send('broadcast;'+msg);
    //_WebSocket.close();
    
    return _WebSocket;
}

export default wsConnection