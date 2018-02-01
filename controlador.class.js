window.requestAnimationFrame = 
	window.requestAnimationFrame || 
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || 
	window.msRequestAnimationFrame;

function Controlador(cj)
{
	this.canvas=document.getElementById('cv');

	this.W=600;
	this.H=400;

	this.canvas.width=this.W;
	this.canvas.height=this.H;

	this.cx=this.canvas.getContext('2d');

	this.INPUT=new Control_input();
	this.INPUT.asignar_control_raton(this.canvas);

	this.CAMARA=new Camara(0,0, this.W, this.H);
	this.CAMARA.establecer_caja_margen(new Caja(200, 100, 200, 200));

	this.REPRESENTADOR=new Representador_canvas();
	this.REPRESENTADOR.vincular_camara(this.CAMARA);

	this.activo=true;
	this.ultimo_momento=0;
	this.delta=0.0;

	this.INTERVALO=null;

	this.ARRANCADO=false;

	this.CJ=cj;
}

Controlador.prototype.iniciar=function()
{
	var aquello=this;

	this.cx.font='10px monospace';
	this.cx.textBaseline='bottom';

	requestAnimationFrame(this.dibujar.bind(this));
}

Controlador.prototype.arrancar=function()
{
	if(this.ARRANCADO) return;
	else
	{
		var aquello=this;
		this.ARRANCADO=true;
		this.INTERVALO=setInterval(function(){aquello.loop();}, 16.666);
		this.ultimo_momento=Date.now();
	}
}

Controlador.prototype.parar=function()
{
	clearInterval(this.INTERVALO);
	this.ARRANCADO=false;
}

Controlador.prototype.procesar_input=function()
{
	this.INPUT.capturar();

	if(this.INPUT.es_tecla_down('lalt')) this.activo=!this.activo;

	if(!this.activo) return;
	else this.CJ.procesar_input(this.INPUT);
}

Controlador.prototype.loop=function(v_delta)
{
	if(v_delta)
	{
		this.delta=v_delta / 1000;
	}
	else
	{
		var ahora=Date.now(); 	//Cogemos el momento actual...
		this.delta=(ahora-this.ultimo_momento) / 1000;
		this.ultimo_momento=ahora; 	//Actualizamos el ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºltimo momento..
	}

	if(this.delta > 50) this.delta=50;	//Máximo delta permitido. Más allá relentizamos.

	this.procesar_input();

	if(this.activo) 
	{
		this.CJ.paso_loop(this.delta);
	}
}

Controlador.prototype.dibujar=function()
{
	this.CJ.representar(this.REPRESENTADOR, this.cx, this.CAMARA, this.W, this.H);
	requestAnimationFrame(this.dibujar.bind(this));	
}
