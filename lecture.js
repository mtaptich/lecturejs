var app = angular.module('Lectureapp', ['ui.bootstrap', 'ngSanitize'])

app.controller('wells', ['$scope', '$window', function($scope, $window) {
  angular.element($window).on('resize', function(){ $scope.$apply()});
  $scope.decks = [];
  $scope.assertions = [];

  $scope.lc = 0;
  $scope.addlivecode = function(){
		$scope.lc+=1;
  }


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
	return {
		scope: true, // {} = isolate, true = child, false/undefined = no change
		link: function(scope, el, attr) {
			d = {}
			d.height = attr.height || undefined; 
			d.bottom = attr.bottom || undefined;
			d.top = attr.top || undefined;
			d.link = attr.link || undefined;
			d.dv = attr.dv || undefined;
			d.video = attr.video || undefined;
			d.code = attr.code || undefined;
		    d.cite = attr.cite || attr.link;
		    d.cite = attr.dv || attr.link;
		    d.cite = attr.video || attr.link;
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

    //console.log(scope.assertions)
  	
  	// Set Styles
  	scope.height = attr.height || 400;

  	// Set Content
  	scope.bottom = attr.bottom;
  	scope.top = attr.top;
  	scope.link = $sce.trustAsResourceUrl(attr.link) || undefined; 
  	scope.dv = $sce.trustAsResourceUrl(attr.dv) || undefined;
  	scope.video = $sce.trustAsResourceUrl(attr.video.replace("watch?v=", "v/")+"&output=embed") || undefined;  
  	scope.code = attr.code || undefined; 

  	if (attr.link) scope.view = "img"
  	if (attr.dv) scope.view = "iframe"
  	if (attr.code) scope.view = "code"
  	if (attr.video) scope.view = "video"
  	
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

// Three small bars
app.directive('barChartSm', function($compile, $sce) {
	return {
	  restrict: 'E',
	  replace: true,
	  scope: {
	    dataset: '='
	  },
	  template: '<svg ng-attr-height="{{graph.height}}" ng-attr-width="{{graph.width}}"><rect ng-repeat="data in dataset track by $index" ng-attr-width="{{width()}}" ng-attr-height="{{height(data)}}" ng-attr-x="{{x($index)}}" ng-attr-y="{{graph.height - height(data)}}" fill="{{color}}"></rect><text ng-repeat="data in dataset track by $index" ng-attr-width="{{width()}}" ng-attr-height="{{height(data)}}" ng-attr-x="{{width()}}" ng-attr-y="{{graph.height - height(data)}}" fill="#000" dy="1em" style="font-size: 18px">{{the_text}}</text></svg>',
	  link: function(scope, element, attrs) {
	    var padding = 40;
	    var val = Math.abs(attrs.val) || 1;
	    scope.graph = {
	      width: 140,
	      height: 24
	    }

	    scope.color = attrs.color;

	    var scale = d3.scale.linear()
	        .domain([attrs.min,attrs.max])
	        .range([0, scope.graph.width-padding]);

	    scope.dataset = [val];

	    scope.width = function() {
	      scope.color = attrs.color;
	      scope.the_text = Math.round(attrs.val);
	      return scale(Math.abs(attrs.val));
	    }

	    scope.height = function(data) {
	      
	      var max = Math.max.apply(null, scope.dataset);
	      return data / max * scope.graph.height;
	    }

	    scope.x = function(index) {
	      return index * padding + index * scope.width()
	    }
	  }
	}
});

app.directive('lineChartSm', function($timeout){
    
    var uniqueId = 1;
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: true, // {} = isolate, true = child, false/undefined = no change
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      template: '<svg ng-attr-height="{{graph.height}}" ng-attr-width="{{graph.width}}" id="{{uniqueId }}"></svg>',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, attrs, controller) {
        var padding = 40, fontsize = 16;
        $scope.graph = {
          width: 150,
          height: 60
        }

        $scope.data = JSON.parse(attrs.data);
        $scope.uniqueId = "lgsm"+uniqueId++;

        var color = attrs.color || "#777777";

        var x = d3.time.scale()
            .range([0+padding, $scope.graph.width-padding])
            .domain([0,3])

        var y = d3.scale.linear()
            .range([$scope.graph.height-5, fontsize+5])
            .domain(d3.extent($scope.data, function(d) { return d; }));

        var line = d3.svg.line()
            .x(function(d,i) { return x(i); })
            .y(function(d) { return y(d); });

        $timeout(function(){
          chart = d3.select('#'+$scope.uniqueId )
          
          chart.append("path")
                .datum($scope.data)
                .attr("class", "line")
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", "2px")

          chart.selectAll("circle").data($scope.data).enter().append("circle")
                .attr('r',4)
                .attr('cx', function(d,i){ return x(i)})
                .attr('cy', function(d){ return y(d)})
                .style("fill", d3.rgb(color).darker(-0.7))

          chart.selectAll("text").data($scope.data).enter().append("text")
                .attr('x', function(d,i){ return x(i)})
                .attr('y', function(d){ return y(d)})
                .attr('dy', function(d, i){ if(i==1){return "-0.5em"}else{return "0"}})
                .attr('dx', function(d, i){ if(i==0 && d>1){return "-1em"} else if(i==0 && d>0){return "-1.2em"} else if(i==0){return "-1.4em"} else if(i==2 && d>1){return "1em"} else if(i==2 && d>0){return "1.2em"}  else if(i==2){return "1em"}else{return "0.25em"}})
                .text(function(d){ 
                  if(d<1 && d>-1){return Math.round(d*100)/100}
                  else if (d<10){ return Math.round(d*10)/10}
                  else{ return Math.round(d)}})
                .style("text-anchor", "middle")
                .style('font-size', fontsize)

        })   
      }
    };
});






