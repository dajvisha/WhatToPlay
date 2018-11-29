# CarbonLDP Project: What To Play

## Requisitos previos

Tener instalado:
* NodeJS y npm. 

## Como instalar el proyecto

```
npm install
```

## Como iniciar el proyecto

```
npm start
```

## Nota: Comunicación con IGDB.com

Dependiendo de sus configuraciones de red probablemente presente algunos problemas al comunicarse con IGDB.com, para solucionar este problema siga estas instrucciones en el navegador Google Chrome. 

1. Instalar la extensión [Allow-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi).
2. Dar clic al boton **Enable cross-origin resource sharing**.
3. En el campo **Intercepted URLs or URL patterns* eliminar la configuración por default y repranzarlo por **https://api-endpoint.igdb.com**.
4. En el archivo microserver.js configurar la llave para realizar peticiones a IGDB.com, esta llave se almacena en la variable **client**.
