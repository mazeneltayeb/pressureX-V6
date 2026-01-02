"use client";
import React from "react";
import LatestArticles from "@/components/LatestArticles";
import PricesSection from "@/components/PricesSection";
import Banner from "@/components/Banner";
import AdSlot from "@/components/AdSlot";
// import vedio from "components/vedio/mainVedio.mp4"
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import AdvancedVideoPlayer from "@/components/AdvancedVideoPlayer";
// import SlickSlider from '@/components/SlickSlider'
import ProductCategories from "@/components/ProductCategories"
import Numbers from "@/components/Numbers";
import SwiperCarSlider from "@/components/SwiperCarSlider";
import 'swiper/css/bundle';
import SwiperCustomers from "@/components/SwiperCustomers";
import WeOffer from "@/components/WeOffer";
import Companies from "@/components/Companies";

export default function Home() {
  return (
   <main>
  <Banner />
 <AdvancedVideoPlayer 
        videoPath="vedio/mainVedio.mp4"
        aspectRatio="16:9"
        showMuteIndicator={true}
        autoReplay={true}
      />
        <SwiperCarSlider 
        autoPlay={true}
        delay={3000}
        showPagination={true}
        showNavigation={true}
        loop={true}
      />

  <ProductCategories/>
    <SwiperCustomers
      autoPlay={true}
        delay={3000}
        showPagination={true}
        showNavigation={true}
        loop={true}
  />
  <WeOffer/>
  
   {/* <LatestArticles />
<Numbers/> */}
<Companies/>
  {/* إعلان داخل الصفحة */}
  <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
   
  {/* <PricesSection /> */}
  {/* إعلان سفلي عادي */}
  {/* <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" /> */}

  {/* إعلان متحرك */}
 
</main>
  );
}
