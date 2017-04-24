var rssAPIcall = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fwww.hellointernet.fm%2Fpodcast%3Fformat%3Drss&api_key=ziatazw6kwobgfc4qezuxezsm61nwuxy57zwlgks&order_by=pubDate&order_dir=asc&count=200"
var table,tableReady
var xMax,xRes,yMax,yRes
var times

$(document).mousemove(function(e){
	$("#Caption").css({left:e.pageX+2, top:e.pageY-20});
});

function setup(){
	var w = $("#content-wrapper").width()
	var cnv = createCanvas(w,w*9/16)
	cnv.parent("content-wrapper")
	//$('#content-wrapper').append("<div id='descriptionBox'>Click a point to see more info</div>")
	tableReady = false
	makeTable(rssAPIcall)
	colorMode(HSB,120)
}

function draw(){
	background(0,0,100)
	if (tableReady){
		translate(0,20)
		var angle = TWO_PI/times.length
		noStroke()
		for(var i in times){
			fill(times[i],100,100)
			arc(100+height/2,height/2,height-60,height-60,int(i)*angle,(int(i)+1)*angle,PIE)
		}
		strokeWeight((height-100)/100+1)
		for(var i = 0; i < 100; i++){
			stroke(i,100,100)
			var yPos = 50+(height-100)*i/100
			line(20,yPos,50,yPos)
		}
		textAlign(LEFT,CENTER)
		noStroke()
		fill(0)
		for(var i = 0; i <= 24; i+=3){
			var yPos = 50+(height-100)*i/24
			var t = i
			if(String(t).length == 1){
				t = "0"+i
			}
			text(t+":00",55,yPos)
		}
		textSize(20)
		textAlign(RIGHT,TOP)
		text("Releases in order:",width-10,0)
		for(var i in table.time){
			stroke(table.time[i],100,100)
			var yPos = 50+(height-100)*i/table.time.length
			line(width-50,yPos,width-80,yPos)
		}
		if(mouseX == constrain(mouseX,width-80,width-50) && mouseY == constrain(mouseY,70,height-30)){
			var episode = floor((mouseY-70)*table.title.length/(height-100))
			if(episode == constrain(episode,0,table.title.length)){
				stroke(table.time[episode],100,100)
				var yPos = 50+(height-100)*episode/table.time.length
				line(width-50,yPos,width-100,yPos)
				textAlign(RIGHT,CENTER)
				noStroke()
				fill(0)
				text(table.realTime[episode],width-105,yPos)
				showToolTip(table.title[floor(episode)])
			}
		} else {
			hideToolTip()
		}
	}
	
}

function makeTable(url){
	table = {
		title: [],
		date: [],
		time: [],
		realTime: []
	}
	//$("#content-wrapper").append("<table id='dataTable'></table>")
	$.get(url, function(data){
		console.log(data)
		for (var i in data.items){
			table.title.push(data.items[i].title)
			var pubDate = data.items[i].pubDate.split(" ")
			table.date.push(pubDate[0])
			table.realTime.push(pubDate[1])
			var hms = pubDate[1].split(":")
			table.time.push(floor((int(hms[0])*10+int(hms[1])/6+int(hms[2])/36)/2.4))

		}
		//makeRegressor()
		times = table.time.concat()
		sort(times)
		tableReady = true
		$("#loader").hide()
		$("canvas").show()
	})
}

// function makeRegressor(){
// 	var xVals = []
// 	for (var i = 0; i < table.titles.length; i++){
// 		xVals.push(i+1)
// 	}
// 	regressor = new Regressor(xVals,table.durations,0.000001)
// 	regressed = false
// }


function showToolTip(text){
	$('#Caption').html(text)
				 //.css({'top':mouseY,'left':mouseX})
				 .fadeIn('slow');
}
function hideToolTip(){
	$('#Caption').hide();
}

function mousePressed(){
	// if (currentMin != null){
	// 	$('#descriptionBox').html("")
	// 	$('#descriptionBox').append("<h2>"+table.titles[currentMin]+"</h2>")
	// 						.append("<h3>"+table.dates[currentMin]+"</h3>")
	// 						.append(table.descriptions[currentMin])
	// 	$('#descriptionBox *').slice(3).remove()
	// }
}