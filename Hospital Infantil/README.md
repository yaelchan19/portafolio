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
nfo
5-Qué funcionalidades tiene el sistema.
-El sistema está organizado en módulos que permiten administrar por completo la información de los pacientes y de los hospitales de origen.
-Gestión de pacientes: permite listar, registrar, consultar, actualizar y eliminar pacientes. Cada paciente se relaciona con el hospital del que proviene, y puede tener uno de tres estados: activo, dado de alta o baja.
-Gestión de hospitales: permite listar, registrar, editar y eliminar hospitales de origen. Al editar o eliminar un hospital, el sistema actualiza o elimina automáticamente los pacientes asociados mediante transacciones, para evitar errores de integridad referencial.
-Generación de PDF: permite descargar o previsualizar un reporte individual por paciente y un reporte general con todos los pacientes, generados con la librería DomPDF.
-Estadísticas: el sistema calcula totales de pacientes, distribución por estado, por sexo, por hospital y por rango de edad, así como el total de hospitales y su distribución por ciudad.
-Interfaz web: el backend también incluye vistas Blade con Bootstrap 5 para el uso directo desde el navegador (por ejemplo, el listado de pacientes y el dashboard de hospitales).

6-Cómo está estructurado el proyecto.
-El proyecto está dividido en dos carpetas independientes que funcionan como dos servicios separados:
-Carpeta backend: contiene la aplicación Laravel 12, es decir, la lógica del servidor, los modelos, los controladores, las rutas, las migraciones, las vistas Blade y la conexión con la base de datos.
-Carpeta frontend: contiene la aplicación Vue.js con Vite, es decir, la interfaz de usuario que consume la API del backend mediante Axios.
-Dentro del backend, el código se organiza en app/Models (modelos Paciente, Hospital y User), app/Http/Controllers (controladores PacienteController, HospitalController y PacientePDFController), routes (rutas web.php y api.php) y resources/views (vistas Blade, incluidas las vistas de PDF).

7-Tecnologías utilizadas.
-Backend: PHP 8.2 o superior con Laravel 12.
-Generación de PDF: barryvdh/laravel-dompdf.
-Autenticación por token de API: Laravel Sanctum.
-Base de datos: MySQL.
-Frontend: Vue.js 3, Vue Router, Axios y Vite como empaquetador.
-Entorno de desarrollo: XAMPP (Apache y MySQL) sobre Windows, con Visual Studio Code como editor.

8-Estructura de la base de datos.
-La base de datos se llama hospital_infantil y contiene las siguientes tablas principales:
-Tabla hospitales: almacena los hospitales de origen. Sus campos son nombre_hospital, ciudad, telefono y fecha_creacion.
-Tabla pacientes: almacena los pacientes. Sus campos son nombre_completo, edad, sexo, fecha_nacimiento, ciudad_origen, fecha_inscripcion, hospital, nombre_tutor, telefono_tutor y estado.
-Tabla users: tabla estándar de Laravel para los usuarios del sistema.
-La relación entre pacientes y hospitales se realiza por el nombre del hospital: el campo hospital de la tabla pacientes corresponde al campo nombre_hospital de la tabla hospitales. Por este motivo, al cambiar el nombre de un hospital el sistema también actualiza el campo hospital de sus pacientes.

9-Rutas y endpoints principales.
-Rutas web (se acceden desde el navegador, en la URL del backend):
-/pacientes muestra el listado y la gestión de pacientes.
-/hospitales muestra el dashboard de hospitales.
-/pacientes/pdf/individual/{id} genera y descarga el PDF de un paciente.
-/pacientes/pdf/general genera y descarga el PDF con todos los pacientes.
-Endpoints de la API (se consumen desde el frontend, con el prefijo /api):
-GET /api/pacientes devuelve todos los pacientes.
-POST /api/pacientes registra un nuevo paciente.
-GET /api/pacientes/{id} devuelve un paciente específico.
-PUT /api/pacientes/{id} actualiza un paciente.
-DELETE /api/pacientes/{id} elimina un paciente.
-PATCH /api/pacientes/{id}/cambiar-estado cambia únicamente el estado del paciente.
-GET /api/pacientes/estadisticas/totales devuelve las estadísticas generales.
-Los endpoints de hospitales se exponen automáticamente con apiResource (GET, POST, PUT y DELETE sobre /api/hospitales).

10-Autenticación y consideraciones actuales.
-El sistema incluye las rutas de registro, inicio de sesión y cierre de sesión, y el frontend envía el token de acceso en cada petición mediante un interceptor de Axios. Sin embargo, la lógica de registro e inicio de sesión todavía está pendiente de implementar en el backend, ya que sus controladores y sus vistas correspondientes aún no están desarrollados. La base para la autenticación por token ya está instalada a través de Laravel Sanctum.