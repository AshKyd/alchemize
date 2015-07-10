/**
 * JS sandbox for untrusted code.
 * This file exists to proxy requests between the privileged app and
 * the non-privileged worker. While we trust the code run here, it's
 * sandboxed because Chrome OS doesn't trust some calls such as eval
 * which Uglify et al rely on.
 */

var worker = new Worker('worker.js');
worker.onmessage = function(e){
    window.parent.postMessage(e.data, '*');
};
 addEventListener('message', function(e) {
     if(e.origin !== window.location.origin){
         console.error('XDR error');
         return;
     }
     worker.postMessage(e.data);
 });
