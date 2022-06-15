@app
begin-app

@http
/api/decklist
	method get
	src /api/decklist
/api/card
	method get
	src /api/card
/api/leaderboard
	method get
	src /api/leaderboard
/api/saltmine
	method post
	src /api/saltmine

@static
folder build
spa true

@aws
runtime nodejs16.x
