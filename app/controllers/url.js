const UrlService = require('../services/url');

const mongoose = require('mongoose');

exports.register = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const urlService = new UrlService(session);

        const url = req.body.url;
        let result = req.protocol + '://' + req.get('host') + '/';
        let status;

        let urlDocument = await urlService.getUrlDocumentByQuery({
            query : {url},
            projection : {_id: true}
        });

        if(!urlDocument) {
            urlDocument = await urlService.createUrlDocument({url});
            status = 201;
        }

        result = result + urlDocument._id

        await session.commitTransaction();

        res.status(status || 200);
        res.json(result);

    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
}

exports.redirect = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const urlService = new UrlService(session);

        const _id = req.params._id;
        
        let urlDocument = await urlService.getUrlDemandDocumentById({
            _id,
            projection : {url : true}
        })
        if(!urlDocument) {/* throw error */}
        else await urlService.createUrlLogDocument({urlDocument});

        await session.commitTransaction();

        res.redirect(urlDocument.url);

    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
}

exports.stats = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const urlService = new UrlService(session);

        const _id = req.params._id;

        let urlDocument = await urlService.getUrlDemandDocumentById({
            _id,
            projection : {url : true}
        })
        if(!urlDocument) {/* throw error */}

        const result = await urlService.getStats({urlDocument})
        
        await session.commitTransaction();

        res.json(result);

    } catch (err) {
        await session.abortTransaction();
        next(err);
    } finally {
        session.endSession();
    }
}

