const URL_MODEL = require('../db/model/url');

class Url {
    constructor(session) { this.session = session; }

    async getUrlDemandDocumentById({ _id, projection = {}, options = {} }) {
        return await URL_MODEL.Url.findById(_id, projection, options);
    }

    async getUrlDocumentByQuery({ query = {}, projection = {}, options = {} }) {
        return await URL_MODEL.Url.findOne(query, projection, options);
    }

    async createUrlDocument({ url }) {

        return await new URL_MODEL.Url({
            url
        }).save({ session: this.session });
    }

    async createUrlLogDocument({ urlDocument }) {
        return await new URL_MODEL.UrlLog({
            url: urlDocument._id
        }).save({ session: this.session });
    }

    // 문제 파악 실수로 집계연산처리 미완성(date format이 문제의 출력과 다름)
    async getStats({ urlDocument }) {
        return await URL_MODEL.UrlLog.aggregate([
            {
                $match: {
                    url: urlDocument._id
                }
            },
            {
                "$project": {
                    "y": { "$year": "$created_at" },
                    "m": { "$month": "$created_at" },
                    "d": { "$dayOfMonth": "$created_at" },
                    "h": { "$hour": "$created_at" }
                }
            },
            {
                "$group": {
                    "_id": { "year": "$y", "month": "$m", "day": "$d", "hour": "$h" },
                    "visit": { "$sum": 1 }
                }
            }])
    }

}

module.exports = Url;