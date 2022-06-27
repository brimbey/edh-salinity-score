@app
begin-app

@http
/api/import
	method get
	src /api/import
/api/card
	method get
	src /api/card
/api/leaderboard
	method get
	src /api/leaderboard
/api/flush
	method get
	src /api/flush
/api/persist
	method post
	src /api/persist

@static
folder build
spa true

@aws
runtime nodejs16.x

@tables
data 
	scopeID *String
	dataID *String
	salt **Number
	commanders
	ttl TTL
