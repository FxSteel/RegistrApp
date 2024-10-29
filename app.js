const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para manejar la subida de datos y guardarlos en Excel
app.post('/api/save-data', (req, res) => {
    try {
        const { nombre, apellido, correo, rol, asignatura, fecha } = req.body;

        console.log('Datos recibidos:', req.body); // Para verificar los datos recibidos

        // Ruta donde se guardará el archivo
        const dirPath = path.join(__dirname, 'data2');

        // Verifica si la carpeta 'data2' existe, si no, se creará
        if (!fs.existsSync(dirPath)) {
            console.log('Creando carpeta data2...');
            fs.mkdirSync(dirPath);
        } else {
            console.log('La carpeta data2 ya existe.');
        }

        const filePath = path.join(dirPath, 'asistencia.xlsx');

        let workbook;

        // Verifica si el archivo ya existe
        if (fs.existsSync(filePath)) {
            console.log('El archivo asistencia.xlsx ya existe. Abriéndolo...');
            // Si el archivo existe, lo abre
            workbook = xlsx.readFile(filePath);
        } else {
            console.log('Creando un nuevo archivo asistencia.xlsx...');
            // Si no existe, crea un nuevo libro de trabajo
            workbook = xlsx.utils.book_new();
        }

        // Verifica si la hoja "Asistencia" ya existe
        let worksheet;
        if (workbook.Sheets["Asistencia"]) {
            console.log('La hoja Asistencia ya existe. Abriéndola...');
            worksheet = workbook.Sheets["Asistencia"];
        } else {
            console.log('Creando nueva hoja Asistencia con encabezados...');
            // Si no existe, crea una nueva hoja con los encabezados
            worksheet = xlsx.utils.aoa_to_sheet([['Nombre', 'Apellido', 'Correo', 'Rol', 'Asignatura', 'Fecha']]);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Asistencia'); // Añade la hoja si no existe
        }

        // Convierte los datos a una fila
        const newRow = [nombre, apellido, correo, rol, asignatura, fecha];
        // Obtiene los datos existentes
        const existingData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Añade la nueva fila a los datos existentes
        existingData.push(newRow);

        // Crea o actualiza la hoja con los nuevos datos
        worksheet = xlsx.utils.aoa_to_sheet(existingData);
        workbook.Sheets["Asistencia"] = worksheet; // Actualiza directamente la hoja

        // Guarda el archivo Excel
        console.log('Guardando el archivo asistencia.xlsx...');
        xlsx.writeFile(workbook, filePath);

        res.status(200).send('Datos guardados en Excel exitosamente');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).send('Error al guardar los datos');
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
