function updateOrientation(){
	var viewWidth = "vert";
	  switch(window.orientation)
        {
            case 0:
                viewWidth = "vert";
            break;

            case -90:
                viewWidth = "wide";
            break;

            case 90:
                viewWidth = "wide";
            break;

            case 180:
                viewWidth = "vert";
            break;
		var	setWidth = window.innerWidth +"px";
        }
	$("body").attr("class", "");
	$("body").attr("class", viewWidth);
	$("#page").css("width", setWidth);
	window.scrollTo(0, 1);
}
function resizeOrientation(){
	var viewWidth = "vert";
	  switch(window.orientation)
        {
            case 0:
                viewWidth = "vert";
            break;

            case -90:
                viewWidth = "wide";
            break;

            case 90:
                viewWidth = "wide";
            break;
		//var	setWidth = window.innerWidth +"px";
        }
	$("body").attr("class", "");
	$("body").attr("class", viewWidth + ' iPhone');
	window.scrollTo(0, 1);
}
if((navigator.userAgent.match(/iPhone/i))
|| (navigator.userAgent.match(/iPod/i))) {
	window.addEventListener("orientationchange", updateOrientation, false);
}
else if (navigator.userAgent.match(/Android/i)) {
	window.addEventListener("resize", resizeOrientation, false);
}
function NavtoLink(){
	var TheSelect = $("option:selected").attr("value");
	window.location = TheSelect;
	change();
}
function ReplaceTheTabs(){

		$('ul.tabs li').each(function(i) {
			$(this).replaceWith('<option value="' + $(this).children('a').attr('href') + '">' + $(this).text() + '</option>');
		});
		$('ul.tabs').each(function(i) {
			$(this).replaceWith("<select onchange='NavtoLink();'>" + $(this).html() + "</select>");
		});
}
function CloseTab(){

}
$(document).ready(function(){
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
	updateOrientation();
	window.scrollTo(0, 1);
  }
	else if (navigator.userAgent.match(/Android/i)) {
			window.scrollTo(0, 1);
	}
else{}
	$("#search-box").hide();
	if ($("#search").length){
	$("#top-icons").append("<a href='#search-box' id='search-toggle'></a>");
	$("#search-toggle").click(function(){
		$("#mobile-view").scrollTop(60);
			//window.scrollTo(0, 1);
		$("#main").toggle();
		$("#block-tabs").toggle();
		$("#search-box").toggle();
		return false;
	});
	}
	else{}
	ReplaceTheTabs();
	$("#admin-menu-mobile ul ul").hide();
	$("#admin-menu-mobile a").click(function(){
		var childUl = $(this).parent().attr("class");
		//alert(childUl);
			if((childUl == "expandable") || (childUl == "expandable admin-menu-icon")){
				$(this).parent().children("ul").slideDown();
				$(this).parent().removeClass("expandable").addClass("expanded");
				$(this).parent().append("<a class='admin-close' href='#close'></a>");
					$("a.admin-close").click(function(){
					$(this).parent().children("ul").slideUp();
					$(this).parent().removeClass("expanded").addClass("expandable");
					$(this).remove();
					return false;
				});

				return false;
			}
			else{}
	});
	$('.lightbox-processed').unbind();
});