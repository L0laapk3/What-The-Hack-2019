var score = 0;
var color = "blue";
var healtBegin;
var score = 0;
var goGame = false;




var voedingsstoffenVerliezen = {
    koolhydraten: 5,
    vetten: 0.3,
    vitaminen: 2.5,
    eiwitten: 2.5
};

var voedingsmiddelen = {
  appel: {
    koolhydraten: 5,
    vetten: 0,
    vitaminen: 5,
    eiwitten: 0.5
  },
  wortel: {
    koolhydraten: 3,
    vetten: 0,
    vitaminen: 5,
    eiwitten: 1
  },
  druiven:{
    koolhydraten: 7,
    vetten: 0,
    vitaminen: 5,
    eiwitten: 0.5
  },
  broccoli:{
    koolhydraten: 7,
    vetten: 0,
    vitaminen: 7,
    eiwitten: 5
  },
  chocolade:{
    koolhydraten: 13,
    vetten: 8,
    vitaminen: 0,
    eiwitten: 1
  },
  ei:{
    koolhydraten: 0,
    vetten: 1,
    vitaminen: 2,
    eiwitten: 10
  },
  graan:{
    koolhydraten: 10,
    vetten: 0,
    vitaminen: 2,
    eiwitten: 3
  },
  melk:{
    koolhydraten: 8,
    vetten: 5,
    vitaminen: 5,
    eiwitten: 8
  },
  aardappel:{
    koolhydraten: 10,
    vetten: 1,
    vitaminen: 3,
    eiwitten: 1
  },
  tomaat:{
    koolhydraten: 8,
    vetten: 0,
    vitaminen: 7,
    eiwitten: 0
  },
  vlees:{
    koolhydraten: 5,
    vetten: 6,
    vitaminen: 2,
    eiwitten: 12
  },
};


function random(min,max){
 	return Math.round(Math.random() * (max-min) + min);
}

function dropBox(){
  if (!goGame) {
    return;
  }
  var length = random(100, ($(".game").width() - 100));
  var velocity = random(850, 10000);
  var size = random(150, 250);
  var thisBox = $("<div/>", {
    class: "box",
    style:  "width:" +size+ "px; height:"+size+"px; left:" + length+  "px; transition: transform " +velocity+ "ms linear;"
  });
  
  var tempor = Object.keys(voedingsmiddelen);
  
  //set data and bg based on data
  thisBox.data("kind", tempor[Math.round(Math.random()*(tempor.length-1))]);
  console.log(thisBox.data("kind"));
  thisBox.css({"background": "no-repeat url('imgmini/" + thisBox.data("kind") + ".png')", "background-size":"contain"});
  
  
  //insert gift element
  $(".game").append(thisBox);
  
  //random start for animation
  setTimeout(function(){
    thisBox.addClass("move");
  }, random(0, 5000) );
  
  //remove this object when animation is over
  thisBox.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
              function(event) {
    $(this).remove();
  });
}


$(document).on('click', '.box', function(){
  
  if (goGame) {
  
  addHealt(voedingsmiddelen[$(this).data("kind")]);
  score += 1;
  $("#scoreVenster").html(score);
  
  $(this).remove();
    
  }
});




function addHealt(voedingsmiddel){
  var sleutels = Object.keys(voedingsmiddel);
  for (i = 0; i < sleutels.length; i++) { 
    removeHealt(sleutels[i],-voedingsmiddel[sleutels[i]]);
  }
}

//staat dps in procent
//25-75 is groen, boven of onder is rood
function removeHealt(voedingsstof,damage){
  var healt = $("#"+voedingsstof).width();
  var procent = 1-(healtBegin-healt)/healtBegin;
  var healtNu = (procent - damage/100) * healtBegin;
  healtNu = Math.min(healtNu,healtBegin);
  console.log("healtBegin in addHEalt")
  console.log(healtBegin);
  if (((healtBegin-healtNu)/healtBegin) >= 0.25 && ((healtBegin-healtNu)/healtBegin) <= 0.75) {
    $("#"+voedingsstof).addClass('w3-green');
    $("#"+voedingsstof).removeClass('w3-red');
  } else {
    $("#"+voedingsstof).addClass('w3-red');
    $("#"+voedingsstof).removeClass('w3-green');
  }
  $("#"+voedingsstof).css( "width", healtNu);
  if ((healtNu == healtBegin || healtNu <=0) && goGame) {
    goGame = false;
    alert("Je score is: " + score + "\n" + "je krijgt " + score*10 + " exp, proficiat!");
    $("#gameDiv").hide();
    score = 0;
    
    $("#scoreVenster").html(score);
    
    var sleutels = Object.keys(voedingsstoffenVerliezen)
    for (i = 0; i < sleutels.length; i++) { 
      $("#"+sleutels[i]).css( "width", healtBegin)
    }
  }
}

window.setInterval(function(){
  if (goGame) {
  var sleutels = Object.keys(voedingsstoffenVerliezen)
  for (i = 0; i < sleutels.length; i++) { 
    removeHealt(sleutels[i],voedingsstoffenVerliezen[sleutels[i]]);
  }}
}, 500);


function startGame(){
  $("#gameDiv").show();
  goGame = true;
  score = 0;
  for (i = 0; i < 10; i++) { 
    dropBox();
  }
  
  healtBegin = $("#koolhydraten").width();
  
  //start met alles op 50%
  var tempp = Object.keys(voedingsstoffenVerliezen);
  for (i = 0; i < tempp.length; i++) {
    removeHealt(tempp[i],50);
  }
}


var runGame = setInterval(function(){
              if (goGame) {
                for (i = 0; i < 10; i++) { 
                  dropBox();
                } }
              }, 5000);

