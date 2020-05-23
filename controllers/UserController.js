module.exports = (app) => {

    // [GET] => /user
    app.get("/user", async (req, res) => {});
    
    // [GET] => /user/:id
    app.get("/user/:id", async (req, res) => {});
    
    // [PUT] => /user/:id
    app.put("/user/:id", async (req, res) => {});
    
    // [POST] => /user
    app.post("/user", async (req, res) => {});
    
    // [DELETE] => /user
    app.delete("/user/:id", async (req, res) => {});

};