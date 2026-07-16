const path = require('path');
const fs = require('fs');
const HomepageSection = require('../models/HomepageSection');
const Service = require('../models/Service');
const HowItWorksStep = require('../models/HowItWorksStep');
const Feature = require('../models/Feature');
const Testimonial = require('../models/Testimonial');
const Faq = require('../models/Faq');
const ContactSetting = require('../models/ContactSetting');
const FooterSetting = require('../models/FooterSetting');
const ThemeSetting = require('../models/ThemeSetting');
const SiteSetting = require('../models/SiteSetting');
const Media = require('../models/Media');
const AboutValue = require('../models/AboutValue');
const ServicesWhyStat = require('../models/ServicesWhyStat');
const PricingPlan = require('../models/PricingPlan');
const RoleStep = require('../models/RoleStep');
const { success, error } = require('../utils/apiResponse');

const deleteFile = (filePath) => {
  if (!filePath) return;
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

exports.getHero = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('hero');
    const hero = {};
    items.forEach(item => { hero[item.key] = item.value; });
    return success(res, hero, 'Hero content fetched');
  } catch (err) { next(err); }
};

exports.updateHero = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.hero_bg = '/uploads/' + req.file.filename;
      const oldItems = await HomepageSection.findAllBySection('hero');
      const oldBg = oldItems.find(i => i.key === 'hero_bg');
      if (oldBg && oldBg.value && oldBg.value !== updates.hero_bg) {
        deleteFile(oldBg.value);
      }
    }
    for (const [key, value] of Object.entries(updates)) {
      await HomepageSection.upsert('hero', key, value);
    }
    const items = await HomepageSection.findAllBySection('hero');
    const hero = {};
    items.forEach(item => { hero[item.key] = item.value; });
    return success(res, hero, 'Hero updated');
  } catch (err) { next(err); }
};

exports.getAbout = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('about');
    const about = {};
    items.forEach(item => { about[item.key] = item.value; });
    return success(res, about, 'About content fetched');
  } catch (err) { next(err); }
};

exports.updateAbout = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) {
      updates.image = '/uploads/' + req.file.filename;
      const oldItems = await HomepageSection.findAllBySection('about');
      const oldImg = oldItems.find(i => i.key === 'image');
      if (oldImg && oldImg.value && oldImg.value !== updates.image) {
        deleteFile(oldImg.value);
      }
    }
    for (const [key, value] of Object.entries(updates)) {
      await HomepageSection.upsert('about', key, value);
    }
    const items = await HomepageSection.findAllBySection('about');
    const about = {};
    items.forEach(item => { about[item.key] = item.value; });
    return success(res, about, 'About updated');
  } catch (err) { next(err); }
};

exports.listServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    return success(res, services, 'Services fetched');
  } catch (err) { next(err); }
};

exports.createService = async (req, res, next) => {
  try {
    const id = await Service.create(req.body);
    const service = await Service.findById(id);
    return success(res, service, 'Service created', 201);
  } catch (err) { next(err); }
};

exports.updateService = async (req, res, next) => {
  try {
    await Service.update(req.params.id, req.body);
    const service = await Service.findById(req.params.id);
    return success(res, service, 'Service updated');
  } catch (err) { next(err); }
};

exports.deleteService = async (req, res, next) => {
  try {
    await Service.remove(req.params.id);
    return success(res, null, 'Service deleted');
  } catch (err) { next(err); }
};

exports.listHowItWorks = async (req, res, next) => {
  try {
    const steps = await HowItWorksStep.findAll();
    return success(res, steps, 'How It Works steps fetched');
  } catch (err) { next(err); }
};

exports.createHowItWorks = async (req, res, next) => {
  try {
    const id = await HowItWorksStep.create(req.body);
    const step = await HowItWorksStep.findById(id);
    return success(res, step, 'Step created', 201);
  } catch (err) { next(err); }
};

exports.updateHowItWorks = async (req, res, next) => {
  try {
    await HowItWorksStep.update(req.params.id, req.body);
    const step = await HowItWorksStep.findById(req.params.id);
    return success(res, step, 'Step updated');
  } catch (err) { next(err); }
};

exports.deleteHowItWorks = async (req, res, next) => {
  try {
    await HowItWorksStep.remove(req.params.id);
    return success(res, null, 'Step deleted');
  } catch (err) { next(err); }
};

exports.listFeatures = async (req, res, next) => {
  try {
    const features = await Feature.findAll();
    return success(res, features, 'Features fetched');
  } catch (err) { next(err); }
};

exports.createFeature = async (req, res, next) => {
  try {
    if (req.file) req.body.image = '/uploads/' + req.file.filename;
    const id = await Feature.create(req.body);
    const feature = await Feature.findById(id);
    return success(res, feature, 'Feature created', 201);
  } catch (err) { next(err); }
};

exports.updateFeature = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = '/uploads/' + req.file.filename;
      const existing = await Feature.findById(req.params.id);
      if (existing && existing.image && existing.image !== req.body.image) {
        deleteFile(existing.image);
      }
    }
    await Feature.update(req.params.id, req.body);
    const feature = await Feature.findById(req.params.id);
    return success(res, feature, 'Feature updated');
  } catch (err) { next(err); }
};

exports.deleteFeature = async (req, res, next) => {
  try {
    const existing = await Feature.findById(req.params.id);
    if (existing && existing.image) deleteFile(existing.image);
    await Feature.remove(req.params.id);
    return success(res, null, 'Feature deleted');
  } catch (err) { next(err); }
};

exports.listTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll();
    return success(res, testimonials, 'Testimonials fetched');
  } catch (err) { next(err); }
};

exports.createTestimonial = async (req, res, next) => {
  try {
    if (req.file) req.body.profile_image = '/uploads/' + req.file.filename;
    const id = await Testimonial.create(req.body);
    const testimonial = await Testimonial.findById(id);
    return success(res, testimonial, 'Testimonial created', 201);
  } catch (err) { next(err); }
};

exports.updateTestimonial = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.profile_image = '/uploads/' + req.file.filename;
      const existing = await Testimonial.findById(req.params.id);
      if (existing && existing.profile_image && existing.profile_image !== req.body.profile_image) {
        deleteFile(existing.profile_image);
      }
    }
    await Testimonial.update(req.params.id, req.body);
    const testimonial = await Testimonial.findById(req.params.id);
    return success(res, testimonial, 'Testimonial updated');
  } catch (err) { next(err); }
};

exports.deleteTestimonial = async (req, res, next) => {
  try {
    const existing = await Testimonial.findById(req.params.id);
    if (existing && existing.profile_image) deleteFile(existing.profile_image);
    await Testimonial.remove(req.params.id);
    return success(res, null, 'Testimonial deleted');
  } catch (err) { next(err); }
};

exports.listFaqs = async (req, res, next) => {
  try {
    const faqs = await Faq.findAll();
    return success(res, faqs, 'FAQs fetched');
  } catch (err) { next(err); }
};

exports.createFaq = async (req, res, next) => {
  try {
    const id = await Faq.create(req.body);
    const faq = await Faq.findById(id);
    return success(res, faq, 'FAQ created', 201);
  } catch (err) { next(err); }
};

exports.updateFaq = async (req, res, next) => {
  try {
    await Faq.update(req.params.id, req.body);
    const faq = await Faq.findById(req.params.id);
    return success(res, faq, 'FAQ updated');
  } catch (err) { next(err); }
};

exports.deleteFaq = async (req, res, next) => {
  try {
    await Faq.remove(req.params.id);
    return success(res, null, 'FAQ deleted');
  } catch (err) { next(err); }
};

exports.getContact = async (req, res, next) => {
  try {
    const contact = await ContactSetting.find();
    return success(res, contact || {}, 'Contact settings fetched');
  } catch (err) { next(err); }
};

exports.updateContact = async (req, res, next) => {
  try {
    if (req.body.social_media_links) {
      if (typeof req.body.social_media_links === 'string') {
        try {
          req.body.social_media_links = JSON.stringify(JSON.parse(req.body.social_media_links));
        } catch {
          return error(res, 'Invalid social media links JSON', 400);
        }
      } else if (Array.isArray(req.body.social_media_links)) {
        req.body.social_media_links = JSON.stringify(req.body.social_media_links);
      }
    }

    await ContactSetting.upsert(req.body);
    const contact = await ContactSetting.find();
    return success(res, contact, 'Contact settings updated');
 } catch (err) {
  console.error('Contact update error:', err);
  next(err);
}
};

exports.getFooter = async (req, res, next) => {
  try {
    const footer = await FooterSetting.find();
    return success(res, footer || {}, 'Footer settings fetched');
  } catch (err) { next(err); }
};

exports.updateFooter = async (req, res, next) => {
  try {
    const jsonFields = ['quick_links', 'social_links', 'platform_links', 'company_links', 'legal_links'];
    jsonFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] !== 'string') {
        req.body[field] = JSON.stringify(req.body[field]);
      }
    });

    await FooterSetting.upsert(req.body);
    const footer = await FooterSetting.find();
    return success(res, footer, 'Footer settings updated');
  } catch (err) {
    next(err);
  }
};
exports.getNavigation = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('navigation');
    const nav = {};
    items.forEach(item => { nav[item.key] = item.value; });
    return success(res, nav, 'Navigation fetched');
  } catch (err) { next(err); }
};

exports.updateNavigation = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.files) {
      if (req.files.logo_url) {
        updates.logo_url = '/uploads/' + req.files.logo_url[0].filename;
      }
      if (req.files.footer_logo_url) {
        updates.footer_logo_url = '/uploads/' + req.files.footer_logo_url[0].filename;
      }
    }
    for (const [key, value] of Object.entries(updates)) {
      await HomepageSection.upsert('navigation', key, value);
    }
    const items = await HomepageSection.findAllBySection('navigation');
    const nav = {};
    items.forEach(item => { nav[item.key] = item.value; });
    return success(res, nav, 'Navigation updated');
  } catch (err) { next(err); }
};

exports.getTheme = async (req, res, next) => {
  try {
    const theme = await ThemeSetting.find();
    return success(res, theme || {}, 'Theme settings fetched');
  } catch (err) { next(err); }
};

exports.updateTheme = async (req, res, next) => {
  try {
    await ThemeSetting.upsert(req.body);
    const theme = await ThemeSetting.find();
    return success(res, theme, 'Theme settings updated');
  } catch (err) { next(err); }
};

exports.getSeo = async (req, res, next) => {
  try {
    const seo = {};
    const items = await SiteSetting.findAll();
    items.forEach(item => { if (item.key.startsWith('seo_')) seo[item.key] = item.value; });
    return success(res, seo, 'SEO settings fetched');
  } catch (err) { next(err); }
};

exports.updateSeo = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.seo_favicon = '/uploads/' + req.file.filename;
      const old = await SiteSetting.findByKey('seo_favicon');
      if (old && old.value && old.value !== req.body.seo_favicon) deleteFile(old.value);
    }
    for (const [key, value] of Object.entries(req.body)) {
      await SiteSetting.upsert(key, value);
    }
    const seo = {};
    const items = await SiteSetting.findAll();
    items.forEach(item => { if (item.key.startsWith('seo_')) seo[item.key] = item.value; });
    return success(res, seo, 'SEO settings updated');
  } catch (err) { next(err); }
};

exports.listMedia = async (req, res, next) => {
  try {
    const media = await Media.findAll();
    return success(res, media, 'Media fetched');
  } catch (err) { next(err); }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return error(res, 'No file uploaded', 400);
    const fileData = {
      filename: req.file.filename,
      filepath: '/uploads/' + req.file.filename,
      original_name: req.file.originalname,
      mime_type: req.file.mimetype,
      size: req.file.size,
    };
    const id = await Media.create(fileData);
    const media = await Media.findById(id);
    return success(res, media, 'Media uploaded', 201);
  } catch (err) { next(err); }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return error(res, 'Media not found', 404);
    deleteFile(media.filepath);
    await Media.remove(req.params.id);
    return success(res, null, 'Media deleted');
  } catch (err) { next(err); }
};

exports.listAboutValues = async (req, res, next) => {
  try {
    const values = await AboutValue.findAll();
    return success(res, values, 'About values fetched');
  } catch (err) { next(err); }
};

exports.createAboutValue = async (req, res, next) => {
  try {
    const id = await AboutValue.create(req.body);
    const value = await AboutValue.findById(id);
    return success(res, value, 'About value created', 201);
  } catch (err) { next(err); }
};

exports.updateAboutValue = async (req, res, next) => {
  try {
    await AboutValue.update(req.params.id, req.body);
    const value = await AboutValue.findById(req.params.id);
    return success(res, value, 'About value updated');
  } catch (err) { next(err); }
};

exports.deleteAboutValue = async (req, res, next) => {
  try {
    await AboutValue.remove(req.params.id);
    return success(res, null, 'About value deleted');
  } catch (err) { next(err); }
};

exports.getServicesPage = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('services_page');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Services page fetched');
  } catch (err) { next(err); }
};

exports.updateServicesPage = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) updates.hero_image = '/uploads/' + req.file.filename;
    for (const [key, value] of Object.entries(updates)) {
      await HomepageSection.upsert('services_page', key, value);
    }
    const items = await HomepageSection.findAllBySection('services_page');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Services page updated');
  } catch (err) { next(err); }
};

exports.listServicesWhyStats = async (req, res, next) => {
  try {
    const stats = await ServicesWhyStat.findAll();
    return success(res, stats, 'Services why stats fetched');
  } catch (err) { next(err); }
};

exports.createServicesWhyStat = async (req, res, next) => {
  try {
    const id = await ServicesWhyStat.create(req.body);
    const stat = await ServicesWhyStat.findById(id);
    return success(res, stat, 'Stat created', 201);
  } catch (err) { next(err); }
};

exports.updateServicesWhyStat = async (req, res, next) => {
  try {
    await ServicesWhyStat.update(req.params.id, req.body);
    const stat = await ServicesWhyStat.findById(req.params.id);
    return success(res, stat, 'Stat updated');
  } catch (err) { next(err); }
};

exports.deleteServicesWhyStat = async (req, res, next) => {
  try {
    await ServicesWhyStat.remove(req.params.id);
    return success(res, null, 'Stat deleted');
  } catch (err) { next(err); }
};

exports.listPricingPlans = async (req, res, next) => {
  try {
    const plans = await PricingPlan.findAll();
    return success(res, plans, 'Pricing plans fetched');
  } catch (err) { next(err); }
};

exports.createPricingPlan = async (req, res, next) => {
  try {
    const id = await PricingPlan.create(req.body);
    const plan = await PricingPlan.findById(id);
    return success(res, plan, 'Plan created', 201);
  } catch (err) { next(err); }
};

exports.updatePricingPlan = async (req, res, next) => {
  try {
    await PricingPlan.update(req.params.id, req.body);
    const plan = await PricingPlan.findById(req.params.id);
    return success(res, plan, 'Plan updated');
  } catch (err) { next(err); }
};

exports.deletePricingPlan = async (req, res, next) => {
  try {
    await PricingPlan.remove(req.params.id);
    return success(res, null, 'Plan deleted');
  } catch (err) { next(err); }
};

exports.getSectionHeadings = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('section_headings');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Section headings fetched');
  } catch (err) { next(err); }
};

exports.updateSectionHeadings = async (req, res, next) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await HomepageSection.upsert('section_headings', key, value);
    }
    const items = await HomepageSection.findAllBySection('section_headings');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Section headings updated');
  } catch (err) { next(err); }
};

exports.listRoleSteps = async (req, res, next) => {
  try {
    const steps = await RoleStep.findAll();
    return success(res, steps, 'Role steps fetched');
  } catch (err) { next(err); }
};

exports.updateRoleStep = async (req, res, next) => {
  try {
    await RoleStep.update(req.params.id, req.body);
    const step = await RoleStep.findById(req.params.id);
    return success(res, step, 'Role step updated');
  } catch (err) { next(err); }
};

exports.createRoleStep = async (req, res, next) => {
  try {
    const id = await RoleStep.create(req.body);
    const step = await RoleStep.findById(id);
    return success(res, step, 'Role step created', 201);
  } catch (err) { next(err); }
};

exports.deleteRoleStep = async (req, res, next) => {
  try {
    await RoleStep.remove(req.params.id);
    return success(res, null, 'Role step deleted');
  } catch (err) { next(err); }
};

exports.getBrowsePage = async (req, res, next) => {
  try {
    const items = await HomepageSection.findAllBySection('browse_page');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Browse page fetched');
  } catch (err) { next(err); }
};

exports.updateBrowsePage = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) updates.hero_image = '/uploads/' + req.file.filename;
    for (const [key, value] of Object.entries(updates)) {
      await HomepageSection.upsert('browse_page', key, value);
    }
    const items = await HomepageSection.findAllBySection('browse_page');
    const data = {};
    items.forEach(item => { data[item.key] = item.value; });
    return success(res, data, 'Browse page updated');
  } catch (err) { next(err); }
};

exports.getPublicCms = async (req, res, next) => {
  try {
    const heroItems = await HomepageSection.findAllBySection('hero');
    const hero = {};
    heroItems.forEach(item => { hero[item.key] = item.value; });

    const navigation = {};
    const navItems = await HomepageSection.findAllBySection('navigation');
    navItems.forEach(item => { navigation[item.key] = item.value; });

    const aboutItems = await HomepageSection.findAllBySection('about');
    const about = {};
    aboutItems.forEach(item => { about[item.key] = item.value; });

    const services = await Service.findAll();
    const howItWorks = await HowItWorksStep.findAll();
    const features = await Feature.findAll();
    const testimonials = await Testimonial.findAll();
    const faqs = await Faq.findAll();
    const contact = await ContactSetting.find() || {};
    const footer = await FooterSetting.find() || {};
    const theme = await ThemeSetting.find() || {};

    const seo = {};
    const siteSettings = await SiteSetting.findAll();
    siteSettings.forEach(item => {
      if (item.key.startsWith('seo_')) seo[item.key] = item.value;
    });

    const aboutValues = await AboutValue.findAll();
    const servicesWhyStats = await ServicesWhyStat.findAll();

    const servicesPage = {};
    const servicesPageItems = await HomepageSection.findAllBySection('services_page');
    servicesPageItems.forEach(item => { servicesPage[item.key] = item.value; });

    const browsePage = {};
    const browseItems = await HomepageSection.findAllBySection('browse_page');
    browseItems.forEach(item => { browsePage[item.key] = item.value; });

    const pricingPlans = await PricingPlan.findAll();

    const sectionHeadings = {};
    const headingItems = await HomepageSection.findAllBySection('section_headings');
    headingItems.forEach(item => { sectionHeadings[item.key] = item.value; });

    const roleSteps = await RoleStep.findAll();

    const data = {
      hero,
      about,
      services,
      howItWorks,
      features,
      testimonials,
      faqs,
      contact,
      footer,
      theme,
      seo,
      aboutValues,
      servicesWhyStats,
      servicesPage,
      browsePage,
      navigation,
      pricingPlans,
      section_headings: sectionHeadings,
      roleSteps,
    };

    return success(res, data, 'CMS public data fetched');
  } catch (err) { next(err); }
};