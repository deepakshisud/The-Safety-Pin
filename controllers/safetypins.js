const Safetypin = require('../models/safetypin');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapBoxToken})
const { cloudinary } = require("../cloudinary");

module.exports.index = async(req, res) => {
    const safetypins = await Safetypin.find({});
    res.render('safetypins/index', {safetypins})
}

module.exports.newForm = (req,res) => {
    res.render('safetypins/new');
}

module.exports.createPin = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.safetypin.address,
        limit: 1
    }).send()
    const safetypin = new Safetypin(req.body.safetypin);
    safetypin.images = req.files.map(f=> ({url: f.path, filename: f.filename}))
    safetypin.geometry = geoData.body.features[0].geometry;
    safetypin.author = req.user._id;
    await safetypin.save();
    console.log(safetypin);
    req.flash('success','Successfully made a new safetypin')
    res.redirect(`/safetypins/${safetypin._id}`);

}

module.exports.showPins = async(req, res) => {
    const safetypin = await Safetypin.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/show', {safetypin,});
}

module.exports.editForm = async(req,res) => {
    const safetypin = await Safetypin.findById(req.params.id);
    if(!safetypin) {
        req.flash('error','Cannot find the safetypin')
         return res.redirect('/safetypins');
    }
    res.render('safetypins/edit', {safetypin});
}

module.exports.updatePin = async(req,res) => {
    const {id} = req.params;
    const safetypin = await Safetypin.findByIdAndUpdate(id, {...req.body});
    const imgs = req.files.map(f=> ({url: f.path, filename: f.filename}));
    safetypin.images.push(...imgs);
    await safetypin.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await safetypin.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated!');
    res.redirect(`/safetypins/${safetypin._id}`);
}

module.exports.deletePin = async(req, res) => {
    const {id} = req.params;
    await Safetypin.findByIdAndDelete(id);
    req.flash('success','Successfully deleted!')
    res.redirect('/safetypins');
}