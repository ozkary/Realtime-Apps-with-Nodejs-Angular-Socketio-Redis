module.exports.init = function (app) {
    
    //set the global error handler
    app.use(function (err, req, res, next) {
        
    if (res.headersSent) {
        return next(err);
    }
    
    if (err){
        console.log('error handler',err)
        res.status(500);
        res.send( { error: err });
    }

    next();
    
    });


    // logs every request
    app.use(function(req, res, next){
        // output every request in the array
        console.log({method:req.method, url: req.url, device: req.device});

        // goes onto the next function in line
        next();
    });

}
    