var rssAPIcall = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.hellointernet.fm%2Fpodcast%3Fformat%3Drss&api_key=ziatazw6kwobgfc4qezuxezsm61nwuxy57zwlgks&order_by=pubDate&order_dir=asc&count=200"
var table,tableReady
var xMax,xRes,yMax,yRes
var regressor,regressed
var currentMin = null

$(document).mousemove(function(e){
    $("#Caption").css({left:e.pageX+2, top:e.pageY-20});
});

function setup(){
	var w = $("#content-wrapper").width()
	var cnv = createCanvas(w,w*9/16)
	cnv.parent("content-wrapper")
	$('#content-wrapper').append("<div id='descriptionBox'>Click a point to see more info</div>")
	tableReady = false
	makeTable(rssAPIcall)
}

function draw(){
	background(51)
	if (tableReady){
		xMax = table.titles.length
		yMax = 200
		textAlign(RIGHT)
		var hours = [height-60*height/yMax,height-120*height/yMax,height-180*height/yMax]
		for (var i in hours){
			stroke(128)
			strokeWeight(1)
			line(0,hours[i],width,hours[i])
			noStroke()
			fill(128)
			text(int(i)+1 + " hours",width,hours[i])
		}
		text
		stroke(200)
		strokeWeight(5)
		var minDist = 16
		currentMin = null
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
			showToolTip(table.titles[currentMin] + " - " + nfc(table.durations[currentMin],0) + "mins")
		} else {
			hideToolTip()
		}
		if (regressor != null){
			stroke(255)
			strokeWeight(2)
			noFill()
			beginShape()
			for (var i = 0; i <= width; i++){
				var x = i*xMax/width
				vertex(i,height-(regressor.f(x)*height/yMax))
			}
			endShape(OPEN)
			if (!regressed){regressor.improve(100)}
		}
	}
}

function makeTable(url){
	table = {
		titles: [],
		durations: [],
		descriptions: [],
		dates: []
	}
	$("#content-wrapper").append("<table id='dataTable'></table>")
	$.get(url, function(data){
		console.log(data)
		for (var i in data.items){
			table.titles.push(data.items[i].title)
			table.durations.push(data.items[i].enclosure.duration/60)
			table.descriptions.push(data.items[i].content)
			table.dates.push(data.items[i].pubDate)
		}
		makeRegressor()
		tableReady = true
		$("#loader").hide()
		$("canvas").show()
	})
}

function makeRegressor(){
	var xVals = []
	for (var i = 0; i < table.titles.length; i++){
		xVals.push(i+1)
	}
	regressor = new Regressor(xVals,table.durations,0.000001)
	regressed = false
}


function showToolTip(text){
	$('#Caption').html(text)
				 //.css({'top':mouseY,'left':mouseX})
				 .fadeIn('slow');
}
function hideToolTip(){
	$('#Caption').hide();
}

function mousePressed(){
	if (currentMin != null){
		$('#descriptionBox').html("")
		$('#descriptionBox').append("<h2>"+table.titles[currentMin]+"</h2>")
							.append("<h3>"+table.dates[currentMin]+"</h3>")
							.append(table.descriptions[currentMin])
		$('#descriptionBox *').slice(3).remove()
	}
}