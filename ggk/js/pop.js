$(function(e){


    /*滚动名单*/
    if($('#rankBox div').length>10){
        setInterval(function(){
            $('#rankBox div').eq(0).animate({'margin-top':'-30px'},600,function(){
                $('#rankBox div').eq(0).appendTo($('#rankBox'));
                $('#rankBox div').css('margin-top',0);
            });
        },3000)
    }

    $('#topItems').add('#rareItems').click(function(){
        popShow(this);
        return false;
    })


})

var pid=0;

function popShow(obj){
    var popbg=$('#popbg_fmlogin');
    var popBox=$('#popBox');
    var exchange=$('.exchange');
    var documentH = $(document).height();
    var sClass = $(obj).attr('name');
    pid = $(obj).attr('pid');
    exchange.attr('pid',pid);
    popbg.css({'position':'absolute','z-index':99,'background':'#000','opacity': 0.3,'height':documentH+'px','width':'100%'})
    popBox.removeClass().addClass(sClass);

    var boxT=($(window).height()-popBox.height())/2+$(document).scrollTop();
    var boxL=($(window).width()-popBox.width())/2;
    popBox.css({'z-index':100,'top':boxT+'px','left':boxL+'px'});
    popbg.show();
    popBox.show();

    popbg.animate({'opacity': 0.6},200,function(){
        popBox.show();
    });

    popBox.find('.close').click(function(){
        window.onscroll = window.onresize = null;
        if(!popbg.is(':animated'))
        {
            popbg.animate({'opacity': 0.3},300,function(){
                $(this).hide();
                if(popBox.find('table').length>0)
                {
                    popBox.find('table').remove();
                }

                popBox.removeClass().hide();
            });
        }
        return false;
    })


    window.onscroll = window.onresize= function(){
        boxL=($(window).width()-popBox.width())/2;
        boxT=($(window).height()-popBox.height())/2+$(document).scrollTop();
        popBox.stop().animate({'top':boxT+'px','left':boxL+'px'},300);
    }
}

function fnExchange(msg)
{
    var popBox=$('#popBox');
    popBox.removeClass().addClass('showDiv tips');
    var tab = $('<table cellpadding="0" cellspacing="0" border="0" class="tab_msg"><tr><td>'+msg+'</td></tr></table>');
    tab.appendTo(popBox);
}
