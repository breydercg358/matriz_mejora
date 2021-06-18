// Llamada de diferentes plugins disponibles para NodeJS
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const bodyParser = require('body-parser');

// Llamada de distintos métodos de consulta a la BD dentro del archivo 'dynamic_queries.js'
const { getAreas, getDataPrioridad, getDataEstado, getDataFactor, getDataArea, getDataMes, TablaIndicadoresFactores, TablaIndicadoresTipos, TablaIndicadoresSedes, TablaIndicadoresPrioridades, TablaIndicadoresEstados, TablaIndicadoresAreas, NombreIndicadorAreas, AllIndicadorAreas, NombresAllIndicadorAreas, TablaIndicadorMes, DateRangePickerTI, methodResponsablesMeses, methodResponsablesPorcentajes} = require('./routes/dynamic_queries');

// Llamada del módulo 'database' dentro del archivo 'keys.js'
const { database } = require('./keys');

// Inicializaciones:
const app = express();
require('./lib/passport');

// Configuración:
app.set('port', process.env.PORT || 4201);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middleware:
app.use(session({
    secret: 'matrizsession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Variables globales:
app.use((req, res, next) => {
    app.locals.user_success = req.flash('user_success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Rutas:
app.use(require('./routes'));
app.use('/', require('./routes/links'));
app.use('/', require('./routes/authentication'));
app.use('/form_hallazgos/sede', getAreas);
app.use('/TablaIndicadores/FactoresDeRiesgo', TablaIndicadoresFactores);
app.use('/TablaIndicadores/TiposDeHallazgo', TablaIndicadoresTipos);
app.use('/TablaIndicadores/Sedes', TablaIndicadoresSedes);
app.use('/TablaIndicadores/Prioridades', TablaIndicadoresPrioridades);
app.use('/TablaIndicadores/Estados', TablaIndicadoresEstados);
app.use('/TablaIndicadores/Areas', TablaIndicadoresAreas);
app.use('/TablaIndicadores/SingleNombreSede', NombreIndicadorAreas);
app.use('/TablaIndicadores/AllAreas', AllIndicadorAreas);
app.use('/TablaIndicadores/NombresSedesIA', NombresAllIndicadorAreas);
app.use('/TablaIndicadores/Dates', TablaIndicadorMes);
app.use('/MatrizCharts/ChartPrioridadesHallazgos', getDataPrioridad);
app.use('/MatrizCharts/ChartEstadosHallazgos', getDataEstado);
app.use('/MatrizCharts/ChartFactoresHallazgos', getDataFactor);
app.use('/MatrizCharts/ChartAreasHallazgos', getDataArea);
app.use('/MatrizCharts/ChartMesesHallazgos', getDataMes);
app.use('/TablaIndicadores/DateRangeTI', DateRangePickerTI);
app.use('/TablaIndicadores/ResponsablesMesesTI', methodResponsablesMeses);
app.use('/TablaIndicadores/ResponsablesPorcentajesTI', methodResponsablesPorcentajes);

// carpeta Public:
app.use(express.static(('img_hallazgos')));
app.use(express.static(path.join(__dirname, 'public')));

// Iniciación del puerto 4201 para la aplicación:
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});