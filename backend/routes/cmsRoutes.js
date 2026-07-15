const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const cms = require('../controllers/cmsController');

// public
router.get('/public', cms.getPublicCms);

// hero
router.get('/hero', auth, roleCheck('admin'), cms.getHero);
router.put('/hero', auth, roleCheck('admin'), upload.single('hero_bg'), cms.updateHero);

// about
router.get('/about', auth, roleCheck('admin'), cms.getAbout);
router.put('/about', auth, roleCheck('admin'), upload.single('image'), cms.updateAbout);

// services
router.get('/services', auth, roleCheck('admin'), cms.listServices);
router.post('/services', auth, roleCheck('admin'), cms.createService);
router.put('/services/:id', auth, roleCheck('admin'), cms.updateService);
router.delete('/services/:id', auth, roleCheck('admin'), cms.deleteService);

// how-it-works
router.get('/how-it-works', auth, roleCheck('admin'), cms.listHowItWorks);
router.post('/how-it-works', auth, roleCheck('admin'), cms.createHowItWorks);
router.put('/how-it-works/:id', auth, roleCheck('admin'), cms.updateHowItWorks);
router.delete('/how-it-works/:id', auth, roleCheck('admin'), cms.deleteHowItWorks);

// features
router.get('/features', auth, roleCheck('admin'), cms.listFeatures);
router.post('/features', auth, roleCheck('admin'), upload.single('image'), cms.createFeature);
router.put('/features/:id', auth, roleCheck('admin'), upload.single('image'), cms.updateFeature);
router.delete('/features/:id', auth, roleCheck('admin'), cms.deleteFeature);

// testimonials
router.get('/testimonials', auth, roleCheck('admin'), cms.listTestimonials);
router.post('/testimonials', auth, roleCheck('admin'), upload.single('profile_image'), cms.createTestimonial);
router.put('/testimonials/:id', auth, roleCheck('admin'), upload.single('profile_image'), cms.updateTestimonial);
router.delete('/testimonials/:id', auth, roleCheck('admin'), cms.deleteTestimonial);

// faqs
router.get('/faqs', auth, roleCheck('admin'), cms.listFaqs);
router.post('/faqs', auth, roleCheck('admin'), cms.createFaq);
router.put('/faqs/:id', auth, roleCheck('admin'), cms.updateFaq);
router.delete('/faqs/:id', auth, roleCheck('admin'), cms.deleteFaq);

// contact
router.get('/contact', auth, roleCheck('admin'), cms.getContact);
router.put('/contact', auth, roleCheck('admin'), cms.updateContact);

// footer
router.get('/footer', auth, roleCheck('admin'), cms.getFooter);
router.put('/footer', auth, roleCheck('admin'), cms.updateFooter);

// theme
router.get('/theme', auth, roleCheck('admin'), cms.getTheme);
router.put('/theme', auth, roleCheck('admin'), cms.updateTheme);

// seo
router.get('/seo', auth, roleCheck('admin'), cms.getSeo);
router.put('/seo', auth, roleCheck('admin'), upload.single('favicon'), cms.updateSeo);

// media
router.get('/media', auth, roleCheck('admin'), cms.listMedia);
router.post('/media/upload', auth, roleCheck('admin'), upload.single('file'), cms.uploadMedia);
router.delete('/media/:id', auth, roleCheck('admin'), cms.deleteMedia);

// about-values (new)
router.get('/about-values', auth, roleCheck('admin'), cms.listAboutValues);
router.post('/about-values', auth, roleCheck('admin'), cms.createAboutValue);
router.put('/about-values/:id', auth, roleCheck('admin'), cms.updateAboutValue);
router.delete('/about-values/:id', auth, roleCheck('admin'), cms.deleteAboutValue);

module.exports = router;