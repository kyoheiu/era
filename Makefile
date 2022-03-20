all: install
.PHONY: install

install:
	deno compile --allow-read --allow-write --allow-env --unstable --output era src/main.ts

