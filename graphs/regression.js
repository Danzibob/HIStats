var Regressor = function (xVals,yVals,L){
	this.xVals = xVals
	this.yVals = yVals
	this.n = 0
	this.m = 0
	this.c = 0
	this.L = L

	this.f = function (x){
		return (this.n*Math.log(x) + this.m*x + this.c)
	}

	this.calcErr = function (){
		var dn = 0
		var dm = 0
		var dc = 0
		for (var i = 0; i < xVals.length; i++){
			var xi = this.xVals[i]
			var yi = this.yVals[i]
			if (!isNaN(yi)){
				var f = this.f(xi)
				dn += (-2*Math.log(xi))*(yi-f)
				dm += (-2*xi)*(yi-f)
				dc += (-2)*(yi-f)
			}
		}
		if (dn == Infinity || dm == Infinity || dc == Infinity){
			noLoop()
		}
		return {n:dn,m:dm,c:dc}
	}

	this.improve = function(N){
		for (var i = 0; i < N; i++){
			var grad = this.calcErr()
			this.n -= grad.n*this.L
			this.m -= grad.m*this.L
			this.c -= grad.c*this.L
		}
		/*console.log(nfc(this.n,2),
					nfc(this.m,2),
					nfc(this.c,2))
					*/
	}
}