lecturejs
=========

<em>An interactive way to give lectures, presentations, or class handouts. </em>

<p>Lecturejs was developed to support the <a href="http://writing.engr.psu.edu/slides.html">assertion-evidence approach</a> to teaching STEM material. Each slide consists of an assertion (ex. "The number 8 is not a prime number.") and visual evidence to support this position (ex., "<em>8 balls spit equally into two groups.</em>"). Lecturejs allows lecturers to use images, data visualization, YouTube videos, and live code as evidence for assertions. </p>

<p>A lecturejs template looks like this:</p>

<pre><code><textarea><html ng-app="Lectureapp" ng-controller="wells">
  <head>
    <!-- Add the title of your lecture here -->
  	<add-title label="Title of Presentation"></add-title>
  <body>

  	<!-- Add your slides using the <s-l></s-l> tag -->
	<s-l 
		assert="<a href='http://mtaptich.github.io/d3-lessons/'>A general goal</a> of this course is to orient you to some macro-level impacts on the environment caused by civil systems."
		link="http://ce11gsi.appspot.com/stylesheets/img/height.png"
    bottom="This requires you to build an understanding of scale."
    cite="http://xkcd.com/482/"
	></s-l>
  </body>
<html></textarea></code></pre>

<p> This slide becomes:</p>
<p><img src="https://raw.githubusercontent.com/mtaptich/lecturejs/master/img/slideexample.png" style="max-width:100%;"></p>

