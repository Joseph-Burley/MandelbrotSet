function generate(canvas, zoom_real, zoom_imag, zoom_delta, exponent, max_iterations, thresh)
{
	if(typeof max_iterations === "undefined")
		max_iterations = 500;
	var ctx = canvas.getContext("2d");
	var actualDataObject = ctx.getImageData(0,0,canvas.width, canvas.height);
	
	//deltas to add to current
	var real_delta = new complex(zoom_delta, 0);
	var imag_delta = new complex(0, zoom_delta);
	
	//these define the top left corner. all calculations are done from the top left corner
	const real_min = zoom_real - (canvas.width / 2)*zoom_delta;
	const imag_max = zoom_imag + (canvas.height /2)*zoom_delta;
	var current_value = new complex(real_min, imag_max); //this is the complex value at the top left corner
	
	//index offsets for RGBA channels
	const RED = 0;
	const GREEN = 1;
	const BLUE = 2;
	const ALPHA = 3;
	
	
	//variables that are used inside the loop
	var it_res;
	var color_hsv;
	var num_colors = 4;
	var sector_size = 500 / num_colors;
	var color_sector;
	var hue;
	var color_rgb;
	var index;
	//loop through pixels, find their complex value, iterate that value, and assign a color
	
	var count_in = 0;
	var count_out = 0;
	var min_it = 9999;
	var max_it = 0;
	var c1 = 0;
	var c2 = 0;
	var c3 = 0;
	var c4 = 0;
	for(var px_y = 0; px_y < canvas.height; px_y++)
	{
		for(var px_x = 0; px_x < canvas.width; px_x++)
		{
			index = ((px_y*canvas.width)+px_x)*4; //pixel index
			/*
			if((px_x % 10 == 0) && (px_y % 10 == 0))
			{
				console.log("x is: " + px_x + " y is: " + px_y + " index is: " + index);
			}
			*/
			it_res = iterate(exponent, current_value, max_iterations);
			if(it_res < min_it)
			{
				min_it = it_res;
			}
			if(it_res > max_it)
			{
				max_it = it_res;
			}
			color_hsv = [0,0,0];
			
			if(it_res >= thresh) // is inside the mandelbrot set
			{
				count_in++;
				//color is black. Hue is anything, saturation is 1, value is 0
				//color_hsv = [1,1,0];
				color_rgb = [0,0,0,255];
			}
			else
			{
				count_out++;
				var t = max_iterations - thresh;
				//color is something else
				//map 0-500 (iterations) -> 0-1 (hue)
				//console.log("point " + toString(current_value) + " @ " + it_res);
				if(it_res >= 0 && it_res <=(t/8))
				{
					c1++;
					color_rgb = [255, 0, 0, 255];
				}
				else if(it_res >= (t/8)+1 && it_res <= (t/4))
				{
					c2++;
					color_rgb = [0, 255, 0, 255];
				}
				else if(it_res >= (t/4)+1 && it_res <= (t/2))
				{
					c3++;
					color_rgb = [0, 0, 255, 255];
				}
				else
				{
					c4++;
					color_rgb = [255,255,255,255];
				}
				
				
				/*
				color_sector = Math.floor(it_res / sector_size); //places iteration value into distinct color block based on number of colors
				hue = (1 / num_colors) * color_sector * 255;
				color_hsv = [hue, 1, 1];
				*/
				
				
			}
			//apply color
			
			//color_rgb = HSVtoRGB(color_hsv);
			color_rgb[ALPHA] = 255; //fully opaque
			
			
			actualDataObject.data[index + RED] = color_rgb[RED];
			actualDataObject.data[index + GREEN] = color_rgb[GREEN];
			actualDataObject.data[index + BLUE] = color_rgb[BLUE];
			actualDataObject.data[index + ALPHA] = color_rgb[ALPHA];
			
			//add real_delta to current
			current_value = add(current_value, real_delta);
		}
		//console.log("-------END OF ROW-------");
		//console.log("Before Reset: point " + toString(current_value));
		//sub imag_delta from current
		current_value = sub(current_value, imag_delta);
		//set real value back to real_min
		current_value.r = real_min;
		//console.log("After Reset: point " + toString(current_value));
	}
	
	//logging
	/*
	console.log("points inside: " + count_in);
	console.log("points outside: " + count_out);
	console.log("minimum iterations for length > 2: " + min_it);
	console.log("maximum iterations for length > 2: " + max_it);
	console.log("color 1: " + c1);
	console.log("color 2: " + c2);
	console.log("color 3: " + c3);
	console.log("color 4: " + c4);
	*/
	
	ctx.putImageData(actualDataObject,0,0);
}

function HSVtoRGB(h, s, v)
{
	var r, g, b, i, f, p, q, t;
	if (arguments.length === 1) {
        s = h[1], v = h[2], h = h[0];
    }
	i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
	r = Math.round(r * 255);
	g = Math.round(g * 255);
	b = Math.round(b * 255);
	return [r, g, b];
}