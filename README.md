
### Getting Started
This plugin requires node `>= 6.0.0` and npm `>= 1.4.15` (latest stable is recommended).


### NPM Module Installation

```shell
> npm install boodskap-api-adapter --save
```

#### How it works?

```shell
var BoodskapAPI = require('boodskap-api-adapter');

var config = {
    apiUrl:"https://api.boodskap.io",
    domainKey:"",
    apiKey:""
}

# new BoodskapAPI(config, token);
# if you have already logged in pass the <TOKEN> to the boodskap api adapter


var boodskap = new BoodskapAPI(config, <TOKEN_OPTIONAL>)

#Execute login call

boodskap.login('<USER_NAME>','<PASSWORD>', function (status, data) {
    console.log(status)
    console.log(data)
})


```


