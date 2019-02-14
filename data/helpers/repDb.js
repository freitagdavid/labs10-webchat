const db = require('../db.js');
 
module.exports = {
  get,
  getById,
  insert,
  update,
  remove,
};

function get(){
        return db('representatives');
}

function getById(id){
const query = db('representatives').where('id', id);

    return query.then(representatives => {
            return representatives[0];
    });
}

function insert(user) {
  return db('representatives')
    .insert(user).returning('id').then(ids => ids[0]);
}


function update(id, user){
        return db('representatives')
               .where({id: Number(id)})
               .update(user);
}

function remove(id){
        return db('representatives')
               .where({id: Number(id)})
               .del();
}