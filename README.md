# Music App API RESTful

## 1. Resumen del proyecto

Este proyecto consiste en la creación de una API RESTful para una aplicación de música similar a Spotify. Las tecnologías o librerías usadas son: Node.js, MongoDB, Mongoose y Express. La API proporciona diversas funcionalidades para el manejo de usuarios, artistas, álbumes y canciones.

La API utiliza la autenticación de usuario mediante JWT y la encriptación de contraseñas mediante Bcrypt. Además, se utiliza el middleware Multer para la carga de imágenes y la validación de datos con Validator. La paginación se realiza con Mongoose Paginate y las pruebas unitarias con Jest. 

Con esta API RESTful, se puede implementar una aplicaciones parecida a Spotify (app musical) personalizada y escalable con facilidad.

## 2. Database design

La imagen muestra el diseño de la base de datos utilizado para esta API RESTful. La base de datos está diseñada utilizando MongoDB y consta de varias colecciones, incluyendo usuarios, artista, álbumes y canciones.

El diseño de la base de datos está pensado para permitir una fácil escalabilidad y un acceso rápido y eficiente a los datos.

<img src= "./database/MusicApp.jpg" alt="Database design- music App"  width="790" height="700" >