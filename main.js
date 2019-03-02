function loadFarm() {
	let size = 10;



	let farm = document.createElement("farm");
	for (let i = 0; i < size; i++) {
		let row = document.createElement("farm-background-row");
		for (let j = 0; j < size; j++) {
			let tile = document.createElement("farm-background-tile");
			row.appendChild(tile);
		}
		farm.appendChild(row);

	}
	let farmContainer = $("#farmContainer");
	farmContainer.append(farm);
	let scrollContainer = $("#farmScrollContainer");

	// let squareSize = window.innerWidth * 10 / 100 * size;

	// scrollContainer.scrollTop((squareSize / Math.SQRT2 + window.innerWidth * 0.2 * 2 - window.innerWidth) / 2);
	// scrollContainer.scrollLeft((squareSize * Math.SQRT2 + window.innerWidth * 0.2 * 2 - window.innerWidth) / 2);

}


let cash = 340;
function updateCash(change) {
	cash += change;
	let span = $("coins div span").text(cash + "€");

	let flying = $("<flying>" + (change > 0 ? "+" : "-") + Math.abs(change) + "€</flying>").css({
		position: "fixed",
		color: change > 0 ? "green" : "red",
		right: window.innerWidth - span.offset().left - span.width() + "px",
		top: "1vw"
	});

	flying.prependTo(span.parent());

	flying.animate({
		opacity: 0,
		top: "-1vw"
	}, {
		duration: 400,
		done: flying.remove
	});
}


loadFarm();

function setUpdatePlant(plant) {
	let soort = plant[0].dataset.soort;
	setTimeout(() => updatePlant(plant, (parseInt(plant[0].dataset.stadium) || 0) + 1), Math.floor((0.8*Math.random()+0.6)*alleSoorten[soort].snelheid));
}
function updatePlant(plant, stadium, noUpdate) {
	stadium = parseInt(stadium);
	let soort = plant[0].dataset.soort;
	plant.children("img").attr("src", "img/" + soort + "/" + stadium + ".png");
	plant[0].dataset.stadium = stadium;
	if (alleSoorten[soort].stadia > stadium && !noUpdate)
		setUpdatePlant(plant);
}

function newPlant(soort) {
	return $("<plant data-soort='" + soort + "'><img src='img/" + soort + "/1.png'>");
}


function terug() {
	$("farm-multi-hitbox").remove();
	$("farm").removeClass("outline grid");
	$("farm").off("click");
	$("#mainControls").css("display", "");
	$("#annuleerControls").css("display", "none");
}
function openAnnuleerControls() {
	$("#mainControls").css("display", "none");
	$("#annuleerControls").css("display", "").on("click", terug);
}


let alleSoorten = {};
$(".knop-zaaien").each(function(_, knop) {
	let soort = knop.dataset.plant;
	let snelheid = parseInt(knop.dataset.snelheid);
	let stadia = parseInt(knop.dataset.stadia);
	alleSoorten[soort] = {
		snelheid: snelheid,
		stadia: stadia,
		winst: knop.dataset.winst,
	};

	$(knop).on("click", function(ev) {
		$("farm").addClass("outline");

		$("farm").on("click", "farm-background-tile", function(ev) {
			let tile = $(ev.target);
			if (!tile.hasClass("farmland") && !knop.dataset.ongrass)
				return;
			if (tile.children().length > 0)
				return;

			let plant = newPlant(soort).css("zIndex", tile.index() + tile.parent().index());
			tile.append(plant);
	
			setUpdatePlant(plant);
			
		});

		openAnnuleerControls();
	});
});




function popupBackdrop() {
	$("topleftcontrolsReturn").addClass("enabled").on("click", (ev) => {
		if (ev.target != $("topleftcontrolsReturn")[0])
			return;
		console.log("tof");
		$("topleftcontrolsReturn").removeClass("enabled").off("click");
		$("profile").css({width: "", height: ""});
		$("foodTipsInfo").css("overflowY", "hidden");
		setTimeout(() => {
			$("profile").removeClass("opened");
			$("foodtips").css("display", "")
			$("foodTipsInfo").css("overflowY", "auto");
		}, 1000);
	});
}



$("#level").on("click", (ev) => {
	if ($("profile").hasClass("opened"))
		return;
	$("profile").addClass("opened")
	startGame();
});
function returnFromMinigame(score) {
	$("profile").addClass("opened");
	$("foodtips").css("display", ""); //you never know

	$("profile").addClass("opened").css({
		width: "54vw",
		height: ""
	});
	$("minigameReturn").css("display", "block").text("Je hebt " + score * 10 + " xp verdiend. Proficiat!");
	setTimeout(() => {
		$("profile").css({width: "", height: ""});
		setTimeout(() => {
			$("profile").removeClass("opened");
			$("minigameReturn").css("display", "")
		}, 1000);
	}, 3000);
}



$("avatar profile > img").on("click", (ev) => {
	if ($("profile").hasClass("opened"))
		return;
	$("profile").addClass("opened").css({
		width: "58vw",
		height: "58vw"
	});
	$("foodtips").css("display", "block");
	$("foodTipsInfo").css("overflowY", "hidden");
	setTimeout(() => {
		$("foodTipsInfo").css("overflowY", "auto");
	}, 1000);
	
	popupBackdrop();
});




$("farm").on("mousedown", (ev) => {
	let lastTile = undefined;
	$("farm").on("mousemove", (ev) => {
		let tile = ev.target;
		if (tile != lastTile) {
			$(tile).trigger("click");
			lastTile = tile;
		}
	});
}).on("mouseup", () => $("farm").off("mousemove"));






$("#knop-oogsten").on("click", (ev) => {
	$("farm").addClass("outline");

	$("farm").on("click", "farm-background-tile", function(ev) {
		let tile = $(ev.target);
		if (tile.children("plant").length == 0)
			return;

		let plant = tile.children("plant").first();
		let soort = plant[0].dataset.soort;
		let stadia = plant[0].dataset.stadium;
		if (stadia != alleSoorten[soort].stadia)
			return;

		
		updateCash(parseInt(alleSoorten[soort].winst));

		if (soort == "appel") {

			updatePlant(plant, alleSoorten[soort].stadia - 1, true);
			setTimeout(() => updatePlant(plant, alleSoorten[soort].stadia), (0.8*Math.random()+0.6)*alleSoorten[soort].stadia * alleSoorten[soort].snelheid / 2);

			plant[0].dataset.aantalGeoogst = (parseInt(plant[0].dataset.aantalGeoogst) || 0) + 1;
			return;

		}

		plant.remove();
		
	});

	openAnnuleerControls();

});




$("#knop-slopen").on("click", (ev) => {
	$("farm").addClass("outline");

	$("farm").on("click", "farm-background-tile", function(ev) {
		let tile = $(ev.target);
		if (tile.children().length == 0)
			return;

		let multistr = tile.children("multistructure");
		if (multistr.length > 0)
			tile = $("farm > farm-background-row:nth-child(" + multistr[0].dataset.x + ") > farm-background-tile:nth-child(" + multistr[0].dataset.y + ")");


		let schuur = tile.children("schuur");
		if (schuur.length > 0) {
			let index = tile.index();
			let pIndex = tile.parent().index();
			$("multistructure[data-x='" + (pIndex+1) + "'][data-y='" + (index+1) + "']").remove();
		}

		tile.children().remove();
		
	});

	openAnnuleerControls();

});




$("#knop-ploegen").on("click", (ev) => {
	$("farm").addClass("outline");

	$("farm").on("click", "farm-background-tile", function(ev) {
		let tile = $(ev.target);
		if (tile.children().length == 0)
			tile.addClass("farmland");
		
	});

	openAnnuleerControls();

});


function addOffTiles() {
	return $("farm-background-row:not(:first-child):not(:last-child) > farm-background-tile:not(:first-child):not(:last-child)").append("<farm-multi-hitbox class='isometric h3 w3'>");
}

$("#knop-bouwen").on("click", (ev) => {
	$("farm").addClass("grid");
	addOffTiles();

	$("farm").on("click", "farm-multi-hitbox", function(ev) {
		let hitbox = $(ev.target);
		let center = hitbox.parent();
		let index = center.index();
		let prevRow = center.parent().prev().children();
		let nextRow = center.parent().next().children();
		let tiles = [prevRow.eq(index - 1), prevRow.eq(index), prevRow.eq(index + 1), center.prev(), center, center.next(), nextRow.eq(index - 1), nextRow.eq(index), nextRow.eq(index + 1)];
		console.log(window.a = tiles);
		if (tiles.every(tile => !tile.hasClass("farmland") && tile.children(":not('farm-multi-hitbox')").length == 0)) {
			terug();
			schuur = $("<schuur><img src='img/schuur.png'/>").css("zIndex", index + center.parent().index());
			tiles.shift().append(schuur);
			for (let tile of tiles)
				tile.append("<multistructure data-x='" + center.parent().index() + "' data-y='" + index + "'>");
		}
		
	});

	openAnnuleerControls();

});




$("foodTipsFoods food").on("click", (ev) => {
	window.a = $(ev.target).closest("food");
	let soort = $(ev.target).closest("food").text().trim().toLowerCase();
	let varia = weetjes[soort];
	$("foodtipsinfo").html("<span>" + soort + "</span><br><br>" + varia.text);

	for (let naam in varia.info) {
		$("foodTipsSliders slider[data-name='" + naam + "'] inner").css("width", varia.info[naam] + "%");
	}
});