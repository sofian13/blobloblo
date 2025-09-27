(function ($) {
  "use strict";
  var pxl_widget_accordion_handler = function ($scope, $) {
    $scope.find(".pxl-accordion .pxl-accordion__item-title").on("click", function (e) {
      e.preventDefault();

      var $this = $(this);
      var targetSelector = $this.data("target");
      var $target = $(targetSelector);

      var $accordion = $this.closest(".pxl-accordion");
      var $allTitles = $accordion.find(".pxl-accordion__item-title");

      $allTitles.each(function () {
        var $item = $(this);
        var otherTargetSelector = $item.data("target");
        var $otherTarget = $(otherTargetSelector);

        if (otherTargetSelector !== targetSelector) {
          $item.removeClass("active").parent().removeClass("active");
          $otherTarget.stop(true, true).slideUp(400);
        }
      });

      var isActive = $this.parent().hasClass("active");

      if (!isActive) {
        $this.addClass("active").parent().addClass("active");
        $target.stop(true, true).slideDown(400, function () {
          $target.css("height", "");
        });
      } else {
        $this.removeClass("active").parent().removeClass("active");
        $target.stop(true, true).slideUp(400);
      }
    });
  };

  $(window).on("elementor/frontend/init", function () {
    elementorFrontend.hooks.addAction(
      "frontend/element_ready/pxl_accordion.default",
      pxl_widget_accordion_handler
    );
  });
})(jQuery);
