const animaldb = require('../models/animals');

async function handleGetAnimal(req,res){
  const { gender = 'All', ageRange = 'all' } = req.query; 
  let filter = {};
  if (gender && gender !== 'All') {
      filter.gender = gender;
  }
  if (ageRange) {
      if (ageRange === 'under_9_months') {
          filter.age = { $lt: 9 };  
      } else if (ageRange === '9_months_to_6_years') {
          filter.age = { $gte: 9, $lte: 72 };
      } else if (ageRange === '6_years_plus') {
          filter.age = { $gt: 72 }; 
      }
  }
  try {
      const animals = await animaldb.find(filter);  
      res.render('animals', { 
          animals,
          gender,   
          ageRange,
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
}

module.exports = {handleGetAnimal};