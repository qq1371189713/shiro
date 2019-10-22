$(function(){
    //小屏幕主菜单切换显示隐藏
    var $headerMenu = $('#headerMenu');
    var $hmenuToggleBtn = $('#hmenuToggleBtn');
    var headerMenuTimer = null;

    $hmenuToggleBtn.click(function(){
        $headerMenu.toggleClass('headermenu-query-toggle');
    });
    
    $(document).on('click', function(ev){
        if($.contains($headerMenu[0], ev.target) || $hmenuToggleBtn[0] == ev.target){
            return;
        }

        $headerMenu.removeClass('headermenu-query-toggle');
    });

    //收缩隐藏侧边栏
    var $sidebarBodyer = $('#sidebarBodyer');
    var $sidebarBtn = $('#sidebarBtn');

    $sidebarBtn.click(function(){
        $sidebarBtn.toggleClass('toggleSidebarbtn');
        $sidebarBodyer.toggleClass('toggleSidebar');
    });

    //侧边栏选中
    var $sidebarMenuLi = $('#sidebarMenu li');
    $sidebarMenuLi.click(function(ev){
        console.log('sidebarMenuLi click');
        if($(this).hasClass('child')){
            $(this).toggleClass('toggleSecondmenu');
            return;
        }

        $sidebarMenuLi.removeClass('cur');
        $(this).addClass('cur');


        if($(this).parent().hasClass('second-menu')){
            $(this).parents('li').addClass('cur');
            ev.stopPropagation();
        }
    });


    function sidebarClick() {
        var $sidebarMenuLi = $('#sidebarMenu li');
        $sidebarMenuLi.click(function(ev){
            console.log('function sidebarMenuLi click');
            if($(this).hasClass('child')){
                $(this).toggleClass('toggleSecondmenu');
                return;
            }

            $sidebarMenuLi.removeClass('cur');
            $(this).addClass('cur');


            if($(this).parent().hasClass('second-menu')){
                $(this).parents('li').addClass('cur');
                ev.stopPropagation();
            }
        });
    }


    //计算侧边栏是否能够全部显示，判断是否需要鼠标中键滚动
    function caclSidebarScroll(){
        //判断窗口高度是否足以容纳侧边栏数量
        var windowHeight = $(document).height();
        var headerHeight = $('.header').height();
        var bodyerHeight = windowHeight - headerHeight;
        var $sidebarMenu = $('#sidebarMenu');
        
        var sidebarMenuHeight = 0;
        var $sidebarMenuLi = $sidebarMenu.children('li');
        
        
        $sidebarMenuLi.each(function(index, element){
            sidebarMenuHeight += $(element).height();
        });
        $sidebarMenu.css('height', sidebarMenuHeight);


        var sidebarDistance = sidebarMenuHeight - bodyerHeight;

        var $sidebar = $('#sidebar');

        $sidebar.off('mousewheel');

        if(sidebarDistance <= 0){
            $sidebar.css('top', 0);
            return;
        }

        // if(sidebarMenuHeight >= bodyerHeight){
        //     $sidebarBodyer.addClass('scrollSidebar');
        // }
        // else{
        //     $sidebarBodyer.removeClass('scrollSidebar');
        // }

        $sidebar.on('mousewheel', function(event, delta, deltaX, deltaY){
            
            var top = $sidebarMenu.position().top;
            
            if(delta === 1){
                var moveDistance = top + 36;
                
                moveDistance = moveDistance >= 0 ? 0 : moveDistance;

                $sidebarMenu.css('top', moveDistance);
            }
            else if(delta === -1){
                var moveDistance = top - 36;
                
                moveDistance = Math.abs(moveDistance) >= sidebarDistance ? -sidebarDistance : moveDistance;

                $sidebarMenu.css('top', moveDistance);
            }
        });
    }

    caclSidebarScroll();

    $(window).resize(function(){
        caclSidebarScroll();
    });
});