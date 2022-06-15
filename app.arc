@app
begin-app

@http
/api/decklist
	method get
	src /api/decklist
/api/card
	method get
	src /api/card
/api/salt
	method post
	src /api/salt

@static
folder build
spa true

@aws
runtime nodejs16.x
