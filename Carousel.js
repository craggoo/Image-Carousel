var number = [0]
var intervals = []
var message = []
var data = ''
var images = []
var finalImg = []
var carousel = []

function store() {
	repeating('image', number, 'nothing')
}

var interval = function(callback, speed) {
	intervals.push(window.setInterval(callback,speed))
}

function clearing() {
	for (var i=0;i<intervals.length;i++) {
		window.clearInterval(intervals[i])
	}
	intervals.splice(0,intervals.length)
}


function repeating(image, slide, determination) {
	
	var current = document.getElementById(image + slide[0])

	var last = $('#images>img').length -1


	next = document.getElementById(image + (slide[0]+1))

	var anonymous = (function() {
		if (slide == last && determination != 'previous') {
			slide.splice(0,1,0)
			next = document.getElementById(image + slide[0])
		}

		else if (determination == 'previous' && slide[0] != 0) {

			slide.splice(0,1,slide[0]-1)
			next = document.getElementById(image + slide[0])
		}

		else if (determination == 'previous' && slide[0] == 0) {

			slide.splice(0,1,last)
			next =  document.getElementById(image + slide[0])
		}
		
		else{

		slide.splice(0,1, slide[0]+1)
		}
	})()
	
	$(current).fadeOut(1500)	
	$(next).fadeIn(1500)
}

function build(array) {
	var param = /(<A)\s+\w+(=")\w+\.\w+(">)/gi,
		href = /(<a)\s+(href=")/i,
		bit = /(">)/,
		ext = ['jpg'],
		info;
	
	while ( (info = param.exec(array)) != null) {
		images.push(info[0])
	}

	for (var i=0;i<images.length;i++) {
		var temp = images[i]

		for (var j=0;j<ext.length;j++) {
			if (images[i].match(ext[j]) != null) {
				
				var begIdx = images[i].search(href)
				var lastBit = images[i].search(bit)
				var endIdx = href.exec(images[i])

				var first = temp.slice(0, lastBit)
				var second = first.slice(endIdx[0].length, first.length)

				finalImg.push(second)
			}
		}
	}
	
	function dom(element,index,array) {
		carousel.push('<img ' + 'id="image' + index + '" src="' + $('.location').val() + element + '"' + '<img>')
	}

	finalImg.forEach(dom)
	var finished = carousel.join('')
	$('#images').html(finished)
}

function test(array) {
	
	var blah = $.ajax({
		url: $('.location').val(),
		dataType: 'html'
	})

	var done = $.when(blah).then(
		function(jxQHR, textStatus) {
			array.push(textStatus)
			data = jxQHR
		}, 
		function(jxQHR,textStatus,strError) {
			array.push(textStatus)
		})
	return done.promise()
}

$(document).ready(function() {
	$('.generate').click(function() {
	$.when(test(message))
		.done(function() {
			build(data)
			$('.location').val('')
			$('.generate').remove()
		})
		.fail(function() {
			console.log(message)
		})
	})

	$('.start').click(function() {
		$('#images>#image0').fadeIn(300)
		interval(store, 3000)
		$('.start').replaceWith('<button class="pause"> Pause </button>')
	})
	$('#slideshow').on('click', '.pause', function() {
		clearing()
		$('.pause').replaceWith('<button class="resume"> Resume </buttom>')
	})
	$('#slideshow').on('click', '.resume', function() {
		interval(store, 3000)
		$('.resume').replaceWith('<button class="pause"> Pause </button>')
	})
	$('#previous').click(function() {
		clearing()
		repeating('image', number, 'previous')
		if ($('.pause')) {
			$('.pause').replaceWith('<button class="resume"> Resume </button>')
		}
		else {
			$('.resume').replaceWith('<button class="pause"> Pause </button>')
		}
	})
	$('#next').click(function() {
		clearing()
		repeating('image', number)
		if ($('.pause')) {
			$('.pause').replaceWith('<button class="resume"> Resume </button>')
		}
		else {
			$('.resume').replaceWith('<button class="pause"> Pause </button>')
		}
	})
})
