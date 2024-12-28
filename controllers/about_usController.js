function handleGetAboutUs(req, res){
    return res.status(200).render('About_Us');
}

module.exports = {handleGetAboutUs};