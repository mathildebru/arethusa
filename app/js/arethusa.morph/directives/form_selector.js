'use strict';
angular.module('arethusa.morph').directive('formSelector', function () {
  return {
    restrict: 'AE',
    replace: true,
    controller: [
      '$scope',
      '$element',
      '$attrs',
      function ($scope, $element, $attrs) {
        var id = $scope.id;
        var form = $scope.form;
        $scope.selected = function () {
          return $scope.plugin.isFormSelected(id, form);
        };
        $scope.text = function () {
          return $scope.selected() ? 'Deselect' : 'Select';
        };
        $scope.action = function (event) {
          event.stopPropagation();
          if ($scope.selected()) {
            $scope.plugin.unsetState(id);
          } else {
            $scope.plugin.setState(id, form);
          }
        };
      }
    ],
    template: '<span class="button micro radius"' + 'ng-click="action($event)"' + 'ng-class="{success: selected()}">' + '{{ text() }}' + '</span>'
  };
});
