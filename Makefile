all: install
.PHONY: install

version := 0.1.1

install:
	deno compile --allow-read --allow-write --allow-env --unstable --output era src/main.ts

cross-build:
	deno compile --allow-read --allow-write --allow-env --unstable --output era --target x86_64-unknown-linux-gnu src/main.ts
	tar -czvf era-v${version}-x86_64-linux.tar.xz era
	deno compile --allow-read --allow-write --allow-env --unstable --output era --target x86_64-apple-darwin src/main.ts
	tar -czvf era-v${version}-x86_64-apple-darwin.tar.xz era
	deno compile --allow-read --allow-write --allow-env --unstable --output era --target aarch64-apple-darwin src/main.ts
	tar -czvf era-v${version}-aarch64-apple-darwin.tar.xz era
	rm era
