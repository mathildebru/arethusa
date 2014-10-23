"use strict";

angular.module('arethusa.core').directive('outputter', [
  '$modal',
  'saver',
  'translator',
  function($modal, saver, translator) {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, element, attrs) {
        scope.saver = saver;
        element.bind('click', function() {
          $modal.open({
            templateUrl: 'templates/arethusa.core/outputter.html',
            windowClass: 'full-modal',
            scope: scope
          });
        });

        translator('saver.previewAndDownload', function(trsl) {
          element.attr('title', trsl)
        });
      },
      template: '<i class="fa fa-download"/>'
    };
  }
]);

angular.module('arethusa.core').directive('outputterItem', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.addClass('item');
        scope.togglePreview = function() { scope.preview = !scope.preview; };
      },
      templateUrl: 'templates/arethusa.core/outputter_item.html',
    };
  }
]);
