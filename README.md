# Agave JSON Mirror API

This is a simple API for querying and pretty-printing JSON objects via a
REST API.

## Building

Once set, build the Docker image manually or via the included Fig file.

```bash  
$ docker build --rm=true -t agaveapi/json-mirror .
```  

## Running  


```bash  
$ docker run -d --name json-mirror \
		 -p 3000:3000 \
		 agaveapi/json-mirror
```  

The API will be available at `http://<docker host>:3000`.

## Usage

The API works like pretty much every other prettyprinting service works. You send a POST
request to the API and it mirrors the JSON back to you.

```bash
curl -H "Content-Type: application/json" -X POST --data-binary '{"message": "Hello world"}' 'http://<docker host>.com:3000'

```  

You can also use JavaScript dot notation to return a portion of the POSTed JSON object.
This is handy when you don't have a viable JSON parser available (BASH, I'm talking to you!).

```bash
curl -X POST -H "Content-Type: application/json" \
		 --data-binary '{"foo": "manchu", "bar": "bara"}' \
		 'http://<docker host>:3000/?q=foo'
"manchu"
```

```bash
curl -X POST -H "Content-Type: application/json" \
		 --data-binary '{"foo": "manchu", "bar": "bara", "baz": ["one foo", "two foo", "red foo", "blue food"], "zap": { "boom": "here comes the"} }' \
		 'http://<docker host>:3000/?q=baz.[1]'
"two foo"
```


```bash
curl -X POST -H "Content-Type: application/json" \
		 --data-binary '[{"key":"foo","value":"manchu"},{"key":"bar":"value":"bara"},{"key":"baz","value":"zarre"}]' \
		 'http://<docker host>:3000/?q=baz.[].key'

```