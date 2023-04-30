postMessage("Înainte de procesare: ");
onmessage=function(event){
    postMessage('HELLO! '+event.data);
};
