const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para manejar la subida de datos y guardarlos en Excel
app.post('/api/save-data', (req, res) => {
    try {
      const { nombre, apellido, correo, rol } = req.body;
  
      // Crea un nuevo libro de trabajo
      const workbook = xlsx.utils.book_new();
  
      // Crea una hoja con los datos del usuario
      const data = [
        ['Nombre', 'Apellido', 'Correo', 'Rol'],
        [nombre, apellido, correo, rol]
      ];
      const worksheet = xlsx.utils.aoa_to_sheet(data);
  
      // Añade la hoja al libro de trabajo
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
  
      // Ruta donde se guardará el archivo
      const filePath = path.join(__dirname, 'data', 'usuarios.xlsx');
  
      // Guarda el archivo Excel
      xlsx.writeFile(workbook, filePath);
  
      res.status(200).send('Datos guardados en Excel exitosamente');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      res.status(500).send('Error al guardar los datos');
    }
  });
  

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
