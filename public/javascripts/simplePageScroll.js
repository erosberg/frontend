! function($) {
    var defaults = {
        slideTagName: ".slide",
        slideContainer: "#slideContainer",
        animationTime: 1000,
        quietPeriod: 500,
        keyboard: true,
        loop: false
    };

    $.fn.simplePageScroll = function(options) {
        if (options.slideTagName && options.slideTagName.charAt(0) !== ".") {
            options.slideTagName = "." + options.slideTagName;
        }
        if (options.slideContainer && options.slideContainer.charAt(0) !== ".") {
            options.slideContainer = "#" + options.slideContainer;
        }
        var settings = $.extend({}, defaults, options),
            slides = $(settings.slideTagName)
        maxSlide = slides.length - 1,
            slideIndex = 0,
            slideContainer = $("#slideContainer");
        console.log(maxSlide);
        /*page selector events*/
        if (settings.pageSelectorID) {
            if (settings.pageSelectorID.charAt(0) !== "#") {
                settings.pageSelectorID = "#" + settings.pageSelectorID;
            }
            var hasPageSelector = true,
                pageSelectors = $(settings.pageSelectorID + " li")
            if (pageSelectors.length !== (maxSlide + 1)) {
                console.log(pageSelectors.length);
                console.log("page selector size different with slide numbers")
            }
            pageSelectors.each(function(index) {
                $(this).click(function() {
                    slideIndex = index;
                    scroller();
                });
            });
        }
        /*mouse wheel scroll event*/
        slideContainer.one("mousewheel", mouseMove);

        function mouseMove(event) {
            changePage(event);
            setTimeout(function() {
                slideContainer.one("mousewheel", mouseMove)
            }, settings.quietPeriod);
        };

        /*key event*/
        if (settings.keyboard) {
            $(document).one("keydown", keyAction);

            function keyAction(event) {
                var e = event || window.event;
                var key = e.keyCode || e.which || e.charCode;
                switch (key) {
                    case 37:
                    case 38:
                        e.deltaY = 1;
                        changePage(e);
                        break;
                    case 39:
                    case 40:
                        e.deltaY = -1;
                        changePage(e);
                        break;
                    default:
                        break;
                };
                setTimeout(function() {
                    $(document).one("keydown", keyAction)
                }, settings.quietPeriod)
            }
        }


        function changePage(event) {
                if (event.deltaY < 0) {
                    if (slideIndex === maxSlide) {
                        if (settings.loop) {
                            slideIndex = 0;
                            scroller();
                        }
                    } else {
                        slideIndex = slideIndex + 1;
                        scroller();
                    }
                } else {
                    if (slideIndex === 0) {
                        if (settings.loop) {
                            slideIndex = maxSlide;
                            scroller();
                        }
                    } else {
                        slideIndex = slideIndex - 1;
                        scroller();
                    }
                }
            }
            /*go to the right page*/
        function scroller() {
            //pageSelector.children("li").eq(slideIndex).addClass("cur").siblings().removeClass("cur");
            slideContainer.css({
                "transition": "transform " + settings.animationTime,
                "transform": "translateY(-" + (slideIndex * 100) + "%)"
            });
            // invoke animation in the target function
            var targetSlide = $(slides[slideIndex]);
            if (targetSlide.attr("data-slideanimation")) {
                var functionName = targetSlide.attr("data-slideanimation"),
                    fn = window[functionName];
                if (typeof fn === 'function') {
                    fn.call(targetSlide);
                }
            }
        };
    }

}(window.jQuery);
