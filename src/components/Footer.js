"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import useTranslate from '@/hooks/useTranslate';
export default function Footer() {
  const { t, lang } = useTranslate(null);
  return (
    <footer className="bg-dark text-light pt-5 pb-5 mt-5">
      <Container>
        <Row className="mb-4 text-center">
          

          
          {/* <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-3">من نحن</h5>
            <p style={{ lineHeight: "1.8" }}>
              We are a creative web design and development team passionate about
              building modern, responsive websites.
            </p>
          </Col> */}
       
        
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-3">{t('Browse')}</h5>
            <div className="d-flex f-row justify-content-evenly">
              <ul className="list-unstyled">
              <li><a  href="/" className="text-light text-decoration-none">{t('home')}</a></li>
              <li><a href="/store" className="text-light text-decoration-none">{t('Store')}</a></li>
            
              <li><a href="/articles" className="text-light text-decoration-none">{t('Article')}</a></li>
         

            </ul>
            <ul className="list-unstyled d-flex justify-content-evenly flex-column"> 
                   <li><a href="/about" className="text-light text-decoration-none">{t('about')}</a></li> 
                <li><a href="/contact" className="text-light text-decoration-none">{t('contact')} </a></li>                           
            {/* <h6 className="fw-bold mb-2">الاسعار</h6> */}
              {/* <li><a  href="/prices/gold" className="text-light text-decoration-none">اسعار الذهب</a></li>
              <li><a href="/prices/currency" className="text-light text-decoration-none">اسعار الصرف</a></li>
              <li><a href="/prices/poultry" className="text-light text-decoration-none">بورصة الدواجن</a></li>
              <li><a href="/prices/materials" className="text-light text-decoration-none">اسعار الخامات</a></li>
              <li><a href="/prices/feeds" className="text-light text-decoration-none">اسعار الاعلاف</a></li> */}
            </ul>
            </div>
          
          </Col>

          <Col md={4} className="mb-3">
            {/* <h5 className="fw-bold mb-3">{t('companies_h1')}</h5> */}
            <p>Email: ahmedhaborob3e@gmail.com</p>
            <p>Phone: +201281090459</p>
          </Col>
           <div className="location col-md-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d858.4384535210542!2d32.253691369484976!3d30.61270645260936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f85bb885ce1b61%3A0xed71752bdb70e077!2z2KfYqNmIINix2KjYuSDZhNmC2LfYuSDYutmK2KfYsSDYp9mE2LPZitin2LHYp9iq!5e0!3m2!1sen!2seg!4v1766523074810!5m2!1sen!2seg" 
            frameBorder="0"
            style={{ border: 0 ,height:"100%" ,width:"100%"}}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
            title="Humanity First Indonesia"
            />
        </div>
        </Row>

        <hr className="border-light" />

        <Row className="text-center">
          <Col>
            <div className="d-flex justify-content-center gap-3 mb-2">
              <a href="#" className="text-light fs-4"><FaFacebook /></a>
              <a href="#" className="text-light fs-4"><FaInstagram /></a>
              <a href="#" className="text-light fs-4"><FaTwitter /></a>
              <a href="#" className="text-light fs-4"><FaLinkedin /></a>
            </div>
            <p className="mb-0">
              © {new Date().getFullYear()} My Website | All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
