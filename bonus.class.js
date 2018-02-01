function Bonus(x, y, t)
{
	this.posicion=new Caja(x, y, Bonus.prototype.W, Bonus.prototype.H);
	this.tipo=t;

	this.recogido=false;
}

Bonus.prototype.recoger=function() {this.recogido=true;}
Bonus.prototype.es_recogido=function() {return this.recogido;}

Bonus.prototype.W=10;
Bonus.prototype.H=10;
