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


loadFarm();

function setUpdatePlant(plant) {
	let soort = plant[0].dataset.soort;
	setTimeout(() => updatePlant(plant, (parseInt(plant[0].dataset.stadium) || 0) + 1), alleSoorten[soort].snelheid);
}
function updatePlant(plant, stadium) {
	stadium = parseInt(stadium);
	let soort = plant[0].dataset.soort;
	plant.children("img").attr("src", "img/" + soort + "/" + stadium + ".png");
	plant[0].dataset.stadium = stadium;
	if (alleSoorten[soort].stadia > stadium)
		setUpdatePlant(plant);
}

function newPlant(soort) {
	return $("<plant data-soort='" + soort + "'><img src='img/" + soort + "/1.png'>");
}

function openAnnuleerControls() {
	$("#mainControls").css("display", "none");
	$("#annuleerControls").css("display", "").on("click", () => {
		$("farm").removeClass("outline");
		$("farm").off("click");
		$("#mainControls").css("display", "");
		$("#annuleerControls").css("display", "none")
	});
}


let alleSoorten = {};
$(".knop-zaaien").each(function(_, knop) {
	let soort = knop.dataset.plant;
	let snelheid = parseInt(knop.dataset.snelheid);
	let stadia = parseInt(knop.dataset.stadia);
	alleSoorten[soort] = {
		snelheid: snelheid,
		stadia: stadia
	};

	$(knop).on("click", function(ev) {
		$("farm").addClass("outline");

		$("farm").on("click", "farm-background-tile", function(ev) {
			let tile = $(ev.target);
			if (!tile.hasClass("farmland"))
				return;
			if (tile.children().length > 0)
				return;

			let plant = newPlant(soort);
			tile.append(plant);
	
			setUpdatePlant(plant);
			
		});

		openAnnuleerControls();
	});
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

		
		if (soort == "appel") {
			if (!(plant[0].dataset.aantalGeoogst > 5)) {

				updatePlant(plant, alleSoorten.appel.stadia - 1);

				plant[0].dataset.aantalGeoogst = (parseInt(plant[0].dataset.aantalGeoogst) || 0) + 1;
				return;
			}

		}

		plant.remove();
		
	});

	openAnnuleerControls();

});




$("#knop-slopen").on("click", (ev) => {
	$("farm").addClass("outline");

	$("farm").on("click", "farm-background-tile", function(ev) {
		let tile = $(ev.target);
		if (tile.children("plant").length == 0)
			return;

		tile.children().remove();
		
	});

	openAnnuleerControls();

});




$("#knop-ploegen").on("click", (ev) => {
	$("farm").addClass("outline");

	$("farm").on("click", "farm-background-tile", function(ev) {
		let tile = $(ev.target);
		tile.addClass("farmland");
		
	});

	openAnnuleerControls();

});