function ensureAuthentication(req, res, next) {
    if (req.session.authenticated) {
      return next();
    } else {
      console.log(req.session);
      res.status(403).json({ msg: "You're not authorized to view this page" });
    }
}


module.exports = {
    ensureAuthentication
}