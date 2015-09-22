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

```
curl -H "Content-Type: application/json" -X POST --data-binary '{"message": "Hello world"}' 'http://<docker host>.com:3000'
{
  "message": "Hello world"
} 

```

### Filtering response

You can also use JavaScript dot notation to return a portion of the POSTed JSON object.
This is handy when you don't have a viable JSON parser available (BASH, I'm talking to you!).


```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[0].name'
"Morales Griffin"

``` 

```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[].name'
[
  "Morales Griffin",
  "Blanche Francis",
  "Patsy Newton",
  "Denise Vincent",
  "Reyes Ross",
  "Mildred Coffey",
  "Lula Kline"
]
```

```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[0].friends.[1]'
{
  "id": 1,
  "name": "Golden Wilcox"
}
```

### Controlling spacing

You can control spacing with the `spaces` query parameter. It is set to 2 by default.


```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[0].friends.[1]&spaces=4'
{
    "id": 1,
    "name": "Golden Wilcox"
}
```  

Setting `spaces` to 0 essentially removes pretty printing.

```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[0].friends.[1]&spaces=0'
{"id":1,"name":"Golden Wilcox"}
``` 

### Stripping quotes

You can strip quotes on primary and list responses with the `strip` query parameter. Any truthy value will do.

```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[0].name&strip=true'
Morales Griffin

``` 

```  
curl --globoff -X POST -H "Content-Type: application/json" \
		 -d "$(cat test/testdata.json)" \
		 'http://<docker host>:3000/?q=[].name&strip=true'
Morales Griffin
Blanche Francis
Patsy Newton
Denise Vincent
Reyes Ross
Mildred Coffey
Lula Kline
```



