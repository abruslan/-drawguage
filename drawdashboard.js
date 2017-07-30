/**
 * @package   The gauge is designed to show a double measure value (plan&fact) and visualize how to interpret that value.
 * @author    Ruslan Abdrakhmanov <ruslan@abdrahmanov.com>
 * @version   0.1 beta
 * @license   MIT
 * @link      http://abdrahmanov.com
 * @copyright 2017 Ruslan Abdrakhmanov
 *
 */

var color_fill_blue    	= "#88cda1";
var color_fill_red     	= "#f28891";
var color_fill_green   	= "#88cda1";
var color_arc_blue  	= "#7cd5f9";
var color_arc_red   	= "#ef1b25";
var color_arc_green 	= "#0ba04a";
var color_pointer_blue  = "#0b63b4";
var color_pointer_red   = "#ef1b25";
var color_pointer_green = "#0ba04a";
var font_zero_prc = "11px Arial";
var font_plan_prc = "14px Arial";

// Функция отрисовки спидометра:
//  треугольник, круг в основании, значение текста
//  
//  context
//  cx,cy - координаты центра
//  radius - радиус спидометра
//  plan, fact - плановые и фактические значения в процентах (0-100% - верхние 2 сектора)
function drawdashboard(ctx,cx,cy,radius,plan,fact)
{
   var startangle;
   var endangle;
   var linewidth = 5
   
   //-----------------------------------------
   // fill begin
   // red sector
   startangle = Math.PI;
   endangle = Math.PI*(1+plan/100);
   ctx.beginPath();
   ctx.arc(cx,cy,radius,startangle,endangle);
   ctx.lineTo(cx,cy);
   ctx.fillStyle = color_fill_red;
   ctx.fill();
   
   // green setor
   startangle = Math.PI;
   endangle = Math.PI*(1+fact/100);
   ctx.beginPath();
   ctx.arc(cx,cy,radius,startangle,endangle);
   ctx.lineTo(cx,cy);
   ctx.fillStyle = color_fill_green;
   ctx.fill();
   // fill end
   
   
   //-----------------------------------------
   // arc berin
   ctx.lineWidth = linewidth;
   
   // blue arc
   startangle = Math.PI;
   endangle = Math.PI*2;
   ctx.beginPath();
   ctx.arc(cx,cy,radius,startangle,endangle);
   ctx.strokeStyle = color_arc_blue;
   ctx.stroke();
   
   // red arc
   startangle = Math.PI;
   endangle = Math.PI*(1+plan/100);
   ctx.beginPath();
   ctx.arc(cx,cy,radius,startangle,endangle);
   ctx.strokeStyle = color_arc_red;
   ctx.stroke();
   
   // green arc
   startangle = Math.PI;
   endangle = Math.PI*(1+fact/100);
   ctx.beginPath();
   ctx.arc(cx,cy,radius,startangle,endangle);
   ctx.strokeStyle = color_arc_green;
   ctx.stroke();
   
   // arc end
   
   //-----------------------------------------
   // pointer begin

   ctx.font = font_zero_prc;
   ctx.fillStyle = color_pointer_blue;
   ctx.fillText("0",cx-radius-15,cy);
   if ((Math.abs(plan-100) > 15) && (Math.abs(fact-100) > 15)) {
      ctx.fillText("100%",cx+radius+5,cy);
   }

   // fact pointer
   var cx_fact = cx+radius*Math.cos( Math.PI*(1+fact/100) );
   var cy_fact = cy+radius*Math.sin( Math.PI*(1+fact/100) );
   var cx_fact_text = cx_fact;
   var cy_fact_text = cy_fact;
   var cx_plan = cx+radius*Math.cos( Math.PI*(1+plan/100) );
   var cy_plan = cy+radius*Math.sin( Math.PI*(1+plan/100) );
   var delta = 0;

   // red fact
   if (fact < plan) {
      if (Math.abs(plan-fact) < 9) {
        cx_fact_text = cx+radius*Math.cos( Math.PI*(1+(plan-10)/100) );
        cy_fact_text = cy+radius*Math.sin( Math.PI*(1+(plan-10)/100) );
      }
      drawpointer(ctx,cx,cy,cx_fact,cy_fact,color_pointer_red,"факт",fact+"%",cx_fact_text,cy_fact_text);
   }

   //plan pointer
   drawpointer(ctx,cx,cy,cx_plan,cy_plan,color_pointer_blue,"план",plan+"%",cx_plan,cy_plan);

   // green fact
   if (fact >= plan) {
      if ((fact-plan) < 9) { 
        cx_fact_text = cx+radius*Math.cos( Math.PI*(1+(plan+10)/100) );
        cy_fact_text = cy+radius*Math.sin( Math.PI*(1+(plan+10)/100) );
      }
      drawpointer(ctx,cx,cy,cx_fact,cy_fact,color_pointer_green,"факт",fact+"%",cx_fact_text,cy_fact_text);
   }
   
   // pointer end
}



// Функция отрисовки стрелки спидометра:
//  треугольник, круг в основании, значение текста
//  
//  context
//  cx0,cy0 - координаты центра
//  cx1,cy1 - координаты указателя
//  color - цвет стрелки
//  text1 - первая строка (план/факт)
//  text2 - вторая строка (проценты)
//  x_text_orig, y_text_orig - координаты x,y текста. 
//          Совпадают с координатами указателя, если нет 
//          корректировки из-за близости другого текста
function drawpointer(ctx,cx0,cy0,cx1,cy1,color, text1, text2, x_text_orig, y_text_orig) {
  var rad = 4
  var rad_big = Math.sqrt( (cx1 - cx0)*(cx1 - cx0) + (cy1 - cy0)*(cy1 - cy0) );
  var dy = Math.abs(cx1 - cx0) * rad / rad_big;
  var dx = Math.abs(cy1 - cy0) * rad / rad_big;

  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.font = font_plan_prc;
  ctx.moveTo(cx1,cy1);
  ctx.beginPath();
  // 
  //  1  (cx1,cy1)    2
  //        /|
  //       / |
  //      /  |
  //    (cx0,cy0)      
  //  3               4

  ctx.moveTo(cx1,cy1);
  // 1
  if ((cy1 <= cy0 ) && (cx1 <= cx0)) {
    ctx.lineTo(cx0-dx,cy0+dy);
    ctx.lineTo(cx0+dx,cy0-dy);
    ctx.lineTo(cx1,cy1);
    ctx.fill();
  }
  // 2
  if ((cy1 <= cy0 ) && (cx1 > cx0)) {
    ctx.lineTo(cx0+dx,cy0+dy);
    ctx.lineTo(cx0-dx,cy0-dy);
    ctx.lineTo(cx1,cy1); 
    ctx.fill();
  }
  // 3
  if ((cy1 > cy0 ) && (cx1 <= cx0)) {
    ctx.lineTo(cx0-dx,cy0-dy);
    ctx.lineTo(cx0+dx,cy0+dy);
    ctx.lineTo(cx1,cy1); 
    ctx.fill();
  }
  // 4
  if ((cy1 > cy0 ) && (cx1 > cx0)) {
    ctx.lineTo(cx0+dx,cy0-dy);
    ctx.lineTo(cx0-dx,cy0+dy);
    ctx.lineTo(cx1,cy1); 
    ctx.fill();
  }
  ctx.moveTo(cx0,cy0);
  ctx.arc(cx0,cy0,rad,0,2*Math.PI);
  ctx.fill();

  var x_text = x_text_orig;
  var y_text = y_text_orig;
  // 1
  if ((y_text <= cy0 ) && (x_text <= cx0)) {
    x_text = x_text_orig - 36;
    y_text = y_text_orig - 24;
  }
  // 2
  if ((y_text <= cy0 ) && (x_text > cx0)) {
    x_text = x_text_orig + 0;
    y_text = y_text_orig - 24;
  }
  // 3
  if ((y_text > cy0 ) && (x_text <= cx0)) {
    x_text = x_text_orig - 36;
    y_text = y_text_orig + 14;
  }
  // 4
  if ((y_text > cy0 ) && (x_text > cx0)) {
    x_text = x_text_orig + 5;
    y_text = y_text_orig + 14;
  }
  ctx.fillText(text1,x_text,y_text);
  ctx.fillText(text2,x_text,y_text+14);
 }

