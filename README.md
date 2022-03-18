# era
v0.1.0  
A clock with rain.

![sample gif](gif/sample.gif)

## Usage
First, git clone and install era.
```
git clone https://github.com/kyoheiu/era
cd era
deno compile --allow-read --allow-write --allow-env main.ts
```
Then,
```
./era
```
makes config.json in your CONFIG_HOME/era/ and there appears a rainy clock.

## Customization
`config.json` looks like this:
```
{"interval":100,"frequency":40,"rain1":"│","rain2":" "}
```

`interval` means how often the screen is updated (or, how fast the rain falls).  
If `frequency` goes bigger, the rain drops reduces.  
`rain1` and `rain2` are characters for rain drops. By default `rain2` is empty, so rain drops is expressed by `rain1` (|). Of course you can change the shape of rain drops!
