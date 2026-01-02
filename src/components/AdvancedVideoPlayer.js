// // components/AdvancedVideoPlayer.jsx
// import React, { useState, useRef, useEffect } from 'react';

// const AdvancedVideoPlayer = ({
//   videoPath, // المسار النسبي داخل public folder
//   posterPath, // صورة الغلاف (اختياري)
//   aspectRatio = '16:9', // نسبة العرض للارتفاع
//   className = '',
//   showMuteIndicator = true,
//   autoReplay = true
// }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   // حساب نسبة العرض للارتفاع
//   const calculateAspectRatio = (ratio) => {
//     const [width, height] = ratio.split(':').map(Number);
//     return (height / width) * 100;
//   };

//   const paddingBottom = `${calculateAspectRatio(aspectRatio)}%`;

//   useEffect(() => {
//     const video = videoRef.current;

//     const handlePlay = () => setIsPlaying(true);
//     const handlePause = () => setIsPlaying(false);
//     const handleEnded = () => {
//       if (autoReplay && video) {
//         video.currentTime = 0;
//         video.play();
//       }
//     };

//     if (video) {
//       video.addEventListener('play', handlePlay);
//       video.addEventListener('pause', handlePause);
//       video.addEventListener('ended', handleEnded);

//       // بدء التشغيل التلقائي
//       const playPromise = video.play();
      
//       if (playPromise !== undefined) {
//         playPromise.catch(error => {
//           console.log("Auto-play was prevented:", error);
//         });
//       }

//       // إيقاف الصوت
//       video.muted = true;
//       video.volume = 0;

//       // تحديث الأبعاد
//       const updateDimensions = () => {
//         if (video.videoWidth && video.videoHeight) {
//           setDimensions({
//             width: video.videoWidth,
//             height: video.videoHeight
//           });
//         }
//       };

//       video.addEventListener('loadedmetadata', updateDimensions);
//     }

//     return () => {
//       if (video) {
//         video.removeEventListener('play', handlePlay);
//         video.removeEventListener('pause', handlePause);
//         video.removeEventListener('ended', handleEnded);
//       }
//     };
//   }, [autoReplay]);

//   return (
//     <div className={`responsive-video-player container ${className}`}>
//       <div 
//         className="video-container"
//         style={{
//           position: 'relative',
//           paddingBottom: paddingBottom,
//           background: '#000',
//           overflow: 'hidden',
//           borderRadius: '8px'
//         }}
//       >
//         <video
//           ref={videoRef}
//           className='main-vedio'
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             objectFit: 'contain'
//           }}
//           playsInline
//           muted
//           poster={posterPath}
//           preload="metadata"
//         >
//           <source src={`/${videoPath}`} type="video/mp4" />
//           Your browser does not support HTML5 video.
//         </video>

//         {showMuteIndicator && (
//           <div 
//             style={{
//               position: 'absolute',
//               top: '10px',
//               right: '10px',
//               background: 'rgba(0,0,0,0.7)',
//               color: 'white',
//               padding: '4px 8px',
//               borderRadius: '4px',
//               fontSize: '12px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '4px'
//             }}
//           >
//             <span>🔇</span>
//             <span>Muted</span>
//           </div>
//         )}

//         {!isPlaying && (
//           <div 
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               background: 'rgba(0,0,0,0.5)',
//               width: '60px',
//               height: '60px',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               cursor: 'pointer'
//             }}
//             onClick={() => videoRef.current?.play()}
//           >
//             <span style={{ color: 'white', fontSize: '30px' }}>▶</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdvancedVideoPlayer;



// components/AdvancedVideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { Button } from 'react-bootstrap';
import useTranslate from '@/hooks/useTranslate';

const AdvancedVideoPlayer = ({
  videoPath, // المسار النسبي داخل public folder
  posterPath, // صورة الغلاف (اختياري)
  aspectRatio = '16:9', // نسبة العرض للارتفاع
  className = '',
  showMuteIndicator = true,
  autoReplay = false,
  leftContent = null, // المحتوى الذي سيظهر في الجزء الأيسر
  layout = 'right-video', // 'right-video' أو 'left-video'
  videoTitle = '', // عنوان الفيديو
  showControls = true, // إظهار عناصر التحكم
  videoContainerStyle = {}, // تنسيقات إضافية للحاوية
  contentContainerStyle = {} // تنسيقات إضافية للجزء النصي
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const { t, lang } = useTranslate(null);

  // حساب نسبة العرض للارتفاع
  const calculateAspectRatio = (ratio) => {
    const [width, height] = ratio.split(':').map(Number);
    return (height / width) * 100;
  };

  const paddingBottom = `${calculateAspectRatio(aspectRatio)}%`;

  // التحكم في الفيديو
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = parseFloat(e.target.value);
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowOverlay(false);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setShowOverlay(true);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setShowOverlay(true);
      if (autoReplay && video) {
        video.currentTime = 0;
        setTimeout(() => video.play(), 1000);
      }
    };

    const handleLoadedMetadata = () => {
      if (video) {
        setDuration(video.duration);
        video.muted = true;
        setIsMuted(true);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (video) {
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);

      // محاولة التشغيل التلقائي
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Auto-play was prevented:", error);
        });
      }
    }

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [autoReplay]);

  // تحديد ترتيب الأجزاء بناءً على الـ layout
  const isVideoRight = layout === 'left-video';
  
  // المحتوى الافتراضي للجزء الأيسر
  const defaultContent = (
    <section className=''
    
    style={{
      // padding: '30px',
      padding: "30px 5px",
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center'

      justifyContent: 'space-evenly '
    }}>
      {/* <div
      className='main-button '
      style={{
       width: "30%",
       marginBottom: "20px",
    }}
    >
من نحن      
</div> */}
      <h1 
       className='vedio-about main-button'
      style={{
        // fontSize: '21px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        marginBottom: "5px",
        justifyContent: "space-evenly",
        // width:"50%",
        width:" 90%",
        // height:" 40px",
        // border:"0"
      }}>

{/* من نحن      */}
  {t('about')}
 
      </h1>
      
      <p style={{
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '25px',
        lineHeight: "2.1"
      }}>
       {t('abouttext')}
      </p>
      
    
      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
        
      }}>
        <Button
        className='main-button'
        href="/contact"
        as={Link}
        style={{
        //      width:" 100px",
        // height:" 40px",
        }}
       >
          {/* اقرأ المزيد */}
          
          {t('button_more')}
        </Button>
        
    
      </div>
    </section>
  );

  return (
    <div className={`advanced-video-layout ${className}`} style={{
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'column' : (isVideoRight ? 'row-reverse' : 'row'),
      gap: '40px',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '5px',
      alignItems: 'stretch',
      minHeight: '500px'
    }}>
          {/* الجزء الثاني: المحتوى */}
      <div className="content-section" style={{
        flex: 1,
        // minWidth: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
        // boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        ...contentContainerStyle
      }}>
        {leftContent || defaultContent}
      </div>

      {/* الجزء الأول: الفيديو */}
      <div className="video-section" style={{
        flex: 1,
        minWidth: '300px',
        ...videoContainerStyle
      }}>
        <div className="video-wrapper" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          // borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--mainColor) 0px 0px 4px 0px',
          // backgroundColor: '#000'
        }}>
          <div 
            className="video-container"
            style={{
              // position: 'relative',
              paddingBottom: paddingBottom,
              // background: '#000',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              className='main-video'
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              playsInline
              muted={isMuted}
              poster={posterPath}
              preload="metadata"
            >
              <source src={`/${videoPath}`} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>

            {/* Overlay with controls */}
            {showOverlay && (
              <div 
                className="video-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: showControls ? 1 : 0,
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={() => showControls && setShowOverlay(true)}
                onMouseLeave={() => isPlaying && setShowOverlay(false)}
              >
                {/* Top Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px'
                }}>
                  {videoTitle && (
                    <div style={{
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                    }}>
                      {videoTitle}
                    </div>
                  )}
                  
                  {showMuteIndicator && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}
                    >
                      {isMuted ? '🔇' : '🔊'}
                    </button>
                  )}
                </div>

                {/* Center Play Button */}
                {!isPlaying && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.7)',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: '3px solid rgba(255,255,255,0.3)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                  >
                    <span style={{ 
                      color: 'white', 
                      fontSize: '40px',
                      marginLeft: '5px'
                    }}>▶</span>
                  </div>
                )}

                {/* Bottom Controls */}
                <div style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '15px 20px'
                }}>
                  {/* Progress Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '10px'
                  }}>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: 'linear-gradient(to right, #007bff 0%, #007bff ' + 
                          ((currentTime / (duration || 1)) * 100) + 
                          '%, #555 ' + ((currentTime / (duration || 1)) * 100) + '%, #555 100%)',
                        cursor: 'pointer',
                        WebkitAppearance: 'none'
                      }}
                    />
                    <div style={{
                      color: 'white',
                      fontSize: '14px',
                      minWidth: '100px',
                      textAlign: 'right'
                    }}>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          fontSize: '24px',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                      >
                        {isPlaying ? '⏸' : '▶'}
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute();
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          fontSize: '20px',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                      >
                        {isMuted ? '🔇' : '🔊'}
                      </button>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFullscreen();
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '5px'
                      }}
                    >
                      {isFullscreen ? '⛶' : '⛶'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default AdvancedVideoPlayer;



