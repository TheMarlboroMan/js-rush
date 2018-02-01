function Celda(px, py, pt)
{
	this.x=px;
	this.y=py;
	this.tipo=pt;

	/*1 - Suelo
	2 - Vuelta
	3 - Bonus 1
	4 - Bonus 2*/
}

function Nivel()
{
	this.W=0;
	this.H=0;

	this.CELDAS=Array();
}

Nivel.prototype.W_CELDA=16;
Nivel.prototype.H_CELDA=16;

Nivel.prototype.desde_cadena=function(cad)
{
	var ptw=cad.substr(0, 3);
	var pth=cad.substr(3, 3);
	this.W=parseInt(ptw, 10);
	this.H=parseInt(pth, 10);

	this.preparar();

	var cn=cad.substr(7);

	var partes=cn.split('-');
	var i=0;
	var l=partes.length;

	while(i < l)
		this.procesar_parte(partes[i++]);
}

Nivel.prototype.procesar_parte=function(cad)
{
	var p=cad.split(',');
	var x=parseInt(p[0], 10);
	var y=parseInt(p[1], 10);
	var t=parseInt(p[2], 10);
	var dir=parseInt(p[3], 10);
	var can=parseInt(p[4], 10);

	var i=0;

	while(i < can)
	{
		this.CELDAS[x][y].tipo=t;
		switch(dir)
		{
			case 1: ++x; break; //Horizontal.
			case 2: ++y; break; //Vertical.
			case 3: x+=2; break; //Horizontal, salta 2.
		}
		++i;
	}
}

Nivel.prototype.preparar=function()
{
	var x=0, y=0;

	while(x < this.W)
	{
		y=0;
		this.CELDAS.push(Array());

		while(y < this.H)
		{
			this.CELDAS[x].push(new Celda(x, y, 0));
			++y;
		}
		++x;
	}
}

Nivel.prototype.celda=function(x, y) 
{
	if(x >= 0 && x < this.W && y >= 0 && y < this.H) return this.CELDAS[x][y];
	else 
	{
		console.log('Solicitada celda error '+x+','+y);
		return null;
	}
}

Nivel.prototype.celda_en_punto=function(px, py)
{
	var x=Math.floor(px / this.W_CELDA);
	var y=Math.floor(py / this.H_CELDA);

	return this.celda(x, y);
}

Nivel.prototype.obtener_celdas_para_caja_y_tipo=function(caja, t)
{
	var resultado=Array();

	function proc(c)
	{
		if(c && c.tipo==t) resultado.push(c);
	}

	proc(this.celda_en_punto(caja.x, caja.y));
	proc(this.celda_en_punto(caja.x+caja.w, caja.y));
	proc(this.celda_en_punto(caja.x, caja.y+caja.h));
	proc(this.celda_en_punto(caja.x+caja.w, caja.y+caja.h));

	return resultado;
}
