var app = angular.module('Lectureapp', ['ui.bootstrap', 'ngSanitize'])

app.controller('wells', ['$scope', function($scope) {
  $scope.decks = [];
  $scope.assertions = [];

  $scope.lc = 0;
  $scope.addlivecode = function(){
		$scope.lc+=1;
  }
}]);

app.factory('Page', function() {
   var title = 'Lecture.js';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});

app.directive('doNotTouch', function() {
  return {
    link: function link(scope, el, attr) {
	    
	},
    restrict: 'E',
    templateUrl:'src/viewport.html' 
  }
})

app.directive('addTitle', function() {
  function link(scope, el, attr) {
    var label = attr.label
    scope.label = attr.label
  }
  return {
    link: link,
    restrict: 'E',
    templateUrl:'src/title.html' 
  }
})

app.directive('sL',  function(){
	return {
		scope: true, // {} = isolate, true = child, false/undefined = no change
		link: function(scope, el, attr) {
			d = {}
			d.height = attr.height || undefined; 
			d.bottom = attr.bottom || undefined;
			d.top = attr.top || undefined;
			d.link = attr.link || undefined;
			d.dv = attr.dv || undefined;
			d.code = attr.code || undefined;
		    d.cite = attr.cite || attr.link;
		    d.cite = attr.dv || attr.link;
		    d.assert = attr.assert;
			scope.decks.push(d)
			scope.$apply;
		}
	};
});

app.directive('addSlide', function($compile, $sce, $timeout) {
  function link(scope, el, attr) {

  	// Set Searchable Assertion 
    scope.assert = attr.assert
    scope.assertions.push(attr.assert);
  	
  	// Set Styles
  	scope.height = attr.height || 400;

  	// Set Content
  	scope.bottom = attr.bottom;
  	scope.top = attr.top;
  	scope.link = $sce.trustAsResourceUrl(attr.link) || undefined; 
  	scope.dv = $sce.trustAsResourceUrl(attr.dv) || undefined; 
  	scope.code = attr.code || undefined; 

  	if (attr.link) scope.view = "img"
  	if (attr.dv) scope.view = "iframe"
  	if (attr.code) scope.view = "code"
  	
    // Set citation
    scope.cite = attr.cite || 'na';

    // Update global scope
    scope.$apply
  }
  return {
    link: link,
    restrict: 'E',
    scope: true, // Returns the current version of the scope 
    templateUrl: function(elem, attrs){
    	return  'src/well.html'
    }
  }
})

app.filter('searchFor', function(){

	// All filters must return a function. The first parameter
	// is the data that is to be filtered, and the second is an
	// argument that may be passed with a colon (searchFor:searchString)

	return function(arr, searchString){

		if(!searchString){
			return arr;
		}

		var result = [];

		searchString = searchString.toLowerCase();

		// Using the forEach helper method to loop through the array
		angular.forEach(arr, function(item){

			if(item.assert.toLowerCase().indexOf(searchString) !== -1){
				result.push(item);
			}

		});

		return result;
	};
});

// Add word emphasis
app.directive('evt', function() {
  function link(scope, el, attr) {
    var label = attr.label
    var bg = attr.bg
    scope.labelstyle = { backgroundColor: bg }
    scope.label = attr.label
  }
  return {
    link: link,
    scope: {},
    restrict: 'E',
    template: function(elem, attr){
        return '<div ng-style="labelstyle">{{label}}</div>'
    }
  }
})

// Add live coding environment
app.directive('liveCode', function($timeout){
	// Runs during compile
	function link(scope, el, attr,controller, transcludeFn) {
		scope.addlivecode()
		scope.mid = "fig"+scope.lc;
		scope.frameid = "win"+scope.lc;
		scope.height = attr.h || 420;
		scope.content= transcludeFn()[0].textContent;
		scope.colwidth = attr.wincol || 4;
    	scope.vert = attr.vert || false;
		var delay;

		$timeout(function () {
			
			document.getElementById(scope.mid).innerHTML = new transcludeFn()[0].textContent;
			var editor = CodeMirror.fromTextArea(document.getElementById(scope.mid), {
				lineNumbers: true,
				mode: 'text/html'
			});

			editor.setSize(el[0].children[0].children[0].children[1].offsetWidth-25,scope.height)

			editor.on("change", function() {
				clearTimeout(delay);
				delay = setTimeout(updatePreview, 300);
			});

			function updatePreview() {
				var previewFrame = document.getElementById(scope.frameid);
				var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
				preview.open();
				preview.write(editor.getValue());
				preview.close();
			}
			setTimeout(updatePreview, 300);		
		})		
	}
	return {
		transclude: true,
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		scope: true,
		templateUrl: function(elem, attrs){
			var scope = angular.element(elem).scope();
			if (attrs.base == undefined){
    			return  '../src/livecode.html'
    		} else{
    			return  'src/livecode.html'
    		}
    	},
		link: link
	};
});





