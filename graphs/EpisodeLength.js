var rssAPIcall = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.hellointernet.fm%2Fpodcast%3Fformat%3Drss&api_key=ziatazw6kwobgfc4qezuxezsm61nwuxy57zwlgks&order_by=pubDate&order_dir=asc&count=200"
var table,tableReady
var xMax,xRes,yMax,yRes
var regressor

$(document).mousemove(function(e){
    $("#Caption").css({left:e.pageX+2, top:e.pageY-20});
});

function setup(){
	var w = $("#content-wrapper").width()
	var cnv = createCanvas(w,w*9/16)
	cnv.parent("content-wrapper")
	tableReady = false
	makeTable(rssAPIcall)
}

function draw(){
	background(51)
	if (tableReady){
		xMax = table.titles.length
		yMax = 200
		stroke(200)
		strokeWeight(5)
		var minDist = 16
		var currentMin = null
		for (var i = 0; i <= xMax; i++){
			if(table.durations[i] != NaN){
				var x = width*i/xMax
				var y =  height*(1-table.durations[i]/yMax)
				point(x,y)
				var d = dist(x,y,mouseX,mouseY)
				if (d < minDist){
					minDist = d
					currentMin = i
				}
			}
		}
		if (currentMin != null){
			strokeWeight(8)
			stroke(255)
			point(width*currentMin/xMax,height*(1-table.durations[currentMin]/yMax))
			showToolTip(table.titles[currentMin])
		} else {
			hideToolTip()
		}
		if (regressor != null){
			stroke(128)
			strokeWeight(1)
			noFill()
			beginShape()
			for (var i = 0; i <= width; i++){
				var x = i*xMax/width
				vertex(i,height-(regressor.f(x)*height/yMax))
			}
			endShape(OPEN)
			regressor.improve(100)
		}
	}
}

function makeTable(url){
	table = {
		titles: [],
		durations: []
	}
	$("#content-wrapper").append("<table id='dataTable'></table>")
	$.get(url, function(data){
		for (var i in data.items){
			table.titles.push(data.items[i].title)
			table.durations.push(data.items[i].enclosure.duration/60)
		}
		makeRegressor()
		tableReady = true
	})
}

function makeRegressor(){
	var xVals = []
	for (var i = 0; i < table.titles.length; i++){
		xVals.push(i+1)
	}
	regressor = new Regressor(xVals,table.durations,0.000001)
}


function showToolTip(text){
	$('#Caption').html(text)
				 //.css({'top':mouseY,'left':mouseX})
				 .fadeIn('slow');
}
function hideToolTip(){
	$('#Caption').hide();
}