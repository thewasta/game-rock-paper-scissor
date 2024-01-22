# NestJS + Socket.IO & Vite + ReactJS

Juego para probar el funcionamiento de NestJS con Socket.IO en el backend, manejo de las sesiones
escucha de eventos y emisión eventos. Aún quedó mucho por abordar, como podría ser el streaming de contenido
manteniendo al cliente siempre recibiendo datos como podría ser subida/descarga de archivo, emisión de un vídeo, vídeollamada.

En parte de ReactJS quise usar Vite para probar las novedades y cambios con respecto al resto.
Dentro de la carpeta ``apps`` encontraremos las carpetas del _client_ y del _server_.

### Deploy
[Render.com](https://render.com) para la aplicación web y [upstash](https://upstash.com/) para el redis
#### Paso 1:
````shell
pnpm build
````
Esto hará uso de [turbo repo](https://turbo.build/) para transpilar tanto el TypeScript del _client_ como del _server_ creando la carpeta _dist_.
El back se encargará de servir los archivos estáticos del **client** ([más información](https://docs.nestjs.com/recipes/serve-static)).
#### Paso 2:
````shell
pnpm start
````

Se encarga de ejecutar el ``main.js`` del _server_.

### Página de Inicio
Una vez dentro el usuario tendrá los datos del histórico de sus partidas, estos datos se almacenan en Redis y se le asignan
por la cookie autogenerada cuando el usuario accede a la web, la cookie tiene un tiempo de vida de 30 días, pasados esos días
se genera una nueva.

![Pagina Inicio](https://raw.githubusercontent.com/thewasta/game-rock-paper-scissor/main/images/Screenshot_11.png)

Cuando el usuario presiona en el botón ``Nueva Partida`` se inicia la búsqueda de partida priorizando si hay otro usuario
con una partida ya creada pero sin iniciar. Si no se encuentran partidas se creará una nueva y se queda a la espera de que
alguien se una a la partida.

![Nueva Partida](https://raw.githubusercontent.com/thewasta/game-rock-paper-scissor/main/images/Screenshot_12.png)

Cuando un usuario se une ambos tienen un tiempo de **3 segundos** para decidir si aceptar la partida o continuar, aunque
en cualquier momento durante la misma se puede abandonar.

![Inicio de partida](https://raw.githubusercontent.com/thewasta/game-rock-paper-scissor/main/images/Screenshot_13.png)

El lado izquierdo es siempre el lado del usuario 'actual' y el lado derecho será del contrincante.
Cuando la partida acaba se muestra un ``alert()`` con el resultado de la partida y cerrando la partida para ambos jugadores.
Además, se guarda en Redis el resultado de la misma.