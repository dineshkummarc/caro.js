/* MIT (c) Juho Vepsalainen */
(function($){
  function horizontalCaro($elem, opts) {
    caroize($elem, opts, 'left', 'width');
  }

  function verticalCaro($elem, opts) {
    caroize($elem, opts, 'top', 'height');
  }

  function caroize($elem, opts, dir, axis) {
    var $slideContainer = $elem.find('.slides');
    var $slides = $slideContainer.children().append($('<div>'));
    var $wrapper = $('<div>').append($slides).appendTo($slideContainer);
    var $navi = $elem.find('.navi');
    var amount = $slides.length;

    initCSS($slideContainer, axis, $wrapper, dir, $slides);
    initTitles($slides, $navi, moveTemplate);
    initNavi($elem, moveTemplate);
    updateNavi(0, $navi);

    function moveTemplate(cb) {
      return function() {
        var oldI = -parseInt($wrapper.css(dir)) / 100;
        var i = cb(oldI, amount - 1);
        var pos = Math.min(Math.max(i, 0), amount - 1);
        var animProps = {};

        animProps[dir] = (pos * -100) + '%';
        $wrapper.animate(animProps, opts.delay);

        updateNavi(pos, $navi);
      }
    }
  }

  function initCSS($slideContainer, axis, $wrapper, dir, $slides) {
    var wrapperOpts;
    var slideOpts;
    var displayMode;

    $slideContainer.css('overflow', 'hidden');
    wrapperOpts = {
      position: 'relative'
    };
    wrapperOpts[axis] = $slides.length * 100 + '%';
    wrapperOpts[dir] = 0 + '%';
    $wrapper.css(wrapperOpts);

    displayMode = dir == 'top'? 'auto': 'inline-block';
    slideOpts = {
      display: displayMode,
      'vertical-align': 'top'
    };
    slideOpts[axis] = (100 / $slides.length) + '%';
    $slides.each(function(i, e) {$(e).css(slideOpts);});  
  }

  function initTitles($slides, $navi, move) {
    $slides.each(function(i, k) {
      var title = $(k).attr('title') || i + 1;

      $('<div>').css('display', 'inline').text(title).bind('click',
        move(function() {return i;})).appendTo($navi).addClass('title button');
    });
  }

  function initNavi($elem, move) {
    function bind(sel, cb) {$elem.find(sel).bind('click', move(cb));}

    bind('.prev', function(a) {return a - 1;});
    bind('.next', function(a) {return a + 1;});
    bind('.first', function() {return 0;});
    bind('.last', function(a, len) {return len;});
  }

  function updateNavi(i, $navi) {
    var $titles = $navi.find('.title.button');

    $titles.removeClass('selected');
    $titles.eq(i).addClass('selected');
  }

  $.fn.caro = function (options) {
    return this.each(function () {
      var $elem = $(this);
      var opts = $.extend({
        dir: 'horizontal', // either 'horizontal' or 'vertical'
        delay: 300 // in ms
      }, options);

      var caro = opts.dir == 'horizontal'? horizontalCaro: verticalCaro;
      caro($elem, opts);
    });
  };
})(jQuery);

