const db = require("../models");
const Tutorials = db.tutorials;

const Op = db.Sequelize.Op;
const getPagination = (page, size) =>{
    const limit = size ? + size:3 // the first size checks if the size is provided and if not the second size is set as a default
    const offset = page ? page * limit:10;

    return {limit,offset};
}
const getPagingData = (data, page, limit)=>{
    const {count:totalItems, rows:tutorials} = data;
    const currentPage = page ? + page:0;
    const totalPages = Math.ceil(totalItems/limit);

    return{totalItems, tutorials, totalPages, currentPage};
}


//create and save a new tutorial
exports.create = (req,res) =>{
    //validate request
    if(!req.body.title){
        res.status(400).send({
            message:"Title cannot be empty!"
        });
        return;
    }
    //create tutorial
    const tutorial= {
        title: req.body.title,
        description: req.body.title,
        published: req.body.published ? req.body.published:false
    };
    //save tutorial in database
    Tutorial.create(tutorial)
    .then(data =>{
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
            err.message || "An erroe occured while creating the tutotial"
        })
    })
}
//Retrieve all tutorials from the database.
exports.findAll = (req,res)=>{
    const {page, size, title} =req.query;
    var condition = title ? {title: {[Op.like]:`%${title}%`}}:null;

    const {limit, offset} = getPagination(page, size);
    Tutorial.findAndCountAll({where: condition, limit, offset})
    .then(data=>{
        const response = getPagingData(data, page, limit);
        res.send(response);
    })
    .catch(err=>{
        res.status(500).send({
            message:
            err.message || "An erroe occured while retrieving tutorials."
        })
    })
}