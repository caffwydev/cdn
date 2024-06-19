repeat
	wait();
until game:IsLoaded();
_G["Fumo Blox Fruit - HoHo Hub Kaitun V3"] = {
	MAIN_UI_COLOR = Color3.fromRGB(174, 75, 255),
	BlackScreen = false,
	FastMode = true,
	AutoRejoinGame = 1800,
	GetFruitInWorld = true,
	AutoTeam = "Pirate",
	GetMelees = {
		"Superhuman",
		"Death Step",
		"Sharkman Karate",
		"Electric Claw",
		"Dargon Talon",
		"Godhuman"
	},
	Redeem_X2EXP_on = 10,
	Character_Config = {
		InvisFromKen = true,
		NoStun = true
	},
	ListFruitTake = {
		"Ice-Ice",
		"Light-Light",
		"Spider-Spider",
		"Magma-Magma",
		"Rumble-Rumble",
		"Quake-Quake",
		"Buddha-Buddha",
		"Shadow-Shadow",
		"Portal-Portal",
		"Blizzard-Blizzard",
		"Dough-Dough",
		"Venom-Venom",
		"Spirit-Spirit",
		"Leopard-Leopard",
		"Mammoth-Mammoth",
		"Kitsune-Kitsune"
	},
	BuyBetterFruit = true,
	EatFruitWhenSea3 = false,
	AwakeFruit = true,
	AutoBuy = {
		Shop_Items = true,
		All_Haki = true,
		Legendary_Swords = true,
		Ectoplasm_Items = true
	},
	AutoItems = {
		["Second Sea"] = {
			"Kabucha",
			"Rengoku",
			"Acidum Rifle",
			"Dark Coat"
		},
		["Third Sea"] = {
			"Cursed Dual Katana",
			"Soul Guitar",
			"Rainbow Haki",
			"Hallow Scythe",
			"Tushita",
			"Yama",
			"AutoElite",
			"AutoRipIndra"
		}
	},
	Deep_Config = {
		["Ectoplasm Farm"] = {
			Enabled = true,
			FarmUntil = 350
		},
		["Dark Beard Drop Farm"] = true,
		["Full 3 Leg Sword and True Triple Katana"] = false
	},
	HopServerFarm = true,
	StopRaidWhenGetEnoughFrag = 10000,
	PVP_FARM = true,
	ShowAccountInfo = false
};
_G.BypassTeleport = false;
_G.SupperFixLag = true;
(loadstring(game:HttpGet("https://raw.githubusercontent.com/acsu123/HohoV2/main/ScriptLoad.lua")))();
