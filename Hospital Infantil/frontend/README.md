# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


1-Qué es el proyecto.
-El proyecto consiste en el desarrollo de una aplicaciòn web informática para un hospital infantil, cuyo objetivo principal es registrar y administrar la información de los pacientes que ingresan al hospital provenientes de diferentes hospitales de origen.
La aplicación permitirá almacenar, consultar, actualizar y eliminar la información de los pacientes de manera ordenada y segura, utilizando una base de datos relacional.

2-Qué necesita para funcionar
-Software requerido
XAMPP
Incluye:
Apache (servidor web), MySQL (base de datos), PHP (compatible con Laravel 12).
-Visual Studio Code
Editor de código utilizado para el desarrollo y ejecución del proyecto.
-Node.js
Necesario para la gestión de dependencias y ejecución del frontend con Vue.js. Se recomienda utilizar una versión compatible con Vite (Node.js 20.19 o superior).
-Laravel 12
Framework backend utilizado para la lógica del servidor y la conexión con la base de datos.
-Vue.js
Framework frontend utilizado para la interfaz de usuario.
Administrador de paquetes, npm (incluido con Node.js)
-Navegador web moderno
Google Chrome, Microsoft Edge, Firefox u otro navegador actualizado, para acceder a la aplicación mediante la URL local.
-Ubicación del proyecto
El proyecto debe encontrarse dentro del directorio raíz de XAMPP, siguiendo la estructura:
C:\xampp\htdocs\Hospital Infantil
Desde esta ubicación se ejecutarán los comandos necesarios para iniciar tanto el backend como el frontend del sistema.

3-Cómo instalar dependencias.
-Para el correcto funcionamiento del proyecto es necesario instalar las dependencias tanto del backend como del frontend. Dicho proceso se realiza desde la terminal integrada de Visual Studio Code.
-Las dependencias del backend, desarrollado con Laravel 12, se instalan accediendo a la carpeta backend y ejecutando el gestor de dependencias Composer, el cual descarga todas las librerías necesarias definidas en el proyecto. Por su parte, las dependencias del frontend, desarrollado con Vue.js, se instalan accediendo a la carpeta frontend y utilizando npm install o yarn install, que se encarga de instalar los paquetes requeridos para la correcta ejecución de la interfaz de usuario.

4-Cómo ejecutar la aplicación
Para ejecutar correctamente la aplicación es necesario iniciar de manera independiente el backend y el frontend, ya que ambos funcionan como servicios separados.

-En primer lugar, para ejecutar el backend desarrollado con Laravel 12, se debe acceder desde la terminal a la carpeta backend del proyecto y ejecutar el servidor de desarrollo de Laravel. Al finalizar este proceso, el sistema generará automáticamente una URL local, la cual deberá abrirse en el navegador web para visualizar el funcionamiento del backend.
PS C:\xampp\htdocs\Hospital Infantil> cd backend 
PS C:\xampp\htdocs\Hospital Infantil\backend> php artisan serve
 [http://127.0.0.1:8000].  

-En segundo lugar, para ejecutar el frontend desarrollado con Vue.js, se debe acceder desde la terminal a la carpeta frontend del proyecto y ejecutar el servidor de desarrollo correspondiente. Al igual que en el backend, una vez iniciado el servicio se generará automáticamente una URL local, la cual permitirá visualizar la interfaz de usuario de la aplicación en el navegador web.
PS C:\xampp\htdocs\Hospital Infantil> cd frontend 
PS C:\xampp\htdocs\Hospital Infantil\frontend> npm run dev
Local:   http://localhost:5173/