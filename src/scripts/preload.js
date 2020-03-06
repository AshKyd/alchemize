// prefetch language files
[ "javascript", "html", "css", "xml", "json" ].forEach(function(lang){
  ['worker', 'mode'].forEach(function(script){
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'ace/'+script+'-'+lang+'.js';
    link.as = 'script';
    document.head.appendChild(link);
  });
});