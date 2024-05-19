const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const MIN_AGE_DAYS = parseInt(process.env.MIN_AGE_DAYS) || 5475;

exports.getPersons = (req, res, next) => {
    const accessFilePath = path.join(__dirname, '../data/access.json');
    const filePath = path.join(__dirname, '../data/persons.json');

    // Función para obtener la fecha y la hora actual
    const getCurrentDateTime = () => {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    };

    // Leer el contenido del archivo access.json
    fs.readFile(accessFilePath, 'utf8', (err, data) => {
        let accessLogs = []; // Arreglo para almacenar los registros de acceso

        if (!err) {
            try {
                accessLogs = JSON.parse(data); // Parsear el contenido JSON
            } catch (error) {
                console.error('Error al parsear el archivo access.json:', error);
            }
        }

        // Añadir el nuevo registro al arreglo
        accessLogs.push({ datetime: getCurrentDateTime() });

        // Escribir el arreglo actualizado en el archivo access.json
        fs.writeFile(accessFilePath, JSON.stringify(accessLogs, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo access.json:', err);
            }
        });
    });

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return next(err);
        }

        const jsonData = JSON.parse(data);
        const persons = jsonData.persons; // Acceder a la propiedad "persons"

        // Verificar si se proporcionó un parámetro de filtro
        const minAgeParam = parseInt(req.query.minAge);
        let filteredPersons = persons;
        let minAge = MIN_AGE_DAYS;

        if (minAgeParam) {
            // Filtrar personas con edad superior al mínimo especificado en el parámetro
            filteredPersons = persons.filter(person => {
                const birthdate = moment().subtract(person.age, 'years');
                const daysDiff = moment().diff(birthdate, 'days');
                return daysDiff > minAgeParam;
            });
            minAge = minAgeParam;
        }

        // Si se solicita el JSON completo, enviarlo como respuesta JSON
        if (req.headers.accept === 'application/json') {
            return res.json({ persons: persons });
        }

        // Renderizar la vista con el JSON completo y las personas filtradas
        res.render('persons', { persons: persons, filteredPersons: filteredPersons, minAge: minAge });
    });
};


