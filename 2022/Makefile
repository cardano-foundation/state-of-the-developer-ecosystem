all: assets/js/app.min.js

assets/js/app.min.js: assets/js/app.js
	minify $^ > $@
	rm $^

assets/js/app.js:
	elm make --output $@ --optimize src/Main.elm

.PHONY.:
	clean watch

clean:
	rm -f assets/js/app.min.js
	rm -f assets/js/app.js

watch:
	elm-live -s index.html -y http://localhost:8000 -x /state-of-the-developer-ecosystem/2022 -- src/Main.elm --output=assets/js/app.min.js
