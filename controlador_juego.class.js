function Controlador_juego()
{
	this.JUGADOR=new Jugador();
	this.JUGADOR.establecer_posicion(280, 120);

	this.FACTOR_AMPLIACION=3;
	this.NIVEL=new Nivel();

	var cadena_nivel='020010|0,9,1,1,20-0,6,1,1,10-0,0,2,2,10-19,0,2,2,10-2,8,3,3,3-4,5,4,3,2';

	this.NIVEL.desde_cadena(cadena_nivel);
	this.BONUS=Array();
	this.insertar_objetos_en_nivel();
}

Controlador_juego.prototype.insertar_objetos_en_nivel=function()
{
	var x=0, y=0;
	while(x < this.NIVEL.W)
	{
		y=0;

		while(y < this.NIVEL.H)
		{
			var c=this.NIVEL.celda(x, y);
			switch(c.tipo)
			{
				case 3: this.insertar_bonus(c, 1); break;
				case 4: this.insertar_bonus(c, 2); break;
			}
			++y;
		}
		++x;
	}
}

Controlador_juego.prototype.insertar_bonus=function(c, t)
{
	var x=(c.x * this.NIVEL.W_CELDA) + 4;
	var y=(c.y * this.NIVEL.H_CELDA) + 4;
	this.BONUS.push(new Bonus(x, y, t));
}

Controlador_juego.prototype.procesar_input=function(I)
{
	if(I.es_tecla_down('espacio')) this.JUGADOR.saltar();
}

Controlador_juego.prototype.paso_loop=function(delta)
{
	this.JUGADOR.turno(delta);

	//Colisiones que inviertan el sentido de la marcha....
	var invertir=this.NIVEL.obtener_celdas_para_caja_y_tipo(this.JUGADOR.obtener_caja_posicion(), 2);
	if(invertir.length)
	{
		var x=invertir[0].x * Nivel.prototype.W_CELDA;
		var fx=x+Nivel.prototype.W_CELDA;

		this.JUGADOR.invertir_direccion(x, fx);
	}

	//Colisión por debajo... Ver si hay alguna caja que detenga el movimiento.
	if(this.JUGADOR.es_cayendo())
	{
		var caja_debajo=this.JUGADOR.obtener_caja_suelo();
		var celdas_1=this.NIVEL.obtener_celdas_para_caja_y_tipo(caja_debajo, 1);

		if(celdas_1.length) this.JUGADOR.establecer_en_suelo(celdas_1[0].y * Nivel.prototype.H_CELDA);
	}

	//Colisiones con bonus...
	var l=this.BONUS.length;
	var i=0;
	var recoger=true;
	while(i < l)
	{
		if(this.JUGADOR.colisiona_con(this.BONUS[i].posicion)) 
		{
			recoger=true;
			this.recoger_bonus(this.BONUS[i]);
		}
		++i;
	}

	if(recoger)
	{
		i=0;
		while(i < this.BONUS.length)
		{
			if(this.BONUS[i].es_recogido()) this.BONUS.splice(i, 1);
			else ++i;
		}
	}
}

Controlador_juego.prototype.recoger_bonus=function(bonus)
{
	bonus.recoger();
	//TODO: Comparar tipo y dirección!!!.
}

Controlador_juego.prototype.representar=function(R, cx, CAM, w, h)
{
	CAM.establecer_factor_ampliacion(this.FACTOR_AMPLIACION);
	var caja=new Caja(this.JUGADOR.posicion.x, this.JUGADOR.posicion.y, this.JUGADOR.W, this.JUGADOR.H);
	CAM.centrar_en(caja);

	R.limpiar_representacion(cx, "#000", 600, 400, w, h);
	this.dibujar_nivel(R, cx);
	this.dibujar_bonus(R, cx);
	this.dibujar_jugador(R, cx);
}

/******************************************************************************/

Controlador_juego.prototype.dibujar_nivel=function(R, cx)
{
	var x=0, y=0;
	var caja=new Caja(0,0,0,0);

	while(x < this.NIVEL.W)
	{
		y=0;

		while(y < this.NIVEL.H)
		{
			var c=this.NIVEL.celda(x, y);

			switch(c.tipo)
			{
				case 1:
					caja.x=c.x * Nivel.prototype.W_CELDA;
					caja.y=c.y * Nivel.prototype.H_CELDA;
					caja.w=Nivel.prototype.W_CELDA;
					caja.h=Nivel.prototype.H_CELDA / 4;

					caja.x*=this.FACTOR_AMPLIACION;
					caja.y*=this.FACTOR_AMPLIACION;					
					caja.w*=this.FACTOR_AMPLIACION;
					caja.h*=this.FACTOR_AMPLIACION;

					R.representar_caja(cx, caja, "#090");					
				break;

				case 2:
					caja.x=c.x * Nivel.prototype.W_CELDA;
					caja.y=c.y * Nivel.prototype.H_CELDA;
					caja.w=Nivel.prototype.W_CELDA;
					caja.h=Nivel.prototype.H_CELDA;

					caja.x*=this.FACTOR_AMPLIACION;
					caja.y*=this.FACTOR_AMPLIACION;					
					caja.w*=this.FACTOR_AMPLIACION;
					caja.h*=this.FACTOR_AMPLIACION;

					R.representar_caja(cx, caja, "#099");					
				break;
			}
			++y;
		}
		++x;
	}
}

Controlador_juego.prototype.dibujar_jugador=function(R, cx)
{
	var caja=new Caja(this.JUGADOR.posicion.x, this.JUGADOR.posicion.y, this.JUGADOR.W, this.JUGADOR.H);

	caja.x*=this.FACTOR_AMPLIACION;
	caja.y*=this.FACTOR_AMPLIACION;					
	caja.w*=this.FACTOR_AMPLIACION;
	caja.h*=this.FACTOR_AMPLIACION;

	R.representar_caja(cx, caja, "#900");						
}

Controlador_juego.prototype.dibujar_bonus=function(R, cx)
{
	var l=this.BONUS.length;
	var i=0;

	var caja=new Caja(0, 0, Bonus.prototype.W, Bonus.prototype.H);
	caja.w*=this.FACTOR_AMPLIACION;
	caja.h*=this.FACTOR_AMPLIACION;

	var color='';

	while(i < l)
	{
		caja.x=this.BONUS[i].posicion.x;
		caja.y=this.BONUS[i].posicion.y;

		caja.x*=this.FACTOR_AMPLIACION;
		caja.y*=this.FACTOR_AMPLIACION;					

		color=this.BONUS[i].tipo==1 ? '#909' : '#727';
		
		R.representar_caja(cx, caja, color);						
		++i;
	}
}
