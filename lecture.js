var app = angular.module('Lectureapp', ['ui.bootstrap'])

app.controller('wells', ['$scope', function($scope) {
  $scope.decks = [];
  $scope.assertions = [];

}]);

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
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: true, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, el, attr) {
			d = {}
			if (attr.height !=undefined){
		  		d.height = attr.height;
		  	} 

		  	// Set Content
		    if(attr.website != undefined){
		    	d.site = attr.website;
		    	d.cite = attr.website; 
		    }

		    // Set Citation
		    if (attr.cite != undefined){
		    	d.cite = attr.cite;
		    } 

		    d.assert = attr.assert
			scope.decks.push(d)
			scope.$apply;
		}
	};
});


app.directive('addSlide', function($compile, $sce) {
  function link(scope, el, attr) {
    scope.assert = attr.assert
    scope.assertions.push(attr.assert)
  	
  	// Set Slide Attributes
  	if (attr.height !=undefined){
  		scope.height = attr.height;
  	} else{
  		scope.height = 500;
  	}

  	// Set Content
  	scope.plop ="nothing";
    if(attr.website != undefined){
    	scope.plop= 'iframe'
    	scope.site = $sce.trustAsResourceUrl(attr.website); 
    }

    // Set citation
    if (attr.cite != undefined){
    	scope.cite = attr.cite;
    }else{
    	scope.cite = "";
    }

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




