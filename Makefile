all: install
.PHONY: install

install:
	deno compile --allow-read --allow-write --allow-env --unstable main.ts

