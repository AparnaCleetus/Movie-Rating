var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/vidzy');

router.get('/', function(req, res, next) {
  res.redirect('/videos');
});

router.get('/videos', function(req, res) {
    var title_q = req.query.title;
    var genre_q = req.query.genre;
    var collection = db.get('videos');
    if(title_q!=null){
        if(genre_q!=''){
            collection.find({
            title: new RegExp(title_q,'i') ,
            genre: genre_q
        }, function(err, videos){
            if(err) throw err;
                    res.render('index', { videos: videos})
             });
        }
        else{
            collection.find({
            title: new RegExp(title_q,'i') 
            }, function(err, videos){
                if(err) throw err;
                    res.render('index', {videos: videos})
            });
        }
    }
    else if(genre_q!=null){
        if(title_q==null){
            collection.find({
                genre: genre_q
            }, function(err, videos){
                if(err) throw err;
                res.render('index', { videos: videos})
            });
        }
        else{
            collection.find({
                title: new RegExp(title_q,'i') ,
                genre: genre_q
                }, function(err, videos){
                        if(err) throw err;
                            res.render('index', { videos: videos})
                });   
        }

    }
    else
        {
         collection.find({}, function(err, videos){
              if (err) throw err;
                res.render('index',{videos: videos});
           });
    }

});


//new video
router.get('/videos/new', function(req, res) {
	res.render('new');     
});

//insert route
router.post('/videos', function(req, res){
    var collection = db.get('videos');
    collection.insert({
        title: req.body.title,
        genre: req.body.genre,
        image: req.body.image,
        description: req.body.desc
    }, function(err, video){
        if (err) throw err;

        res.redirect('/videos');
    });
});


router.get('/videos/:id', function(req, res) {
	var collection = db.get('videos');
	collection.findOne({ _id: req.params.id }, function(err, video){
		if (err) throw err;
	  	//res.json(video);
	  	res.render('show', { video: video });
	});
});

//delete route
router.delete('/videos/:id', function(req, res){
    var collection = db.get('videos');
    collection.remove({ _id: req.params.id }, function(err, video){
        if (err) throw err;

        res.redirect('/');
    });
});

// edit route
router.get('/videos/:id/edit', function(req,res){
    var collection = db.get('videos');
    collection.findOne({_id: req.params.id}, function(err, video){
        if(err) throw err;
        res.render('edit', { video: video});
    })
    
})

//update route

router.post('/videos/:id', function(req,res){
    var collection = db.get('videos');
    collection.update({_id: req.params.id},
        {$set: 
            {   title: req.body.title,
                genre: req.body.genre,
                image: req.body.image,
                description: req.body.desc
            }
        },function(err, video){
            if(err) throw err;
            res.redirect('/');
        });
});



module.exports = router;
