const { getDashBoard, getAllCatalogs } = require("../controllers/dashaboard_controller");

const dashBoard_handler = async(req, res) => {
    try{
        const data = await getDashBoard();
        res.json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};
const getAllCatalogsHandler = async (req, res) => {
    try{
        const catalogs = await getAllCatalogs();
        res.status(200).json(catalogs);
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    dashBoard_handler,
    getAllCatalogsHandler

};