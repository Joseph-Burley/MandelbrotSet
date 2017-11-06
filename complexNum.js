function complex(real, imag)
{
	if(typeof real === "string")
	{
		real = parseFloat(real);
		console.log("Real was not a number");
	}
	if(typeof imag === "string")
	{
		imag = parseFloat(imag);
		console.log("imag was not a number");
	}
	this.r = real;
	this.i = imag;
}

function copy(a)
{
	return new complex(a.r, a.i);
}

function toString(a)
{
	return "{" + a.r + " + " + a.i + "i}";
}

function add(a, b)
{
	return new complex(a.r + b.r, a.i+b.i);
}

function sub(a, b)
{
	return new complex(a.r - b.r, a.i-b.i);
}

function mult(a, b)
{
	var t1 = a.r*b.r;
	var t2 = a.i*b.i;
	var t3 = a.r*b.i;
	var t4 = a.i*b.r;
	
	return new complex(t1-t2, t3+t4);
}

function length(a)
{
	return Math.sqrt(a.r*a.r + a.i*a.i);
}

function pow(a, p)
{
	if ( p != parseInt(p, 10)) //if p is not an integer
		return NaN;
	else
	{
		var temp = copy(a);
		for(var i=1; i<p; i++)
		{
			temp = mult(temp, a);
		}
		return temp;
	}
}

function iterate(exp, c, max)
{
	if(typeof max === "undefined")
		max = 500;
	var result = new complex(0,0);

	for(var i = 0; i<max; i++)
	{
		result = pow(result, exp);
		result = add(result, c);
		if(length(result) >= 2)
			return i;
	}
	return i;
}