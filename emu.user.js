// ==UserScript==
// @name        动车组交路查询
// @description 在 12306 订票页面上显示动车组型号与交路
// @author      Arnie97
// @namespace   https://github.com/Arnie97
// @homepageURL https://github.com/Arnie97/emu-tools
// @match       https://kyfw.12306.cn/otn/leftTicket/init
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     2017.09.23
// ==/UserScript==

// Search the database
function getTrainModel(code) {
    if ('GDC'.indexOf(code[0]) == -1) {
        return;
    }
    for (var key in models) {
        var codes = models[key];
        for (var i = codes.length; i >= 0; i--) {
            if (code == codes[i]) {
                return key;
            }
        }
    }
}

// Patch items on the web page
function showTrainModel(i, obj) {
    var code = $(obj).find('a.number').text();
    var model = getTrainModel(code);
    if (!model) {
        return false;
    }
    var url = 'https://moerail.ml/img/' + code + '.png';
    var img = $('<img>').attr('src', url).width(600).hide();
    var link = $('<a>').attr('onclick', '$(this).children().toggle()');
    link.text(model).append(img);
    $(obj).find('.ls>span').replaceWith(link);
    return true;
}

// Register the event listener
function main(dom) {
    models = JSON.parse(dom.responseText);
    var observer = new MutationObserver(function() {
        if ($('#trainum').html()) {
            var result = $('.ticket-info').map(showTrainModel);
            var count = result.length, sum = 0;
            result.each(function(i, x) {
                sum += x? 1: 0;
            });
            console.log('EMU Tools:', count, 'checked,', sum, 'found');
        }
    });
    observer.observe($('#t-list>table')[0], {childList: true});
}

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://moerail.ml/models.json',
    onload: main
});
GM_addStyle('\
    .ls          {width: 120px !important;} \
    .ticket-info {width: 400px !important;} \
');
