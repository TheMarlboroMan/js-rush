function Jugador()
{
	this.W=12;
	this.H=12;

	this.posicion=new Caja(0,0, this.W, this.H);
	this.direccion=-1;
	this.velocidad=100;
	this.vector_y=0;

	this.gravedad=400.0;
	this.suelo=false;

	this.caja_suelo=new Caja(0,0, this.W, this.H / 4);
}

Jugador.prototype.establecer_posicion=function(vx, vy)
{
	this.posicion.x=vx;
	this.posicion.y=vy;
	this.posicion.recibir_datos(this.posicion.x, this.posicion.y, false, false);
	this.propagar_cajas();
}

Jugador.prototype.invertir_direccion=function(x, fx)
{
	this.direccion=-this.direccion;

	if(this.direccion > 0) this.posicion.x=fx;
	else this.posicion.x=x-this.W;

	this.posicion.recibir_datos(this.posicion.x, false, false, false);
	this.propagar_cajas();
}

Jugador.prototype.establecer_en_suelo=function(vy)
{
	this.vector_y=0;
	this.suelo=true;
	this.posicion.y=vy-this.H;
	this.posicion.recibir_datos(false, this.posicion.y, false, false);
	this.propagar_cajas();
}

Jugador.prototype.sumar_posicion=function(vx, vy)
{
	if(vx!==false) this.posicion.x+=vx;
	if(vy!==false) this.posicion.y+=vy;

	this.posicion.recibir_datos(this.posicion.x, this.posicion.y, false, false);
	this.propagar_cajas();
}

Jugador.prototype.propagar_cajas=function()
{
	this.caja_suelo.x=this.posicion.x;
	this.caja_suelo.y=this.posicion.y+9;
}

Jugador.prototype.turno=function(delta)
{
	//Eje X.
	var dx=(this.direccion * this.velocidad) * delta;

	this.sumar_posicion(dx, false);

	var ov=this.vector_y;
	this.vector_y+=this.gravedad * delta;

	var y=ov + this.vector_y;		
	var dy=y * 0.5 * delta;
		
	if(Math.abs(dy) >= this.posicion.h) 
	{
		resultado=dy-this.posicion.h;
		dy=this.posicion.h;
	}

	this.sumar_posicion(false, dy);
}

Jugador.prototype.es_cayendo=function() {return this.vector_y >= 0;}

Jugador.prototype.saltar=function()
{
	if(this.suelo)
	{
		this.vector_y=-200.0;
		this.suelo=false;
	}
}

Jugador.prototype.obtener_caja_suelo=function() {return this.caja_suelo;}
Jugador.prototype.obtener_caja_posicion=function() {return this.posicion;}
Jugador.prototype.colisiona_con=function(caja) {return this.posicion.en_colision_con_caja(caja);}
