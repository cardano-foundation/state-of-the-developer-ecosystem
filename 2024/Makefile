all: assets/js/app.min.js

assets/js/app.min.js: assets/js/app.js
	terser $^ > $@
	rm $^

assets/js/app.js:
	elm make --output $@ --optimize src/Main.elm

.PHONY.:
	clean watch

clean: # Remove compilation artefacts
	rm -f assets/js/app.min.js
	rm -f assets/js/app.js

watch: # Start development server
	elm-live -s index.html -y http://localhost:8000 -x /state-of-the-developer-ecosystem/2024 -- src/Main.elm --output=assets/js/app.min.js

help: # Show help
	@grep -E '^[a-zA-Z0-9 -]+:.*#'  Makefile | sort | while read -r l; do printf "\033[1;32m$$(echo $$l | cut -f 1 -d':')\033[00m:$$(echo $$l | cut -f 2- -d'#')\n"; done
