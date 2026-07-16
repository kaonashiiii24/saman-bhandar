const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');
const cms = require('../controllers/cmsController');

router.get('/public', cms.getPublicCms);
router.get('/hero', auth, roleCheck('admin'), cms.getHero);
router.put('/hero', auth, roleCheck('admin'), upload.single('hero_bg'), cms.updateHero);

router.get('/about', auth, roleCheck('admin'), cms.getAbout);
router.put('/about', auth, roleCheck('admin'), upload.single('image'), cms.updateAbout);

router.get('/services', auth, roleCheck('admin'), cms.listServices);
router.post('/services', auth, roleCheck('admin'), cms.createService);
router.put('/services/:id', auth, roleCheck('admin'), cms.updateService);
router.delete('/services/:id', auth, roleCheck('admin'), cms.deleteService);

router.get('/how-it-works', auth, roleCheck('admin'), cms.listHowItWorks);
router.post('/how-it-works', auth, roleCheck('admin'), cms.createHowItWorks);
router.put('/how-it-works/:id', auth, roleCheck('admin'), cms.updateHowItWorks);
router.delete('/how-it-works/:id', auth, roleCheck('admin'), cms.deleteHowItWorks);

router.get('/features', auth, roleCheck('admin'), cms.listFeatures);
router.post('/features', auth, roleCheck('admin'), upload.single('image'), cms.createFeature);
router.put('/features/:id', auth, roleCheck('admin'), upload.single('image'), cms.updateFeature);
router.delete('/features/:id', auth, roleCheck('admin'), cms.deleteFeature);

router.get('/testimonials', auth, roleCheck('admin'), cms.listTestimonials);
router.post('/testimonials', auth, roleCheck('admin'), upload.single('profile_image'), cms.createTestimonial);
router.put('/testimonials/:id', auth, roleCheck('admin'), upload.single('profile_image'), cms.updateTestimonial);
router.delete('/testimonials/:id', auth, roleCheck('admin'), cms.deleteTestimonial);

router.get('/faqs', auth, roleCheck('admin'), cms.listFaqs);
router.post('/faqs', auth, roleCheck('admin'), cms.createFaq);
router.put('/faqs/:id', auth, roleCheck('admin'), cms.updateFaq);
router.delete('/faqs/:id', auth, roleCheck('admin'), cms.deleteFaq);

router.get('/contact', auth, roleCheck('admin'), cms.getContact);
router.put('/contact', auth, roleCheck('admin'), cms.updateContact);

router.get('/footer', auth, roleCheck('admin'), cms.getFooter);
router.put('/footer', auth, roleCheck('admin'), cms.updateFooter);

router.get('/theme', auth, roleCheck('admin'), cms.getTheme);
router.put('/theme', auth, roleCheck('admin'), cms.updateTheme);

router.get('/seo', auth, roleCheck('admin'), cms.getSeo);
router.put('/seo', auth, roleCheck('admin'), upload.single('favicon'), cms.updateSeo);

router.get('/media', auth, roleCheck('admin'), cms.listMedia);
router.post('/media/upload', auth, roleCheck('admin'), upload.single('file'), cms.uploadMedia);
router.delete('/media/:id', auth, roleCheck('admin'), cms.deleteMedia);

router.get('/about-values', auth, roleCheck('admin'), cms.listAboutValues);
router.post('/about-values', auth, roleCheck('admin'), cms.createAboutValue);
router.put('/about-values/:id', auth, roleCheck('admin'), cms.updateAboutValue);
router.delete('/about-values/:id', auth, roleCheck('admin'), cms.deleteAboutValue);

router.get('/services-page', auth, roleCheck('admin'), cms.getServicesPage);
router.put('/services-page', auth, roleCheck('admin'), upload.single('hero_image'), cms.updateServicesPage);

router.get('/services-why-stats', auth, roleCheck('admin'), cms.listServicesWhyStats);
router.post('/services-why-stats', auth, roleCheck('admin'), cms.createServicesWhyStat);
router.put('/services-why-stats/:id', auth, roleCheck('admin'), cms.updateServicesWhyStat);
router.delete('/services-why-stats/:id', auth, roleCheck('admin'), cms.deleteServicesWhyStat);

router.get('/pricing-plans', auth, roleCheck('admin'), cms.listPricingPlans);
router.post('/pricing-plans', auth, roleCheck('admin'), cms.createPricingPlan);
router.put('/pricing-plans/:id', auth, roleCheck('admin'), cms.updatePricingPlan);
router.delete('/pricing-plans/:id', auth, roleCheck('admin'), cms.deletePricingPlan);

router.get('/section-headings', auth, roleCheck('admin'), cms.getSectionHeadings);
router.put('/section-headings', auth, roleCheck('admin'), cms.updateSectionHeadings);

router.get('/role-steps', auth, roleCheck('admin'), cms.listRoleSteps);
router.post('/role-steps', auth, roleCheck('admin'), cms.createRoleStep);
router.put('/role-steps/:id', auth, roleCheck('admin'), cms.updateRoleStep);
router.delete('/role-steps/:id', auth, roleCheck('admin'), cms.deleteRoleStep);

router.get('/browse-page', auth, roleCheck('admin'), cms.getBrowsePage);
router.put('/browse-page', auth, roleCheck('admin'), upload.single('hero_image'), cms.updateBrowsePage);

router.get('/navigation', auth, roleCheck('admin'), cms.getNavigation);
router.put('/navigation', auth, roleCheck('admin'), upload.fields([{ name: 'logo_url' }, { name: 'footer_logo_url' }]), cms.updateNavigation);

module.exports = router;