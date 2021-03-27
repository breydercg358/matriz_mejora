const { query } = require('../database');
const pool = require('../database');

module.exports = {
    getAreas: async (req, res) => {
        const selectedSede = req.query.id_sede;
        const query_areas = "SELECT * FROM tbl_areas WHERE id_sede = ?";
        await pool.query(query_areas, [selectedSede], (err, result1) => {
            if(err){
                return res.status(500).send(err);
            }
            res.send(result1);
        });
    },
    countHallazgos: async (req, res) => {
        const query_count = "SELECT COUNT(*) FROM tbl_hallazgos";
        await pool.query(query_count, (err, result2) => {
            if(err){
                return res.status(500).send(err);
            }
            res.send(result2);
        });
    }
}