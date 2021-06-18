// Llamada del módulo 'pool' para realizar consultas a la BD
const pool = require('../database');

module.exports = {
    // Código para enviar el nombre de las áreas una vez una sede ha sido seleccionada en el formulario de hallazgos:
    getAreas: async (req, res) => {
        // Consulta para seleccionar el identificador de la sede seleccionada
        const selectedSede = req.query.id_sede;
        // Consulta para obtener todas las áreas que posean el identificador en cuestión
        const query_areas = "SELECT * FROM tbl_areas WHERE id_sede = ?";
        // Ejecución de la consulta
        await pool.query(query_areas, [selectedSede], (err, ResultadoAreas) => {
            if(err){
                return res.status(500).send(err);
            }
            // Envío con la función 'send' de los datos obtenidos de la consulta
            res.send(ResultadoAreas);
        });
    },

    TablaIndicadoresFactores: async (req, res) => {
        var HallazgosIndicadorFactor = [];
        async function getIndicadorFactor(AllFactores){
                for(var i in AllFactores){
                    const Indicadores_Factor = Object.values(AllFactores[i]);
                    const QueryIndicadorFactor = await pool.query("SELECT COUNT(*) AS IndicadoresFactores FROM tbl_hallazgos WHERE factor_riesgo = ? UNION SELECT nombre_factor FROM tbl_factores WHERE nombre_factor = ?", [Indicadores_Factor, Indicadores_Factor]);
                    HallazgosIndicadorFactor.push(QueryIndicadorFactor);
                }
                res.send(HallazgosIndicadorFactor);
        }
        const AllFactores = await pool.query("SELECT nombre_factor FROM tbl_factores");
        getIndicadorFactor(AllFactores);
    },

    TablaIndicadoresTipos: async (req, res) => {
        var HallazgosIndicadorTiposHallazgo = [];
        async function getIndicadorTipos(AllTiposHallazgo){
            for(var i in AllTiposHallazgo){
                const Indicatores_Tipos = Object.values(AllTiposHallazgo[i]);
                const QueryIndicadorTipos = await pool.query("SELECT COUNT(*) AS IndicadoresTiposHallazgo FROM tbl_hallazgos WHERE tipo_hallazgo = ? UNION SELECT nombre_tipo FROM tbl_tipos_hallazgo WHERE nombre_tipo = ?", [Indicatores_Tipos, Indicatores_Tipos]);
                HallazgosIndicadorTiposHallazgo.push(QueryIndicadorTipos);
            }
            res.send(HallazgosIndicadorTiposHallazgo);
        }
        const AllTiposHallazgo = await pool.query("SELECT nombre_tipo FROM tbl_tipos_hallazgo");
        getIndicadorTipos(AllTiposHallazgo);
    },

    TablaIndicadoresSedes: async (req, res) => {
        var HallazgosIndicadorSedes = [];
        async function getIndicadorSedes(AllSedes){
            for(var i in AllSedes){
                const Indicadores_Sedes = Object.values(AllSedes[i]);
                const QueryIndicadorSedes = await pool.query("SELECT COUNT(*) AS IndicadoresSedes FROM tbl_hallazgos WHERE sede = ? UNION SELECT nombre_sede FROM tbl_sedes WHERE nombre_sede = ?", [Indicadores_Sedes, Indicadores_Sedes]);
                HallazgosIndicadorSedes.push(QueryIndicadorSedes);
            }
            res.send(HallazgosIndicadorSedes);
        }
        const AllSedes = await pool.query("SELECT nombre_sede FROM tbl_sedes");
        getIndicadorSedes(AllSedes);
    },

    TablaIndicadoresPrioridades: async (req, res) => {
        var HallazgosIndicadorPrioridades = [];
        async function getIndicadorPrioridades(AllPrioridades){
            for(var i in AllPrioridades){
                const Indicador_Prioridades = Object.values(AllPrioridades[i]);
                const QueryIndicadorPrioridades = await pool.query("SELECT COUNT(*) AS IndicadoresPrioridades FROM tbl_hallazgos WHERE prioridad = ? UNION SELECT nombre_prioridad FROM tbl_prioridades WHERE nombre_prioridad = ?", [Indicador_Prioridades, Indicador_Prioridades]);
                HallazgosIndicadorPrioridades.push(QueryIndicadorPrioridades);
            }
            res.send(HallazgosIndicadorPrioridades);
        }
        const AllPrioridades = await pool.query("SELECT nombre_prioridad FROM tbl_prioridades");
        getIndicadorPrioridades(AllPrioridades);
    },

    TablaIndicadoresEstados: async (req, res) => {
        HallazgosIndicadorEstados = [];
        async function getIndicadorEstados(AllEstados){
            for(var i in AllEstados){
                const Indicador_Estados = Object.values(AllEstados[i]);
                const QueryIndicadorEstados = await pool.query("SELECT COUNT(*) AS IndicadorEstados FROM tbl_hallazgos WHERE estado = ? UNION SELECT nombre_estado FROM tbl_estados WHERE nombre_estado = ?", [Indicador_Estados, Indicador_Estados]);
                HallazgosIndicadorEstados.push(QueryIndicadorEstados);
            }
            res.send(HallazgosIndicadorEstados);
        }
        const AllEstados = await pool.query("SELECT nombre_estado FROM tbl_estados");
        getIndicadorEstados(AllEstados);
    },

    TablaIndicadoresAreas: async (req, res) => {
        HallazgosIndicadorAreas = [];
        const SelectedIdSede = req.query.id_sede;
        async function getIndicadorAreas(AllAreas){
            for(var i in AllAreas){
                const Indicador_Areas = Object.values(AllAreas[i]);
                const IndicadorSedeAreas = Object.values(NombreSedeAreas[0]);
                const QueryIndicadorAreas = await pool.query("SELECT COUNT(id_hallazgo) AS IndicadorAreas FROM tbl_hallazgos WHERE area = ? AND sede = ? UNION SELECT nombre_area FROM tbl_areas WHERE nombre_area = ?", [Indicador_Areas, IndicadorSedeAreas, Indicador_Areas]);
                HallazgosIndicadorAreas.push(QueryIndicadorAreas);
            }
            res.send(HallazgosIndicadorAreas);
        }
        const AllAreas = await pool.query("SELECT nombre_area FROM tbl_areas WHERE id_sede = ?", [SelectedIdSede]);
        const NombreSedeAreas = await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [SelectedIdSede]);
        getIndicadorAreas(AllAreas, NombreSedeAreas);
    },
    NombreIndicadorAreas: async(req, res) =>{
        var SelectedNombreIdSede = req.query.id_sede;
        var DataNombreSede = [];
        const QuerySelectNombreSede = await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [SelectedNombreIdSede]);
        DataNombreSede.push(QuerySelectNombreSede);
        console.log(DataNombreSede);
        res.send(DataNombreSede);
    },

    AllIndicadorAreas: async (req, res) => {
        var AllHallazgosIndicadorAreas = [];
        var NombresSedesIA = []; 
        const AllSedesIA = await pool.query("SELECT id_sede FROM tbl_areas ORDER BY id_sede ASC");
        const AllAreasIA = await pool.query("SELECT nombre_area FROM tbl_areas ORDER BY id_sede ASC");

            for(var i = 0; i < AllSedesIA.length; i++){
                const ArrayNomSedesIA = Object.values(AllSedesIA[i]);
                const QueryNomSedesIA = await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [ArrayNomSedesIA]);
                NombresSedesIA.push(QueryNomSedesIA);
            }

            for(var i = 0; i < AllAreasIA.length; i++){
                const ArrayAreasIA = Object.values(AllAreasIA[i]);
                const ArraySedesIA = Object.values(AllSedesIA[i]);
                const ArraySedesDataNom = Object.values(NombresSedesIA[i][0]);
                const QuerySedesAreasIA = await pool.query("SELECT COUNT(*) AS IndicadorAllAreas FROM tbl_hallazgos WHERE area = ? AND sede = ? UNION SELECT nombre_area FROM tbl_areas WHERE nombre_area = ? AND id_sede = ?", [ArrayAreasIA, ArraySedesDataNom, ArrayAreasIA, ArraySedesIA]);
                AllHallazgosIndicadorAreas.push(QuerySedesAreasIA);
            }
        res.send(AllHallazgosIndicadorAreas); 
    },
    NombresAllIndicadorAreas: async(req, res) => {
        var AllNombresSedesIA = [];
        async function getNombresSedesIA(IdNomSedes){
            for(var i in IdNomSedes){
                const ArrayIdNomSedes = Object.values(IdNomSedes[i]);
                const QueryIdNomSedes = await pool.query("SELECT nombre_sede FROM tbl_sedes WHERE id_sede = ?", [ArrayIdNomSedes]);
                AllNombresSedesIA.push(QueryIdNomSedes);
            }
            res.send(AllNombresSedesIA);
        }
        const IdNomSedes = await pool.query("SELECT id_sede FROM tbl_areas ORDER BY id_sede ASC");
        getNombresSedesIA(IdNomSedes);
    },

    TablaIndicadorMes: async (req, res) => {
        var NumHallazgosDates = [];
        var NumMeses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for(var i = 0; i < NumMeses.length; i++){
            const ArrayNumMeses = NumMeses[i];
            const QueryIndicadorDates = await pool.query("SELECT COUNT(*) AS IndicadorDates FROM tbl_hallazgos WHERE MONTH(fecha) = ?", [ArrayNumMeses]);
            NumHallazgosDates.push(QueryIndicadorDates);
        }
        res.send(NumHallazgosDates);
    },

    // Código para contar el número de hallazgos totales por prioridades existentes:
    getDataPrioridad: async (req, res) => {
        
        const dataPrioridades = await pool.query("SELECT nombre_prioridad FROM tbl_prioridades");

        async function getPrioridades(dataPrioridades){
            var NumHallazgosPrioridad = [];
                    
                for(var i in dataPrioridades){
                    const ArrayDataPrioridades = Object.values(dataPrioridades[i]);
                    const QueryPrioridades = await pool.query("SELECT COUNT(id_hallazgo) AS ChartHallazgosPrioridad FROM tbl_hallazgos WHERE prioridad = ? UNION SELECT nombre_prioridad FROM tbl_prioridades WHERE nombre_prioridad = ?", [ArrayDataPrioridades, ArrayDataPrioridades]);
                    NumHallazgosPrioridad.push(QueryPrioridades);
                }
                res.send(NumHallazgosPrioridad);
        }
        getPrioridades(dataPrioridades);
    },

    getDataEstado: async (req, res) => {
        const dataEstados = await pool.query("SELECT nombre_estado FROM tbl_estados");

        async function getEstados(dataEstados){
            var NumHallazgosEstados = [];

                for(var i in dataEstados){
                    const ArrayDataEstados = Object.values(dataEstados[i]);
                    const QueryDataEstados = await pool.query("SELECT COUNT(id_hallazgo) AS ChartHallazgosEstado FROM tbl_hallazgos WHERE estado = ? UNION SELECT nombre_estado FROM tbl_estados WHERE nombre_estado = ?", [ArrayDataEstados, ArrayDataEstados]);
                    NumHallazgosEstados.push(QueryDataEstados);
                }
                res.send(NumHallazgosEstados);
        }
        getEstados(dataEstados);
    },

    getDataFactor: async (req, res) => {
        const dataFactores = await pool.query("SELECT nombre_factor FROM tbl_factores");

        async function getFactores(dataEstados){
            var NumHallazgosFactores = [];

            for(var i in dataEstados){
                const ArrayDataFactores = Object.values(dataEstados[i]);
                const QueryDataFactores = await pool.query("SELECT COUNT(id_hallazgo) AS ChartHallazgosFactor FROM tbl_hallazgos WHERE factor_riesgo = ? UNION SELECT nombre_factor FROM tbl_factores WHERE nombre_factor = ?", [ArrayDataFactores, ArrayDataFactores]);
                NumHallazgosFactores.push(QueryDataFactores);
            }
            res.send(NumHallazgosFactores);
        }
        getFactores(dataFactores);
    },

    getDataArea: async (req, res) =>{
        const ChartSelectedSede = req.query.id_sede;
        const DataAreas = await pool.query("SELECT nombre_area FROM tbl_areas WHERE id_sede = ?", [ChartSelectedSede]);

        async function getAreas(DataAreas){
            var NumHallazgosAreas = [];

            for(var i in DataAreas){

                const ArrayDataAreas = Object.values(DataAreas[i]);
                const QueryDataAreas = await pool.query("SELECT COUNT(id_hallazgo) AS ChartHallazgosAreas FROM tbl_hallazgos WHERE area = ? UNION SELECT nombre_area FROM tbl_areas WHERE nombre_area = ?", [ArrayDataAreas, ArrayDataAreas]);
                NumHallazgosAreas.push(QueryDataAreas);
            }
            res.send(NumHallazgosAreas);
        }
        getAreas(DataAreas);
    },

    getDataMes: async(req, res) => {
        var ChartHallazgosMes = [];
        var ChartMesesData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for(var i = 0; i < ChartMesesData.length; i++){
            const ArrayNumMesesChart = ChartMesesData[i];
            const QueryChartMeses = await pool.query("SELECT COUNT(*) AS ChartDates FROM tbl_hallazgos WHERE MONTH(fecha) = ?", [ArrayNumMesesChart]);
            ChartHallazgosMes.push(QueryChartMeses);
        }
        res.send(ChartHallazgosMes);
    },

    DateRangePickerTI: async(req, res) => {

        let getStartDateRange = req.query.dataStartTI;
        let getEndDateRange = req.query.dataEndTI;
        let getTableDBName = req.query.NombreDBTabla;
        let getHallazgosColumn = req.query.ColumnaHallazgos;
        let getMatrizColumn = req.query.ColumnaMatriz;

        let ArrayDateRangeTI = [];

        let QueryDatePickerIndicador = await pool.query("SELECT " + getMatrizColumn + " FROM " + getTableDBName);

        for(var i in QueryDatePickerIndicador){
            ArrayDateTI = Object.values(QueryDatePickerIndicador[i]);
            QueryResultDateRangeTI = await pool.query("SELECT COUNT(*) AS RangoFechaTI FROM tbl_hallazgos WHERE " + getHallazgosColumn + " = ? AND (fecha BETWEEN '" + getStartDateRange + "' AND '" + getEndDateRange + "')", [ArrayDateTI]);
            ArrayDateRangeTI.push(QueryResultDateRangeTI);
        }
        res.send(ArrayDateRangeTI);
        
    },

    methodResponsablesMeses: async(req, res) => {
        let QuerySelectedMonth = req.query.SelectedMonth;
        let QuerySelectResponsablesMeses = await pool.query("SELECT nombre_responsable FROM tbl_responsables");
        let DataResponsablesMeses = [];

        for(let i = 0; i < QuerySelectResponsablesMeses.length; i++){
            let ArrayResponsablesMeses = Object.values(QuerySelectResponsablesMeses[i]);
            let ReplaceLikeResponsable = '%' + ArrayResponsablesMeses + '%';
            let QueryResponsablesMeses = await pool.query("SELECT COUNT(*) AS ResponsablesMeses FROM tbl_hallazgos WHERE responsable LIKE ? AND (fecha BETWEEN '2021-" + QuerySelectedMonth + "-01' AND '2021-" + QuerySelectedMonth + "-31') UNION SELECT nombre_responsable FROM tbl_responsables WHERE nombre_responsable = ?", [ReplaceLikeResponsable, ArrayResponsablesMeses]);
            DataResponsablesMeses.push(QueryResponsablesMeses);
        }
        res.send(DataResponsablesMeses);
    },

    methodResponsablesPorcentajes: async(req, res) => {
        let QuerySelectedPercenteage = req.query.NombreDeCumplimiento;
        let QueryStartDatePorcentaje = req.query.startDatePorcentaje;
        let QueryEndDatePorcentaje = req.query.endDatePorcentaje;
        let QueryDatePickerPorcentaje = req.query.valueBtnFechaPorcentaje;
        let QuerySelectResponsablesPorcentajes = await pool.query("SELECT nombre_responsable FROM tbl_responsables");
        let DataResponsablesPorcentajes = [];

        if(QueryStartDatePorcentaje != undefined && QueryEndDatePorcentaje != undefined){
            for(var i = 0; i < QuerySelectResponsablesPorcentajes.length; i++){
                let ArrayResponsablesPorcentajesFecha = Object.values(QuerySelectResponsablesPorcentajes[i]);
                let ReplaceLikeResponsablePFecha = '%' + ArrayResponsablesPorcentajesFecha + '%';
                let QueryResponsablesPorcentajesFecha = await pool.query("SELECT COUNT(*) AS ResponsablesPorcentajesFecha FROM tbl_hallazgos WHERE responsable LIKE ? AND estado = ? AND (fecha BETWEEN '" + QueryStartDatePorcentaje + "' AND '" + QueryEndDatePorcentaje + "') UNION SELECT nombre_responsable FROM tbl_responsables WHERE nombre_responsable = ?", [ReplaceLikeResponsablePFecha, QueryDatePickerPorcentaje, ArrayResponsablesPorcentajesFecha]);
                DataResponsablesPorcentajes.push(QueryResponsablesPorcentajesFecha);
            }
        }else if(QueryStartDatePorcentaje === undefined && QueryEndDatePorcentaje === undefined){
            for(var i = 0; i < QuerySelectResponsablesPorcentajes.length; i++){
                let ArrayResponsablesPorcentajes = Object.values(QuerySelectResponsablesPorcentajes[i]);
                let ReplaceLikeResponsableP = '%' + ArrayResponsablesPorcentajes + '%';
                let QueryResponsablesPorcentajes = await pool.query("SELECT COUNT(*) AS ResponsablesPorcentaje FROM tbl_hallazgos WHERE responsable LIKE ? AND estado = ? UNION SELECT nombre_responsable FROM tbl_responsables WHERE nombre_responsable = ?", [ReplaceLikeResponsableP, QuerySelectedPercenteage, ArrayResponsablesPorcentajes]);
                DataResponsablesPorcentajes.push(QueryResponsablesPorcentajes);
            }
        }
        res.send(DataResponsablesPorcentajes);
    }
}