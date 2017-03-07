var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://zantler:Masita007@ds119810.mlab.com:19810/pokemondb';

router.get('/', function(req, res, next) {
    res.render('index',{ title: 'Pokemon Viewer'});
});

//ver todos los pokemones
router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('pokemon').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            res.render('index', { title: 'Pokemon Viewer', pokemons: resultArray});
        });
    });
});


router.get('/get-teams', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('teams').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            res.render('index', { title: 'Pokemon Viewer', teams: resultArray});
        });
    });
});
// se recomienda documentar mejor y borrar el codigo que no se este utilizando

router.post('/insert', function(req, res, next) {
    var item = {
        name: req.body.nombre,
        level: req.body.level,
        nature: req.body.nature,
        //abiity: req.body.ability,
        evs: req.body.evs,
        ivs: req.body.ivs
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('teams').insertOne(item, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted');
            db.close();
        });
    });

    res.redirect('/get-data');
});

router.post('/update', function(req, res, next) {
    var item = {
        level: req.body.level,
        nature: req.body.nature,
        //abiity: req.body.ability,
        evs: req.body.evs,
        ivs: req.body.ivs
    };
    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('teams').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
            assert.equal(null, err);
            console.log('Item updated');
            db.close();
        });
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('teams').deleteOne({"_id": objectId(id)}, function(err, result) {
            assert.equal(null, err);
            console.log('Item deleted');
            db.close();
        });
    });
});

module.exports = router;
