all: install
.PHONY: install

install:
	deno compile --allow-read --allow-write --allow-env --unstable --output era src/main.ts

cross:
	deno compile --allow-read --allow-write --allow-env --unstable --output era-v-x86_64-linux --target x86_64-unknown-linux-gnu src/main.ts
	deno compile --allow-read --allow-write --allow-env --unstable --output era-v-x86_64-apple-darwin --target x86_64-apple-darwin src/main.ts
	deno compile --allow-read --allow-write --allow-env --unstable --output era-v-aarch64-apple-darwin --target aarch64-apple-darwin src/main.ts
	tar -czvf era-v-x86_64-linux.tar.xz era-v-x86_64-linux
	tar -czvf era-v-x86_64-apple-darwin.tar.xz era-v-x86_64-apple-darwin
	tar -czvf era-v-aarch64-apple-darwin.tar.xz era-v-aarch64-apple-darwin
	rm era-v-x86_64-linux era-v-x86_64-apple-darwin era-v-aarch64-apple-darwin
