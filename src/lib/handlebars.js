const helpers = {};
const hb = require('handlebars');
const moment = require('moment');

hb.registerHelper('dateFormat', function(date, options) {
    const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "DD/MM/YYYY";
    const mes = moment.locale('es');
    moment.updateLocale(moment.locale(), { invalidDate: "Sin registro disponible"});
    return moment(date).format(formatToUse);
});

hb.registerHelper('isAdministrator', function (isAdmin) {
    if(isAdmin == "Administrador") { 
        return isAdmin == "Administrador";
     }
});

hb.registerHelper('isBasicUser', function(isBasic){
    if(isBasic == "Estándar") {
        return isBasic == "Estándar";
    }
});

hb.registerHelper("counter", function(index){
    return index + 1;
});

hb.registerHelper("CheckLengthMax", function(v1, v2, options){
    if(v1.length >= v2){
        return options.fn(this);
    }
});

hb.registerHelper("CheckLengthMin", function(v1, v2, v3, options){
    if(v1.length < v2 && v1.length >= v3){
        return options.fn(this);
    }
});

hb.registerHelper("CheckLengthZero", function(v1, v2, options){
    if(v1.length <= v2){
        return options.fn(this);
    }
});

hb.registerHelper("CurrentStatus", function(EstadoActual, v1){
    if(EstadoActual == v1){
        return EstadoActual = v1;
    }
});

hb.registerHelper("CurrentPage", function(PaginaActual, valueOne){
    if(PaginaActual == valueOne){
        return PaginaActual == valueOne;
    }
});

hb.registerHelper("Is", function(PaginaActual, valueOne){
    PaginaActual == valueOne;
    return PaginaActual == valueOne;
});

helpers.timeago = (timestamp) => {
    return format(timestamp, 'es_ES');
};

const { format, register } = require('timeago.js'); //Puede utilizar `import` para Javascript code.
/*const { serializeUser } = require('passport');
const { GetUserId } = require('./auth');
const { openSync } = require('fs');
const { userInfo } = require('os');*/

register('es_ES', (number, index, total_sec) => [
    ['Justo ahora', 'Ahora mismo'],
    ['Hace %s segundos', 'En %s segundos'],
    ['Hace 1 minuto', 'En 1 minuto'],
    ['Hace %s minutos', 'En %s minutos'],
    ['Hace 1 hora', 'En 1 hora'],
    ['Hace %s horas', 'En %s horas'],
    ['Hace 1 día', 'En 1 día'],
    ['Hace %s días', 'En %s días'],
    ['Hace 1 semana', 'En 1 semana'],
    ['Hace %s semanas', 'En %s semanas'],
    ['1 mes', 'en 1 mes'],
    ['Hace %s meses', 'En %s meses'],
    ['Hace 1 año', 'En 1 año'],
    ['Hace %s años', 'En %s años']
][index]);

const timeago = timestamp => format(timestamp, 'es_ES');

module.exports = helpers;