const { getCategories, getCategoryById, createCategory, deleteCategory } = require("../controllers/category_controller");


const getAllCategories = async (req, res) => {
    try{
        const categories =  await getCategories();
        res.json(categories);
    }catch (error){
        res.status(500).json({error: error.message});
    }
};

const getCategoryById_handler = async (req,res) => {
    try{
        const category = await getCategoryById(req.params.id);
        if(!category) return res.status(404).json({error: "categoria no encontrada"});

        res.json(category);
    }catch (error){
        res.status(500).json({error: error.message});
    }
};

const createCat_handler = async (req,res) => {
    try {
        const newCategory = await createCategory(req.body);
        res.status(201).json(newCategory);

    }catch(error){
        res.status(500).json({error: error.message});
    }
}

const deleteCat_handler = async(req,res) => {
    try{
        const result = await deleteCategory(req.params.id);
        res.json(result);
    }catch(error){
        res.status(500)({error: error.message});
    }
};

module.exports = {
    createCat_handler,
    getAllCategories,
    getCategoryById_handler,
    deleteCat_handler,
}
