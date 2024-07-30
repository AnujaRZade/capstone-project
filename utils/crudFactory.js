
const checkInput = function(req, res, next){
    const userDetails=req.body
    const isEmpty = Object.keys(userDetails).length===0;
    if(isEmpty){
        res.status(400).json({
            status:400,
            message:"Body cannot be empty",
        })
    }else{
        next();
    }
}

const createFactory = (elementModel) => async (req, res) => {
    try {
        const elementDetails = req.body;
        console.log(elementDetails);
        const isEmpty = Object.keys(elementDetails).length === 0;
        if (!isEmpty) {
            const data = await elementModel.create(elementDetails);
            res.status(200).json({
                status: 200,
                message: "Data created",
                data: data,
            })
        } else {
            throw new Error("No data provided");
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

const getElementByIdFactory = (elementModel) => async (req, res) => {
    try {
        const { id } = req.params;
        const data =await elementModel.findById(id);
        if(data== undefined){
            throw new Error("not data found");
        }
        else{
            res.status(200).json({
                message: "data found",
                data: data,  
            })
        }


    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}
const updateElementFactory=(elementModel)=> async(req,res) =>{
    try{
        const { id }=req.params;
        const elementDetails= req.body;
        const isEmpty = Object.keys(elementDetails).length === 0;
        if (!isEmpty) {
            const data = await elementModel.findByIdAndUpdate(id, elementDetails, { new: true })
            res.status(200).json({
                status: 200,
                message: "Data created",
                data: data
            })
        } else {
            throw new Error("No data provided");
        }
    } catch (err) {
        res.status(500).json({
            message: "error "
        })
    }
}


const getAllFactory=(elementModel)=>async(req,res)=>{
    try {
        
        const data =await elementModel.find();
        if(data == undefined){
            throw new Error("not data found");
        }
        else{
            res.status(200).json({
                message: "data found",
                data: data,  
            })
        }


    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}
const deleteElementByIdFactory = (elementModel) => async (req, res) => {
    try {
        const { id } = req.params;
        const data = await elementModel.findByIdAndDelete(id);
        if (data) {
            res.status(200).json({
                message: "Data deleted",
                data: data,
            })
        } else {
            throw new Error("No data found");
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
}
module.exports = {
   checkInput, createFactory, getElementByIdFactory, getAllFactory, deleteElementByIdFactory,updateElementFactory,
}