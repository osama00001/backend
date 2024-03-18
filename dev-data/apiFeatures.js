class ApiFeatures{
    constructor(query,queryString){
        this.query=query
        this.queryString=queryString
    }

    filter(){
        const queryObj = { ...this.queryString};
        const excludedFields = ['limit', 'sort', 'page', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj)
        let updatedQuery=JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`))
        this.query = this.query.find(updatedQuery);
        return this
    }

    sort(){
        if(this.queryString.sort){
        let sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
    }else{
        this.query = this.query.sort('-createdAd');
    }
        return this
    }

    limitFeilds(){
        if(this.queryString.fields){
            let selectedFeilds = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(selectedFeilds);
    }else{
        this.query = this.query.select('-__v');
    }
    return this
}

    paginatingData(){
        if(this.queryString.page){
            let pageNo = this.queryString.page * 1|| 1
                let limit = this.queryString.limit * 1 || 1
                let skip = (pageNo-1)*limit
                this.query=this.query.skip(skip).limit(limit)
        }
        return this
    }
}

module.exports = ApiFeatures