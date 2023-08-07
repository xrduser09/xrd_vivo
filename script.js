;(function($) {

  // Function to handle file upload
  function handleFileUpload(fileInput) {
    const files = fileInput[0].files;
    // Here, you can perform actions with the selected files, such as uploading them to a server or displaying their names in the UI.
    // For demonstration purposes, let's display the selected file names in an element with the class 'file-names'.
    const $fileNamesElement = $('.file-names');
    $fileNamesElement.empty(); // Clear previous file names
    for (let i = 0; i < files.length; i++) {
      $fileNamesElement.append('<p>' + files[i].name + '</p>');
    }
  }

  // Function to handle the animation
  function playChartAnimation() {
    $('.bars li .bar').each(function (key, bar) {
      let percentage = $(this).data('percentage');
      $(this).animate({
        'height': percentage + '%'
      }, 1000);
      console.log(percentage);
    });
  }

  // Intersection Observer callback function
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playChartAnimation();
        observer.unobserve(entry.target); // Stop observing once the chart is visible
      }
    });
  }

  // Intersection Observer options
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Percentage of visibility required to trigger the callback
  };

  // Create the Intersection Observer instance
  const chartObserver = new IntersectionObserver(handleIntersection, options);

  $.fn.customFile = function() {
    return this.each(function() {
      var $file = $(this).addClass('custom-file-upload-hidden'),
          $wrap = $('<div class="file-upload-wrapper">'),
          $input = $('<input type="text" class="file-upload-input" />'),
          $button = $('<button type="button" class="file-upload-button">Upload</button>'),
          $label = $('<label class="file-upload-button" for="'+ $file[0].id +'">Select a File</label>');

      $file.css({
        position: 'absolute',
        left: '-9999px'
      });

      $wrap.insertAfter( $file )
        .append( $file, $input, $button );

      $file.attr('tabIndex', -1);
      $button.attr('tabIndex', -1);

      $button.click(function () {
        $file.focus().click();
        
      });

      $file.change(function() {
        $input.val(this.value); // Set the value (filename) in the input text field
        $input.attr('title', this.value); // Show filename in the title tooltip
        $input.focus(); // Regain focus
        handleFileUpload($file); // Call the handleFileUpload function to process the selected files
      });

      $input.on({
        blur: function() { $file.trigger('blur'); },
        keydown: function( e ) {
          if ( e.which === 13 ) { // Enter
            $file.trigger('click');
          } else if ( e.which === 8 || e.which === 46 ) { // Backspace & Del
            // On some browsers the value is read-only
            // with this trick we remove the old input and add
            // a clean clone with all the original events attached
            $file.replaceWith( $file = $file.clone( true ) );
            $file.trigger('change');
            $input.val('');
          } else if ( e.which === 9 ) { // TAB
            return;
          } else { // All other keys
            return false;
          }
        }
      });

      chartObserver.observe(document.getElementById('myChart')); // Observe the chart container
    });
  };

  $( document ).on('change', 'input.customfile', function() {
    var $this = $(this),
      uniqId = 'customfile_'+ (new Date()).getTime(),
      $wrap = $this.parent(),
      $inputs = $wrap.siblings().find('.file-upload-input')
        .filter(function() { return !this.value }),
      $file = $('<input type="file" id="'+ uniqId +'" name="'+ $this.attr('name') +'"/>');

    setTimeout(function() {
      if ($this.val()) {
        if (!$inputs.length) {
          $wrap.after($file);
          $file.customFile();
        }
      } else {
        $inputs.parent().remove();
        $wrap.appendTo($wrap.parent());
        $wrap.find('input').focus();
      }
    }, 1);
  });

  $('input[type=file]').customFile();

})(jQuery);








// Round Chart JS
document.addEventListener("DOMContentLoaded", function() {

  var vivoPercentage = 50;      // Example value, replace with actual value
  var oppoPercentage = 65;      // Example value, replace with actual value
  var samsungPercentage = 35;   // Example value, replace with actual value
  var xiaomiPercentage = 60;    // Example value, replace with actual value

  var circleProgress = (function(selector) {
    var wrapper = document.querySelectorAll(selector);
    Array.prototype.forEach.call(wrapper, function(wrapper, i) {
      var wrapperWidth,
        wrapperHeight,
        percent,
        innerHTML,
        context,
        lineWidth,
        centerX,
        centerY,
        radius,
        newPercent,
        speed,
        from,
        to,
        duration,
        start,
        strokeStyle,
        text;

      var getValues = function() {
        wrapperWidth = parseInt(window.getComputedStyle(wrapper).width);
        wrapperHeight = wrapperWidth;
        percent = parseInt(wrapper.getAttribute('data-cp-percentage')) || 0;
        innerHTML = '<span class="percentage"><strong>' + percent + '</strong> %</span><canvas class="circleProgressCanvas" width="' + (wrapperWidth * 2) + '" height="' + wrapperHeight * 2 + '"></canvas>';
        wrapper.innerHTML = innerHTML;
        text = wrapper.querySelector(".percentage");
        canvas = wrapper.querySelector(".circleProgressCanvas");
        wrapper.style.height = canvas.style.width = canvas.style.height = wrapperWidth + "px";
        context = canvas.getContext('2d');
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        newPercent = 0;
        speed = 1;
        from = 0;
        to = percent;
        duration = 1000;
        lineWidth = 25;
        radius = canvas.width / 2 - lineWidth;
        strokeStyle = wrapper.getAttribute('data-cp-color');
        start = new Date().getTime();
      };

      function animate() {
        requestAnimationFrame(animate);
        var time = new Date().getTime() - start;
        if (time <= duration) {
          var x = easeInOutQuart(time, from, to - from, duration);
          newPercent = x;
          text.innerHTML = Math.round(newPercent) + " %";
          drawArc();
        }
      }

      function drawArc() {
        var circleStart = 1.5 * Math.PI;
        var circleEnd = circleStart + (newPercent / 50) * Math.PI;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(centerX, centerY, radius, circleStart, 4 * Math.PI, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = "#ddd";
        context.stroke();
        context.beginPath();
        context.arc(centerX, centerY, radius, circleStart, circleEnd, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.stroke();
      }

      var update = function() {
        getValues();
        var counters = document.querySelectorAll(".counter");
counters[0].setAttribute("data-cp-percentage", vivoPercentage);
counters[1].setAttribute("data-cp-percentage", oppoPercentage);
counters[2].setAttribute("data-cp-percentage", samsungPercentage);
counters[3].setAttribute("data-cp-percentage", xiaomiPercentage);
        animate();
      };
      update();

      var resizeTimer;
      window.addEventListener("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          clearTimeout(resizeTimer);
          start = new Date().getTime();
          update();
        }, 250);
      });
    });

    function easeInOutQuart(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }

  });

  circleProgress('.counter');
});