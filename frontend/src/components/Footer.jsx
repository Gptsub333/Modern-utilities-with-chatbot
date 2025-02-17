import React from 'react';
import { Row, Col } from 'antd';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';

const Footer = ({ t }) => {
  const handleChange = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <footer className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        <Row gutter={[16, 16]} justify="space-between">
          <Col xs={24} sm={12} md={8}>
            <h3 className="text-lg font-bold mb-4">{t('Contact')}</h3>
            <p className="mb-4">{t('Do you have any questions? Feel free to reach out.')}</p>
            <a href="mailto:l.qqbadze@gmail.com" className="text-blue-400 hover:text-blue-300">
              {t('Let\'s Chat')}
            </a>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3 className="text-lg font-bold mb-4">{t('Policy')}</h3>
            <p className="mb-2">{t('Application Security')}</p>
            <p className="mb-2">{t('Software Principles')}</p>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3 className="text-lg font-bold mb-4">{t('Support')}</h3>
            <p className="mb-2">{t('Support Center')}</p>
            <p className="mb-2">{t('Customer Support')}</p>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="space-between" className="mt-8">
          <Col xs={24} sm={12} md={8}>
            <h3 className="text-lg font-bold mb-4">{t('Address')}</h3>
            <p className="mb-2">3441 W Sahara Ave b7</p>
            <p className="mb-2">2Las Vegas, NV 89102</p>
            <p>United States</p>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <h3 className="text-lg font-bold mb-4">{t('Company')}</h3>
            <p className="mb-2">{t('About')}</p>
            <p className="mb-2">{t('Blog')}</p>
            <p className="mb-2">{t('Press')}</p>
            <p>{t('Careers & Culture')}</p>
          </Col>
        </Row>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm mb-2">© 2024 Modern Utilities. All rights reserved.</p>
          <p className="text-sm">
            <a href="/terms" className="text-blue-400 hover:text-blue-300">
              Terms of Service
            </a>{' '}
            |{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default withTranslation()(Footer);
