const Route = require('express').Router(),
  { image: { multer, sendUploadToGCS } } = require('../helpers')

Route
  .post(
    '/',
    multer.single( 'image' ),
    sendUploadToGCS,
    async ( req, res, next ) => { // for uploading image to gcs
      const url = req.file.cloudStoragePublicUrl;
      console.log( url );
      if( url ) res.status(201).json({ url });
      else next({ status: 400, msg: 'url not found!' })
    }); // *


module.exports = Route;