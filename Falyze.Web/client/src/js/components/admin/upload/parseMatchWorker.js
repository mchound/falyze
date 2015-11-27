var node,
    matchData;

self.addEventListener('message', function (e) {
    var node = e.data.node;
    var matchData = e.data.matchData;
    var start = (/<table/g).exec(matchData).index;
    var end = (/<\/table/g).exec(matchData).index + 8;
    var source = matchData.substring(start, end);
    node.innerHTML = source;

    for (var i = 0; i < removes.length; i++) {
        var r = removes[i].toLowerCase();
        var ths = node.querySelectorAll('th');
        var index;
        var q;
        for (q = 0; q < ths.length; q++) {
            if (ths[q].innerText.toLowerCase() === r) {
                index = q;
                break;
            }
        }
        ths[q].remove();
        var cols = node.querySelectorAll('tr td:nth-child(' + (q + 1) + ')');
        for (var c = 0; c < cols.length; c++) {
            cols[c].remove();
        }
    }

    self.postMessage(node);    
}, false);