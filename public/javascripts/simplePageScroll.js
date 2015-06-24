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
            slides = $(settings.slideTagName),
            maxSlide = slides.length - 1,
            slideIndex = 0,
            slideContainer = $("#slideContainer");
        /*page selector events*/
        if (settings.pageSelectorID) {
            if (settings.pageSelectorID.charAt(0) !== "#") {
                settings.pageSelectorID = "#" + settings.pageSelectorID;
            }
            var hasPageSelector = true,
                pageSelectors = $(settings.pageSelectorID + " li")
            if (pageSelectors.length !== (maxSlide + 1)) {
                console.log("page selector size different with slide numbers")
            }
            pageSelectors.each(function(index) {
                $(this).click(function() {
                    slideIndex = index;
                    scroller();
                });
            });
        }
        scroller(); //invoke default page animations

        /*mouse wheel scroll event*/
        slideContainer.one("mouseScroll", mouseMove);
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel" //FF doesn't recognize mousewheel as of FF3.x
        if (document.attachEvent) {
            document.attachEvent("on" + mousewheelevt, handleScroll)
        } else if (document.addEventListener) {
            document.addEventListener(mousewheelevt, handleScroll, false)
        }

        function handleScroll(event) {
            var e = event || window.event;

            if (e.wheelDelta) {
                slideContainer.trigger("mouseScroll", [(e.wheelDelta < 0)]);
            } else {
                slideContainer.trigger("mouseScroll", [(e.detail > 0)]);
            }

        };

        function mouseMove(e, pageUp) {
            changePage(pageUp);
            setTimeout(function() {
                slideContainer.one("mouseScroll", mouseMove);
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
                        changePage(false);
                        break;
                    case 39:
                    case 40:
                        changePage(true);
                        break;
                    default:
                        break;
                };
                setTimeout(function() {
                    $(document).one("keydown", keyAction)
                }, settings.quietPeriod)
            }
        }

        /* touch screen swipe*/
        function swipedetect(el, callback) {

            var touchsurface = el,
                swipedir,
                startX,
                startY,
                distX,
                distY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 300, // maximum time allowed to travel that distance
                elapsedTime,
                startTime,
                handleswipe = callback || function(swipedir) {}

            touchsurface.addEventListener('touchstart', function(e) {
                var touchobj = e.changedTouches[0]
                swipedir = 'none'
                dist = 0
                startX = touchobj.pageX
                startY = touchobj.pageY
                startTime = new Date().getTime() // record time when finger first makes contact with surface
                e.preventDefault()
            }, false)

            touchsurface.addEventListener('touchmove', function(e) {
                e.preventDefault() // prevent scrolling when inside DIV
            }, false)

            touchsurface.addEventListener('touchend', function(e) {
                var touchobj = e.changedTouches[0]
                distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
                distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
                elapsedTime = new Date().getTime() - startTime // get time elapsed
                if (elapsedTime <= allowedTime) { // first condition for awipe met
                    if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                        swipedir = (distX < 0) ? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                    } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                        swipedir = (distY < 0) ? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                    }
                }
                handleswipe(swipedir)
                e.preventDefault()
            }, false)
        }
        swipedetect(slideContainer, function(swipedir) {
            //swipedir contains either "none", "left", "right", "top", or "down"
            if (swipedir == 'top') {
                changePage(true);
            }

        })

        function changePage(pageUp) {
            if (pageUp) {
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
        };
        //go to the right page
        function scroller() {
            //pageSelector.children("li").eq(slideIndex).addClass("cur").siblings().removeClass("cur");
            var targetSlide = $(slides[slideIndex]);
            if (settings.doBeforeEach) {
                var functionName = settings.doBeforeEach,
                    fn = window[functionName];
                if (typeof fn === 'function') {
                    fn.call(targetSlide);
                }
            }
            if (targetSlide.attr("data-beforeshow")) {
                var functionName = targetSlide.attr("data-beforeshow"),
                    fn = window[functionName];
                if (typeof fn === 'function') {
                    fn.call(targetSlide);
                }
            }
            slideContainer.css({
                "-webkit-transition": "1s ease-in-out",
                "-moz-transition": "1s ease-in-out",
                "-o-transition": "1s ease-in-out",
                "-ms-transition": "1s ease-in-out",
                "transition": "1s ease-in-out",
                "transform": "translate3d(0,-" + (slideIndex * 100) + "%,0)",
                "-webkit-transform": "translate3d(0,-" + (slideIndex * 100) + "%,0)",
                "-ms-transform": "translate3d(0,-" + (slideIndex * 100) + "%,0)",
                "-o-transform": "translate3d(0,-" + (slideIndex * 100) + "%,0)",
                "-moz-transform": "translate3d(0,-" + (slideIndex * 100) + "%,0)"
            });
            if (hasPageSelector) {
                $(settings.pageSelectorID + " li:nth-child(" + (slideIndex + 1) + ") a").addClass('active');
                $(settings.pageSelectorID + " li:nth-child(" + (slideIndex + 1) + ")").siblings().children("a").removeClass('active');
            }
            // invoke animation in the target function
            if (targetSlide.attr("data-aftershow")) {
                var functionName = targetSlide.attr("data-aftershow"),
                    fn = window[functionName];
                if (typeof fn === 'function') {
                    fn.call(targetSlide);
                }
            }
            if (settings.doAfterEach) {
                var functionName = settings.doAfterEach,
                    fn = window[functionName];
                if (typeof fn === 'function') {
                    fn.call(targetSlide);
                }
            }

        };
    }

}(window.jQuery);
