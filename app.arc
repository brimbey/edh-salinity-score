@app
begin-app

@http
/api/decklist
	method get
	src /api/decklist
/api/card
	method get
	src /api/card

@static
folder build
spa true
