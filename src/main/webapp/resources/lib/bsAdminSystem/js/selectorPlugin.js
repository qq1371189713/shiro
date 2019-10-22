/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ('onwheel' in document || document.documentMode >= 9) ?
            ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function (elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function (elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function (fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent = event || window.event,
            args = slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            offsetX = 0,
            offsetY = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ('detail' in orgEvent) { deltaY = orgEvent.detail * -1; }
        if ('wheelDelta' in orgEvent) { deltaY = orgEvent.wheelDelta; }
        if ('wheelDeltaY' in orgEvent) { deltaY = orgEvent.wheelDeltaY; }
        if ('wheelDeltaX' in orgEvent) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ('deltaY' in orgEvent) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if ('deltaX' in orgEvent) {
            deltaX = orgEvent.deltaX;
            if (deltaY === 0) { delta = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if (deltaY === 0 && deltaX === 0) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if (orgEvent.deltaMode === 1) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if (orgEvent.deltaMode === 2) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
            // Divide all the things by 40!
            delta /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));





function bsSelectorPlugin(container, data) {
    //容器
    this.$container = $(container);
    //源数据数组
    this.sourceDataArr = _.isEmpty(data) ? [] : data;
    //单个数据项数组
    this.itemDataArr = [];

    this.currentId;
    this.currentIndex = 0;
    this.filterResultArr = [];
    this.selectResultArr = [];
    this.removeIdArr = [];
    this.isRemoveFn = false;

    this.init();
}

//初始化组件
bsSelectorPlugin.prototype.init = function () {
    this.build();
    this.initEvent();
    this.renderData();
    this.getItemData();
    // this.filterData(mockData);
};

//初始化组件结构
bsSelectorPlugin.prototype.build = function () {
    this.$selectorPlugin = $('<div class="broadsense-selectorPlugin"></div>');
    this.$bsSelectorPluginResultCont = $('<div class="bsSelectorPlugin-result-cont clearfix"></div>');
    this.$bsSelectorPluginResult = $('<div class="bsSelectorPlugin-result clearfix"></div>');
    this.$bsSelectorPluginInput = $('<input class="bsSelectorPlugin-input" type="text" placeholder="请输入关键字\选择车辆">');
    this.$bsSelectorPluginSelectBtn = $('<i class="bsSelectorPlugin-select-btn"></i>');
    this.$bsSelectorPluginInputList = $('<div class="bsSelectorPlugin-input-list"></div>');
    this.$bsSelectorPluginInputListUl = $('<ul></ul>');
    this.$bsSelectorPluginSelectList = $('<div class="bsSelectorPlugin-select-list"></div>');
    this.$bsSelectorPluginTree = $('<ul id="bsSelectorPluginTree" class="ztree"></ul>');

    this.$bsSelectorPluginResultCont.append(this.$bsSelectorPluginResult);

    this.$bsSelectorPluginResult.append(this.$bsSelectorPluginInput);

    this.$bsSelectorPluginInputList.append(this.$bsSelectorPluginInputListUl);

    this.$bsSelectorPluginSelectList.append(this.$bsSelectorPluginTree);

    this.$selectorPlugin
        // .append(this.$bsSelectorPluginResult)
        .append(this.$bsSelectorPluginResultCont)
        .append(this.$bsSelectorPluginSelectBtn)
        .append(this.$bsSelectorPluginInputList)
        .append(this.$bsSelectorPluginSelectList);

    this.$container.append(this.$selectorPlugin);
    // return this.$selectorPlugin;
};

//初始化事件
bsSelectorPlugin.prototype.initEvent = function () {
    var self = this;

    //当组件范围内被点击时，自动把输入框获取焦点
    $(self.$selectorPlugin).on('click', function (event) {
        event.stopPropagation();

        self.isRemoveFn = true;

        var targetElement = event.target;

        // 排除部分不自动聚焦的元素
        var t1 = self.$bsSelectorPluginResult[0] === targetElement;
        var t2 = $.contains(self.$bsSelectorPluginResult[0], targetElement);
        var t3 = self.$bsSelectorPluginSelectBtn[0] === targetElement;
        var t4 = self.$bsSelectorPluginSelectList[0] === targetElement;
        var t5 = $.contains(self.$bsSelectorPluginSelectList[0], targetElement);

        if (t1 || t2 || t3 || t4 || t5) {
            return;
        }

        self.$bsSelectorPluginInput.focus();
    });

    var isDeleteValue = false;
    var isDeleteTimer;

    //搜索框相关
    $(self.$bsSelectorPluginInput).on('keyup', function (event) {
        // event.stopPropagation();

        var value = $(this).val().trim();
        var keyCode = event.keyCode;

        if (value === '') {
            isDeleteTimer = setTimeout(function () {
                isDeleteValue = true;
            }, 1500);

            self.renderFilterResult(undefined);
        }
        else {
            clearTimeout(isDeleteTimer);
            isDeleteValue = false;
        }

        //当"Backspace"退格键按下时并且输入框值为空，删除已选项中的最后一项
        if (value === '' && keyCode === 8 && isDeleteValue) {
            // alert('执行删除已选择的选项中最后一项的逻辑');
            self.remove();
            return;
        }

        //当"Enter"回车键按下时并且输入框值不为空，则自动选择可选择项的第一项
        if (!_.isEmpty(self.filterResultArr) && keyCode === 13 && value !== '') {
            self.confirmSelectResult();
        }

        // 当上箭头按下时
        if (!_.isEmpty(self.filterResultArr) && keyCode === 38) {
            self.selectFilterResult(self.currentIndex - 1);
        }

        // 当下箭头按下时
        if (!_.isEmpty(self.filterResultArr) && keyCode === 40) {
            self.selectFilterResult(self.currentIndex + 1);
        }

    });

    $(self.$bsSelectorPluginInput).on('input', function (event) {
        var value = $(this).val().trim();

        if (value === '') {
            if (/\s+/.test($(this).val())) {
                $(this).val('');
            }
            return;
        }

        self.currentIndex = 0;

        self.filterData(value);
    });

    //切换显示隐藏树形选择结构
    $(self.$bsSelectorPluginSelectBtn).on('click', function (event) {
        event.stopPropagation();

        self.$bsSelectorPluginSelectList.toggleClass('show');
        self.$bsSelectorPluginSelectBtn.toggleClass('show');
    });


    //鼠标经过模糊匹配列表时，把当前项选中
    $(self.$selectorPlugin).on('mouseover', '.bsSelectorPlugin-input-list li', function () {
        var index = $(this).index();
        self.selectFilterResult(index);
    });

    $(self.$selectorPlugin).on('click', '.bsSelectorPlugin-input-list li', function (event) {
        event.stopPropagation();

        self.confirmSelectResult();
    });

    //选择已选中项
    $(self.$selectorPlugin).on('click', '.bsSelectorPlugin-option', function (event) {
        event.stopPropagation();
        self.isRemoveFn = true;

        var id = $(this).data('infoid');

        if (event.ctrlKey) {
            if ($(this).hasClass('cur')) {
                $(this).removeClass('cur');
                _.pull(self.removeIdArr, id);
            }
            else {
                $(this).addClass('cur');
                self.removeIdArr.push(id);
            }
        }
        else {
            $(this).addClass('cur').siblings().removeClass('cur');
            self.removeIdArr = [id];
        }
    });

    $(self.$selectorPlugin).on('click', '.del', function (event) {
        event.stopPropagation();
        // alert();
        // console.log($(this).parent().data('infoid'));
        var id = $(this).parent().data('infoid');

        self.removeIdArr = [id];
        self.remove(self.removeIdArr);
    });

    //当选择器失去焦点时
    $(document).on('click', function (event) {
        if (!$.contains(self.$selectorPlugin[0], event.target)) {
            // self.resetStatus();
            self.$bsSelectorPluginInputList.removeClass('show');
            self.$bsSelectorPluginSelectList.removeClass('show');
            self.$bsSelectorPluginSelectBtn.removeClass('show');
            self.$bsSelectorPluginResult.find('.bsSelectorPlugin-option').removeClass('cur');
            self.removeIdArr = [];
            self.isRemoveFn = false;
        }
    });


    $(document).on('keyup', function (event) {
        var keyCode = event.keyCode;

        //当"Backspace"退格键按下时删除选定的项
        if (keyCode === 8 && self.isRemoveFn && !_.isEmpty(self.removeIdArr)) {
            self.remove(self.removeIdArr);
            return;
        }
        //当Esc按下时，隐藏模糊匹配列表
        else if (keyCode === 27) {
            self.$bsSelectorPluginInputList.removeClass('show');
        }
    });


    $(self.$bsSelectorPluginResultCont).mousewheel(function (event, delta, deltaX, deltaY) {
        var width = self.$bsSelectorPluginResultCont.width();
        var scrollWidth = self.$bsSelectorPluginResultCont[0].scrollWidth;
        var scrollLeft = self.$bsSelectorPluginResultCont.scrollLeft();
        var distance = scrollWidth - width;
        var step = 20;
        var move = 0;


        if (delta === -1) {
            move = scrollLeft + step;
        }
        else if (delta === 1) {
            move = scrollLeft - step;
        }

        // if(move >= distance){
        //     move = distance;
        // }
        // else if(move <= 0){
        //     move = 0;
        // }

        self.$bsSelectorPluginResultCont.scrollLeft(move);
    });
};

//呈现树形数据
bsSelectorPlugin.prototype.renderData = function () {
    var self = this;

    var zTreeObj;
    var setting = {
        data: {
            key: {
                name: 'info'
            }
        },
        view: {
            showLine: false,
            showIcon: false
        },
        check: {
            enable: true
        },
        callback: {
            onClick: function (event, treeId, treeNode) {

                if (treeNode.isParent) {
                    self.zTreeObj.expandNode(treeNode, !treeNode.open, true, true);
                }

                console.log(treeNode);


                if (treeNode.isParent) {
                    return;
                }

                // 如果当前项未被选中则选择
                if (!treeNode.checked) {

                    self.zTreeObj.checkNode(treeNode, true, true, false);

                    var arr = _.filter(self.itemDataArr, function (value) {
                        return value.id === treeNode.id;
                    });

                    // console.log(arr);

                    self.selectResultArr = _.concat(self.selectResultArr, arr);
                }
                else {
                    self.zTreeObj.checkNode(treeNode, false, true, false);

                    _.remove(self.selectResultArr, function (value) {
                        return value.id === treeNode.id;
                    });
                }

                self.renderSelectResult();
            },
            onCheck: function () {
                var result = zTreeObj.getCheckedNodes(true);
                var idArr = [];

                //如果有已选项，则取出其id用于渲染已选择项
                if (!_.isEmpty(result)) {
                    _.each(result, function (value) {
                        if (value.isParent || _.has(value, 'children')) {
                            return;
                        }

                        var result = _.find(self.itemDataArr, function (o) {
                            return o.id === value.id;
                        });

                        idArr = _.concat(idArr, result);
                    });


                    self.selectResultArr = idArr;
                }
                else {
                    self.selectResultArr = [];
                }

                self.renderSelectResult();
            }
        }
    };
    var zNodes = self.sourceDataArr;
    var zTreeObj = $.fn.zTree.init(this.$bsSelectorPluginTree, setting, zNodes);

    this.zTreeObj = zTreeObj;
};

// 从源数据数组中提取出单个数据数组
bsSelectorPlugin.prototype.getItemData = function (dataArr) {
    var self = this;

    _.each(self.sourceDataArr, function (value) {
        self.itemDataArr = _.concat(self.itemDataArr, value.children);
    });
};

//过滤数据id
bsSelectorPlugin.prototype.filterData = function (filterValue) {
    var self = this;

    //先过滤出数据的key，方便下面根据key和输入的值筛选数据
    var keyArr = _.keys(self.itemDataArr[0]);

    var filterResultArr = [];

    _.each(self.itemDataArr, function (dataValue) {
        var tmp = _.filter(dataValue, function (o) {
            return _.includes(o, filterValue);
        });

        //如果返回的值不为空数组，则此项是筛选出来的内容
        if (!_.isEmpty(tmp)) {
            filterResultArr = _.concat(filterResultArr, dataValue);
        }
    });


    //已经选中的集合与筛选出的集合求差集，避免重复
    if (!_.isEmpty(this.selectResultArr)) {
        filterResultArr = _.differenceWith(filterResultArr, this.selectResultArr, _.isEqual);
    }

    this.filterResultArr = filterResultArr;

    this.renderFilterResult(filterResultArr);
};

//渲染过滤出的模糊匹配的选择项
bsSelectorPlugin.prototype.renderFilterResult = function (data) {
    this.$bsSelectorPluginInputListUl.empty();

    //如果没有数据则重置或者没有过滤出的数据则隐藏
    if (!data || _.isEmpty(data)) {
        this.$bsSelectorPluginInputList.removeClass('show');
        return;
    }

    //模糊匹配的html结构
    var fuzzyMatchHtml = '';

    _.each(data, function (value) {
        fuzzyMatchHtml += '<li data-infoid="' + value.id + '"><b class="info">' + value.info + '</b></li>'
    });

    var $fuzzyMatchList = $(fuzzyMatchHtml);

    $fuzzyMatchList.eq(0).addClass('cur');

    var position = this.$bsSelectorPluginInput.position();

    var top = position.top;
    var left = position.left;

    this.$bsSelectorPluginInputListUl.append($fuzzyMatchList);

    this.$bsSelectorPluginInputList.css({
        left: top - 30,
        left: left - 8
    });

    this.$bsSelectorPluginInputList.addClass('show');

    this.selectFilterResult(this.currentIndex);
};

// 选择过滤出的结果
bsSelectorPlugin.prototype.selectFilterResult = function (index) {
    if (_.isEmpty(this.filterResultArr)) {
        return;
    }

    var length = this.filterResultArr.length;

    if (index > length - 1) {
        index = 0;
    }
    else if (index < 0) {
        index = length - 1;
    }

    this.currentIndex = index;

    var $li = this.$bsSelectorPluginInputListUl.find('li').eq(index);

    $li.addClass('cur').siblings().removeClass('cur');

    this.currentId = $li.data('infoid');
};

//确认选择结果
bsSelectorPlugin.prototype.confirmSelectResult = function () {
    var self = this;

    self.$bsSelectorPluginInput.focus();

    var result = _.filter(self.itemDataArr, function (value) {
        return value.id === self.currentId;
    });

    self.selectResultArr = _.concat(self.selectResultArr, result);

    this.renderSelectResult();
};

//渲染选择结果
bsSelectorPlugin.prototype.renderSelectResult = function (isTreeRender) {
    var self = this;

    var selectResultHtml = '';
    self.$bsSelectorPluginResult.find('.bsSelectorPlugin-option').remove();
    self.$bsSelectorPluginInputList.removeClass('show');
    self.$bsSelectorPluginInput.val('');

    _.each(self.selectResultArr, function (value) {
        var info = '';

        if (value.driverName) {
            info = value.driverName;
        }
        else if (value.carLicense) {
            info = value.carLicense;
        }
        else if (value.imei) {
            info = value.imei;
        }

        selectResultHtml += '<div data-infoid="' + value.id + '" class="bsSelectorPlugin-option"><b class="info">' + info + '</b><i class="del"></i></div>'
    });

    var $selectResultList = $(selectResultHtml);

    $selectResultList.insertBefore(self.$bsSelectorPluginInput);


    //出现滚动条的情况下调整scrollTop
    // var height = self.$bsSelectorPluginResult.height();
    // var scrollHeight = self.$bsSelectorPluginResult[0].scrollHeight;
    // if (scrollHeight > height) {
    //     self.$bsSelectorPluginResult.scrollTop(scrollHeight - height);
    // }

    // console.log(self.$bsSelectorPluginResult.children());

    var childrenEleArr = self.$bsSelectorPluginResult.children();
    var childrenWidth = 0;
    _.each(childrenEleArr, function (value) {
        childrenWidth += $(value).outerWidth(true);
    });
    self.$bsSelectorPluginResult.css('width', childrenWidth + 1);


    //出现滚动条的情况下调整scrollLeft
    var width = self.$bsSelectorPluginResultCont.width();
    var scrollWidth = self.$bsSelectorPluginResultCont[0].scrollWidth;
    if (scrollWidth > width) {
        self.$bsSelectorPluginResultCont.scrollLeft(scrollWidth - width);
    }


    self.zTreeObj.checkAllNodes(false);
    _.each(self.selectResultArr, function (value) {
        var treeNodeArr = self.zTreeObj.getNodesByParam('id', value.id);

        _.each(treeNodeArr, function (value) {
            if (value.isParent) {
                return;
            }

            self.zTreeObj.checkNode(value, true, true, false);
        });

        // self.zTreeObj.checkNode(treeNode[0], true, true, false);
    });
};

//删除选择结果
bsSelectorPlugin.prototype.remove = function (arg) {
    var self = this;

    //默认删除最后一项
    if (arg === undefined) {
        self.selectResultArr = _.dropRight(self.selectResultArr);
    }

    //根据传入的index删除对应数据
    if (!_.isEmpty(arg)) {
        // _.pullAt(this.selectResultArr, arg);

        _.each(arg, function (keyValue) {

            _.remove(self.selectResultArr, function (value) {

                return value.id === keyValue;
            });
        });
    }

    this.renderSelectResult();
};


//导出选择结果
bsSelectorPlugin.prototype.getInfo = function () {
    return this.selectResultArr;
};

//重置
bsSelectorPlugin.prototype.reset = function () {
    this.selectResultArr = [];

    this.renderSelectResult();
};

//默认选中
bsSelectorPlugin.prototype.setDefaultData = function(dataArr){
    this.selectResultArr = dataArr;

    this.renderSelectResult();
};