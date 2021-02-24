const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp, 'es_ES');
};

const { format, register } = require('timeago.js') //Puede utilizar `import` para Javascript code.

register('es_ES', (number, index, total_sec) => [
    ['Justo ahora', 'Ahora mismo'],
    ['Hace %s segundos', 'En %s segundos'],
    ['Hace 1 minuto', 'En 1 minuto'],
    ['Hace %s minutos', 'En %s minutos'],
    ['Hace 1 hora', 'En 1 hora'],
    ['Hace %s horas', 'En %s horas'],
    ['Hace 1 dia', 'En 1 dia'],
    ['Hace %s dias', 'En %s dias'],
    ['Hace 1 semana', 'En 1 semana'],
    ['Hace %s semanas', 'En %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['Hace %s meses', 'En %s meses'],
    ['Hace 1 año', 'En 1 año'],
    ['Hace %s años', 'En %s años']
][index]);

const timeago = timestamp => format(timestamp, 'es_ES');

module.exports = helpers;