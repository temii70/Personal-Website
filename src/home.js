import React from "react";
import Scrollspy from 'react-scrollspy';
import { FaGithub,FaLinkedin, FaChevronDown,FaBriefcase, FaGraduationCap, FaPlane,FaBasketballBall,FaDumbbell, FaTimes, FaBars} from "react-icons/fa"; /**font awesome */
import './index.css';
import {Link, animateScroll as scroll} from 'react-scroll';
import {easeInOut, motion,AnimatePresence} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import axios from "axios";
import SectionWrapper from "./SectionWrapper";
// infinte scroll for projects or circular gallery rolling gallery
//add circular text as title
{/**add a logo to  show the website, make it scroll and animate when it moves to the about section make it go DOWN like scroll down and add animations? when ur on a certain page it should glow  not as important */}

export default function Home () {
  const { ref:homeRef, inView: isHomeInView} = useInView({
threshold:0.01

})


// shows the state and sets the state
const [form, setForm] = useState({name:"", email:"", subject:"", message:""});

const [status, setStatus] = useState("");
// sets the status

const handleChange = (e) => {
  // change in input
setForm({...form, [e.target.name]: e.target.value})
// changes the input so like it keeps everything before and changes the information stored inside the target
};


const handleSubmit = async (e) => {
  // whenever the submit button is hit
  e.preventDefault(); 
  // stops the browser from reloading
  setStatus("Sending...");
  try {
    // uses axios to send the stuff to the backend server
    await axios.post("https://portfolio-te9i.onrender.com/send-email",form);
    setStatus("Message sent!")
    setForm({name:"",email:"",subject:"",message:""});
    setTimeout(() => setStatus(""),2000) 
  }
  catch (error){
    // didnt work
    setStatus("Failed to send message")
    setTimeout(()=> setStatus(""),2000)

  }
};


// projects section 
const projects = [
{id:1,
name: "ECG Research",
short_desc : "Research",
icon:"/ecg.png",
description : "I’m currently conducting research on multimodal deep learning models that integrate physiological signals, text, and image data for various downstream applications.",

tags : ["Research","Deep Learning"]
},

{id:2,
name: "Personal Website",
short_desc : "Web Development",
icon:"/website.png",

description : "I built this personal website using JavaScript, React, and Tailwind CSS to showcase my resume.",

tags : ["React","HTML", "TailWind", "CSS"]
},



{id:3,
name: "Lung Cancer Detection",
short_desc : "Project",
description : "I evaluated and tested seven machine learning algorithms on a Lung Cancer dataset. The best-performing model was the Support Vector Machine, achieving a Recall of 99%, Accuracy of 94%, Precision of 95%, and a F1 Score of 97%.",
icon:"/lungcancer.jpg",
tags : ["Machine Learning", "Data Analysis"],
link: "https://colab.research.google.com/gist/temii70/b300e9ca79168cc0b1c82c9110a06e56/models.ipynb"

},


{id:4,
name: "Alzheimer's Speech Research",
short_desc : "Research",
description : "I conducted research using an audio dataset to perform classification and regression tasks for the early detection of dementia and mild cognitive impairment (MCI). As part of the ICASSP 2025 SPGC challenge, I developed a random forest model to classify patients into three categories with corresponding scores. To improve prediction performance, I explored self-supervised learning techniques and utilized pre-trained models from previous research, to enhance metrics such as F1 score, recall, precision, and RMSE.",
icon:"/brain.jpg",
tags : ["Machine Learning", "Research"]





},



{
id:5,
name: "Emotion Detection",
short_desc : "Project",
description : "I built a Convolutional Neural Network using TensorFlow and integrated it with OpenCV for real-time emotion detection.",
icon:"/emotion.png",
tags : ["Machine Learning", "Data Analysis","Deep Learning"]


},

{id:6,
name: "App",
short_desc : "Project",
description : "I developed a Basketball Chatbot using Python, pulling data from a Kaggle SQL database with over 4,800 NBA players and 30 teams using Swift, SQL, and Python.",
icon:"/basketball.png",
tags : ["Swift", "IOS", "SQL"],
link: "https://github.com/temii70/NBAChatbot"


},


];
// for projects background
const [selected, setSelected] = useState(null);

// so messy
const vantaRef = useRef(null);
// pass to a div
const [vantaEffect, setVantaEffect] = useState(null);

useEffect(() => {
  if (!vantaEffect) {
    setVantaEffect(
      NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1,
        scaleMobile: 0.5,
        color: 0x555555,
        backgroundColor: 0x000000,
        points: 20.0,
        maxDistance: 14.0,
        spacing: 10.0,
      })
    );
  }


  return () => {
    if (vantaEffect) vantaEffect.destroy();
  };
}, [vantaEffect]);

// this is used to see if the main page is active or not


const [menuOpen, setMenuOpen] = useState(false);


// main website
return (
  

  <div  className="relative min-h-screen font-sans bg-cover bg-center"> {/**gray background making the div atleast as tall as fullscreen and uses font sans */}
    {/*header section relative means any child element with abs or fixed positioning will use this container as a refrence instead of whole page*/}
<header className={`fixed top-0 w-full flex items-center justify-between px-4 sm:px-8 py-4 z-50  
  ${(!isHomeInView  || menuOpen) ? 'bg-black/100 backdrop-blur-lg border-b border-white/10 shadow-md' : 'bg-transparent'}
`}>



  {/* Left: Logo */}
  <a href="/" className="hover:opacity-80 transition duration-300 hover:text-teal-400">
    <img
      src="/logowhite.png"
      alt="temi logo"
      className="h-10 w-auto object-contain"
    />
  </a>

  {/* Center: Navigation */}
  <Scrollspy
    items={['Home','About','Experience','Projects','Activities','Contact']}
    currentClassName="text-blue-400 font-bold"
    className="hidden sm:flex space-x-8 text-white justify-center sm:space-x-6 text-white"
  >
    <Link to="Home" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer text-white">Home</Link>
    <Link to="About" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer">About</Link>
    <Link to="Experience" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer">Experience</Link>
    <Link to="Projects" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer">Projects</Link>
    <Link to="Activities" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer">Activities</Link>
    <Link to="Contact" smooth duration={1000} className="hover:text-teal-400 transition font-bold cursor-pointer">Contact</Link>
  </Scrollspy>







  {/* Right: Social Icons */}
  <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 text-white text-sm sm:text-base">
    <a href="https://github.com/temii70" className="hover:text-teal-400 transition" target="_blank" rel="noopener noreferrer">
      <FaGithub size={20} />
    </a>
    <a href="https://www.linkedin.com/in/temi-otun-297801250/" className="hover:text-teal-400 transition" target="_blank" rel="noopener noreferrer">
      <FaLinkedin size={20} />
    </a>
    {/* hamburger */}

      <button className="sm:hidden text-white hover:text-teal-400" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

  </div>



</header>

{menuOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 z-40"
    onClick={() => setMenuOpen(false)}
  />
)}

{/* menu overlay when open */}

  {/* Overlay when menu is open */}
     
      {/* Mobile Nav Dropdown */}
      <div
        className={`fixed top-16 left-0 w-full bg-black z-50 sm:hidden flex flex-col items-center space-y-4 py-6 transition-all duration-300 ease-in-out hover:text-teal-400 ${
          menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {['Home', 'About', 'Experience', 'Projects', 'Activities', 'Contact'].map((item) => (
          <Link
            key={item}
            to={item}
            smooth
            duration={800}
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg py-2 font-bold hover:text-teal-400 transition"
          >
            {item}
          </Link>
        ))}
      </div>









   {/* Intro Section */}
<main
  ref={homeRef}
  id="Home"
  className="relative h-screen bg-cover bg-center flex flex-col items-center justify-center text-center px-6 sm:px-12"
  style={{ backgroundImage: "url('/vegas.png')" }}
>
  <p className="text-2xl font-semibold text-white" style={{ textShadow: '1px 1px 4px rgba(0,0,0,1)' }}>
    Hi! my name is
  </p>

  <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-white">
    Temi Otun
  </h1>

  <p className="text-white text-lg sm:text-xl font-semibold max-w-xl" style={{ textShadow: '2px 2px 6px rgba(0,0,0,1)' }}>
    I am a Student Researcher passionate about ML and software development.
  </p>

  <Link
    to="About"
    smooth
    duration={500}
    offset={4}
    className="absolute bottom-28 sm:bottom-20 bg-white text-black font-semibold tracking-widest px-6 py-2 rounded-full hover:text-blue-400 transition duration-300 cursor-pointer animate-bounce"
  >
    <FaChevronDown className="text-gray-800 text-xl" />
  </Link>

  <p
    className="absolute bottom-4 text-white text-sm font-semibold"
    style={{ textShadow: '1px 1px 4px rgba(0,0,0,1)' }}
  >
    Background: Grand Canyon by Temi Otun
  </p>
</main>









{/* About Me */}
<SectionWrapper id="About" className= "dark:bg-neutral-100 dark:text-black">
<h2 className="text-4xl font-bold mb-24" 

> About Me</h2>


<div className= "max-w-5xl w-full flex flex-col md:flex-row items-start md:items-start md:gap-6 px-4 sm:px-6">
  {/* wfull means take up full width of parent grid means turn to css grind grid-cols-1 is use 1 for small screens grid-cols-2 means switch to medium on big screens and gap 12 adds spaces horziontally and vertically */}

{/* Left Section */}
<img src= "/temp.jpg" alt= "Temi Otun" className=" self-center -mt-10 mb-6 md:mb-0 w-60 h-60 sm:w-72 sm:h-72 md:w-[26rem] md:h-[26rem] rounded-full "/>

{/* Bio Section */}
<div className="flex flex-col mb-6 md:items-start text-base leading-relaxed px-4 sm:px-6 w-full max-w-3xl"
  
  >
  
<p className= "text-base leading-relaxed text-left " style={{fontFamily:" 'Work Sans',sans-serif"}}

 
 
  transition={{duration: 0.8, ease: "easeOut"}}> I am a Computer Science student specializing in Artificial Intelligence at the University of Alberta. I have programming experience in C, Python, and SQL. Currently, I am completing a work semester at Dr. Wishart's Lab, where I apply machine learning and deep learning techniques alongside data analysis in the field of meteorology.</p>
 <p className= "mt-4 text-base leading-relaxed text-left" style={{fontFamily:" 'Work Sans',sans-serif"}} 
 
  
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}> I am also a member of Dr. Greiner's lab, helping out in  projects focused on AI-driven survival and disease prediction. In my free time, I enjoy going to the gym, reading books and manga, and playing basketball. </p>


<a href ="/TemiOtunresumewebsite.pdf" 
  className="self-center mt-6 inline-block bg-gray-900 text-white font-semibold tracking-widest px-5 py-3 hover:bg-gray-700 hover:text-blue-400 dark:bg-gray-300 dark:text-black dark:hover:bg-white transition duration-300 hover:scale-105 cursor-pointer"
 download  

  
  transition={{duration: 0.8, ease: "easeOut"}}> Download Resume</a>
  </div>

</div>

</SectionWrapper>













{/* Experience Section */}

<SectionWrapper id="Experience" className="bg-zinc-900 text-white">

   <motion.h2  className="text-4xl font-bold text-center mb-12"
    initial = {{opacity:0,y:20}}
    whileInView={{opacity: 1,y: 0}}
    transition= {{duration:0.7 ,ease: "easeOut"}}
    viewport= {{once:true}}>Work Experience 
    </motion.h2>

  <motion.div className= "relative w-full max-w-6xl flex flex-col space-y-12"
    initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.9, // time between animations
      },
    },
  }}
  >
{/* vertical Line */}
    {/* Job Item */}

<motion.div
  className="flex flex-col md:flex-row items-start gap-6 px-4 sm:px-6"
  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Left Column: Title + Date (mobile layout includes icon) */}
  <div className="w-full md:w-1/3 flex flex-col md:items-end md:text-right space-y-2">
    {/* Mobile view: title + date + icon side-by-side */}
    <div className="flex items-center md:hidden gap-2">
      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
        <FaBriefcase className="text-white text-sm" />
      </div>
      <div>
        <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
        <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
      </div>
    </div>

    {/* Desktop view: title + date stacked (icon shown separately in center column) */}
    <div className="hidden md:block">
      <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
      <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
    </div>
  </div>

  {/* Center Column: ICON (only desktop) */}
  <div className="hidden md:flex flex-col items-center">
    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
      <FaBriefcase className="text-white text-xl" />
    </div>
    <div className="w-px bg-gray-600 h-full mt-2" />
  </div>

  {/* Right Column: Company + Description */}
  <div className="w-full md:w-1/2">
    <h4 className="text-lg font-bold">TMIC Wishart Node</h4>
    <p className="text-sm mt-2 text-white mb-2 font-semibold">
      At Wishart’s Lab, I’ve been working on meteorological forecasting...
    </p>
    <p className="text-sm text-gray-200 font-semibold">
      I’ve gained a deep understanding of ARIMA, SARIMA, LSTMs, and more...
    </p>
  </div>
</motion.div>


    {/* second job*/}
    {/* ... */}
     {/* Job Item */}
  <motion.div
  className="flex flex-col md:flex-row items-start gap-6 px-4 sm:px-6"
  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Left Column: Title + Date (mobile layout includes icon) */}
  <div className="w-full md:w-1/3 flex flex-col md:items-end md:text-right space-y-2">
    {/* Mobile view: title + date + icon side-by-side */}
    <div className="flex items-center md:hidden gap-2">
      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
        <FaBriefcase className="text-white text-sm" />
      </div>
      <div>
        <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
        <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
      </div>
    </div>

    {/* Desktop view: title + date stacked (icon shown separately in center column) */}
    <div className="hidden md:block">
      <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
      <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
    </div>
  </div>

  {/* Center Column: ICON (only desktop) */}
  <div className="hidden md:flex flex-col items-center">
    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
      <FaBriefcase className="text-white text-xl" />
    </div>
    <div className="w-px bg-gray-600 h-full mt-2" />
  </div>

  {/* Right Column: Company + Description */}
  <div className="w-full md:w-1/2">
    <h4 className="text-lg font-bold">TMIC Wishart Node</h4>
    <p className="text-sm mt-2 text-white mb-2 font-semibold">
      At Wishart’s Lab, I’ve been working on meteorological forecasting...
    </p>
    <p className="text-sm text-gray-200 font-semibold">
      I’ve gained a deep understanding of ARIMA, SARIMA, LSTMs, and more...
    </p>
  </div>
</motion.div>

    {/*  third job */}
     {/* Job Item */}

   <motion.div
  className="flex flex-col md:flex-row items-start gap-6 px-4 sm:px-6"
  variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* Left Column: Title + Date (mobile layout includes icon) */}
  <div className="w-full md:w-1/3 flex flex-col md:items-end md:text-right space-y-2">
    {/* Mobile view: title + date + icon side-by-side */}
    <div className="flex items-center md:hidden gap-2">
      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
        <FaBriefcase className="text-white text-sm" />
      </div>
      <div>
        <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
        <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
      </div>
    </div>

    {/* Desktop view: title + date stacked (icon shown separately in center column) */}
    <div className="hidden md:block">
      <h3 className="text-base font-bold text-blue-400">Research Assistant</h3>
      <p className="text-sm text-gray-400 font-semibold">Jan 2025 – Present</p>
    </div>
  </div>

  {/* Center Column: ICON (only desktop) */}
  <div className="hidden md:flex flex-col items-center">
    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
      <FaBriefcase className="text-white text-xl" />
    </div>
    <div className="w-px bg-gray-600 h-full mt-2" />
  </div>

  {/* Right Column: Company + Description */}
  <div className="w-full md:w-1/2">
    <h4 className="text-lg font-bold">TMIC Wishart Node</h4>
    <p className="text-sm mt-2 text-white mb-2 font-semibold">
      At Wishart’s Lab, I’ve been working on meteorological forecasting...
    </p>
    <p className="text-sm text-gray-200 font-semibold">
      I’ve gained a deep understanding of ARIMA, SARIMA, LSTMs, and more...
    </p>
  </div>
</motion.div>

   <motion.h2 className= "text-4xl font-bold text-center pr-[110px] "
      variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}
      > 
      Education
    </motion.h2>


<motion.div className="flex flex-col md:flex-row items-start gap-6 px-4 sm:px-6  "
   variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}

>
  {/* left degree and date */}
  <div className= " w-full md:w-1/3  text-left md:text-right md:pr-4 ">
  <h3 className="text-xl font-bold text-teal-400">
  Bachelor of Science
  </h3>
  <p className="text-sm text-white  font-semibold"> 2022-2027</p>


  </div>


  {/* center icon */}
  <div className = "flex justify-center md:flex-col md:items-center mb-4 md:mb-0 ">
    <div className= "w-10 h-10 bg-gray-700  rounded-full flex items-center justify-center">
    <FaGraduationCap className = "text-white text-xl">

    </FaGraduationCap>

    </div>

  </div>

{/* right */}
   <div className="w-full md:w-1/2 mb-24 ">
        <h4 className="text-lg font-bold text-white">University of Alberta</h4>
        <p className="text-sm  font-semibold">
          Major in Computer Science, specializing in Artificial Intelligence.
        </p>
      </div>


</motion.div>







    </motion.div>

  
</SectionWrapper>



 













 {/* Projects */}

 <section id="Projects" ref={vantaRef} className="min-h-screen relative text-white px-8 pt-40 font-sans sm:pb-64 md:pb-64 lg:pb-96   " style={{fontFamily:" 'Work Sans',sans-serif"}}>


   <h2  className="text-4xl font-bold text-center mb-16" style={{textShadow:'1px 1px 4px rgba(0,0,0,1)'}}>
   
      Projects

    </h2>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 max-w-6xl mx-auto px-4 sm:px-0 pb-16">
  {projects.map((proj) => (
    <motion.div
    key = {proj.id}
    className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition duration-300 "
    whileHover={ {scale:1.05}}
    onClick = {() => setSelected(proj)}
    
    >

    {/* image */}
    <img
    src = {proj.icon}
    alt = {proj.name}
    className = "w-full h-60 object-cover  transform group-hover:scale-105 transition duration-300 "
    >
    
    </img>
    <div
    className="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-70 transition duration-300 flex flex-col justify-center items-center text-center px-4  ">
    <h3 className= "text-white text-lg font-bold ">
      {proj.name}

    </h3>

    <p
    className="text-md text font-bold text-white  "
    > {proj.short_desc}

    </p>
    

    </div>
     
    </motion.div>
  ))}
</div>

<AnimatePresence>
{selected && ( <motion.div
 className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 "
 initial = {{opacity:0}}
 animate = {{opacity:1}}
 exit = {{opacity:0}}
 onClick = { ()=> setSelected(null)}
 >

<motion.div
className=" bg-white text-black p-6 rounded-lg max-w-xl w-full text-center"
initial = {{scale:0}}
animate = {{scale:1}}
exit = {{scale:0.8}}
onClick={(e)=>e.stopPropagation()}
>

<div>
<h3 className = "text-xl font-bold text-blue-400"> {selected.name}</h3>

<p className = "text- mt-2 dark:text-black mb-15 text-left leading-relaxed break-words"> {selected.description}</p>
 
{selected.link && (
  <a
  href = {selected.link}
  target = "_blank"
  rel = "noopener noreferrer"
  className="px-4 py-2  text-blue-400 rounded hover: transition">
    Link
  </a>
)} 


</div>
<button
  onClick = {()=> setSelected(null)}
  className = "mt-4 px-4 py-2 bg-teal-400 text-black rounded hover: bg-teal-400 transition hover:scale-105"

>
  Close

</button>






</motion.div>

</motion.div>
)}

</AnimatePresence>
{/* <div className="h-32 sm:h-48 lg:h-64" /> */}
 </section>

  
 















{/* Activities */}

<section id="Activities" className="min-h-screen font-sans bg-white dark:text-black flex pt-20 flex-col items-center justify-start px-4 sm:px-8 " style={{fontFamily:" 'Work Sans',sans-serif"}}>

   <motion.h2  className="text-4xl font-bold text-center pb-24"
    initial = {{opacity:0,y:20}}
    whileInView={{opacity: 1,y: 0}}
    transition= {{duration:0.7 ,ease: "easeOut"}}
    viewport= {{once:true}}>Activities 
    </motion.h2>


  <motion.div className= "relative w-full max-w-6xl flex flex-col space-y-12"
    initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.9, // time between animations
      },
    },
  }}>




  {/* Travelling Section */}
    <motion.div  className="flex items-start gap-8"
 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>

{/* Traveling Section */}

  <div className="max-w-5xl w-full flex flex-col md:flex-row items-start md:gap-5">

    {/* Image Container */}
    <div className="w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] flex-shrink-0 overflow-hidden rounded shadow bg-black">
      <img src="/traveling.png" alt="Temi Otun" className="w-full h-full object-cover object-center" />
    </div>

    <div className="mt-4 md:mt-0">
      <motion.h3
        className="font-semibold text-xl mb-5 flex items-center gap-2"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Traveling <FaPlane className="text-blue-400" />
      </motion.h3>

      <motion.p
        className="text-base leading-relaxed text-left"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        I’ve had the opportunity to travel to many countries, including the United States,
        France, the United Kingdom, and Nigeria. One of the
        most memorable places I’ve visited is the Grand Canyon in Arizona. I was truly awestruck
        by its immense size and natural beauty. I hope to continue exploring the world, with East
        Asia and Latin America next on my list.
      </motion.p>
    </div>

  </div>
</motion.div>

{/* Basketball Section */}

    <motion.div  className="flex items-start gap-8 "
 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>

  <div className= "max-w-5xl w-full flex flex-col md:flex-row items-start md:items-start md:gap-5">


  <div className= "w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] flex-shrink-0 overflow-hidden rounded shadow bg-black">
  {/* wfull means take up full width of parent grid means turn to css grind grid-cols-1 is use 1 for small screens grid-cols-2 means switch to medium on big screens and gap 12 adds spaces horziontally and vertically */}

<img src= "/bball.png" alt= "Temi Otun" className="w-full h-full object-cover object-center "/>
</div>


<div>
<motion.h3 className= "font-semibold text-xl mb-5 flex items-center gap-2" style={{fontFamily:" 'Work Sans',sans-serif"}}

 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}> Basketball <FaBasketballBall className="text-blue-400"></FaBasketballBall></motion.h3>


<motion.p className= "text-base leading-relaxed text-left" style={{fontFamily:" 'Work Sans',sans-serif"}}

 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}> 
 I’ve been playing basketball since middle school, competing for both my 
 junior and senior high school teams. I love the game and still
  play recreationally. I’m also an active NBA fan, my favorite 
 team is the Los Angeles Lakers, as I’m a big LeBron James Fan.</motion.p>

</div>

</div>





  </motion.div>



{/* Working Out Section */}

    <motion.div  className=" w-full flex flex-col md:flex-row items-start gap-6"
 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>



  <div className= "max-w-5xl w-full flex flex-col md:flex-row items-start md:items-start md:gap-5">
   
    <div className="w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] flex-shrink-0 overflow-hidden rounded shadow bg-black">
  {/* wfull means take up full width of parent grid means turn to css grind grid-cols-1 is use 1 for small screens grid-cols-2 means switch to medium on big screens and gap 12 adds spaces horziontally and vertically */}


<img src= "/goodlife.webp" alt= "Temi Otun" className=" w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] object-cover rounded shadow"/>

</div>


<div>
<motion.h3 className= "font-semibold text-xl mb-5 flex items-center gap-2" style={{fontFamily:" 'Work Sans',sans-serif"}}

 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}> Fitness Training <FaDumbbell className="text-blue-400"></FaDumbbell></motion.h3>


<motion.p className= "text-base leading-relaxed text-left mb-44 " style={{fontFamily:" 'Work Sans',sans-serif"}}

 
  variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>I’ve been working out for about seven years, starting in middle school, and I’m a very active gym-goer. When I’m not busy with school or research, 
  you’ll most likely find me in the gym. </motion.p>

</div>

</div>





  </motion.div>



  </motion.div>


</section>

























{/* Contact Section */}




<SectionWrapper id="Contact" className="bg-neutral-100 dark:text-black">

   <motion.h2  className="text-4xl font-bold text-center mb-8 -mt-6"
    initial = {{opacity:0,y:20}}
    whileInView={{opacity: 1,y: 0}}
    transition= {{duration:0.7 ,ease: "easeOut"}}
    viewport= {{once:true}}>Contact 
    </motion.h2>


  <motion.div className= "relative w-full max-w-6xl flex flex-col space-y-12"
    initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.6 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.9, // time between animations
      },
    },
  }}>


    <motion.div className="flex flex-col justify-center "
        variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>

    
    
    <h3 className=" text-2xl font-bold text-center  font-semibold text-xl pb-3 " >
        Let's Connect!

    </h3>
    <p className="text-sm dark:text-black text-center">
      Please contact me directly at <a href ="mailto:Otun226@gmail.com" class="underline">Otun226@gmail.com</a> or through this form.
    </p>

    </motion.div>

  <motion.div className="flex flex-col justify-center "
        variants = {{
    hidden: {opacity : 0, y:50},
    visible : {opacity: 1,y:0},
  }}
  transition={{duration: 0.8, ease: "easeOut"}}>
<div className=" w-full px-6 sm:px-10 max-w-2xl mx-auto">
    <form onSubmit = {handleSubmit} className="max-w-xl mx-auto space-y-6 dark:text-white ">
    <input name= "name"
      value = {form.name}
      onChange={handleChange}
      placeholder="Name"
      className = "w-full bg-gray-400 p-3 rounded placeholder:text-black"
      required
    />
    <input
    name= "email"
    value = {form.email}
    onChange={handleChange}
    placeholder=" Email Address"
    className="w-full bg-gray-400 p-3 rounded placeholder:text-black "
    required
    
    
    />
      <input
    name= "subject"
    value = {form.subject}
    onChange={handleChange}
    placeholder="Subject"
    className="w-full bg-gray-400 p-3 rounded placeholder:text-black"
    required
    />

{/* text area makes it look cleaner */}
        <textarea
    name= "message"
    value = {form.message}
    onChange={handleChange}
    placeholder="Message"
    rows={5}
    className="w-full bg-gray-400 p-3 rounded placeholder:text-black"
    required
    
    />
    <div  className="flex justify-center  ">
    <button
      type= "submit"
      className="bg-gray-400 dark:text-black px-6 py-3 rounded font-bold hover:text-blue-400 transition duration-300 shadow-lg hover:bg-white -mt-3 "
    >
      {status && (
        <p className="text-center mt-4 text-sm font-semibold dark:text-teal-400   "> {status}</p>
      )}
      Send Message
    </button>
    </div>
   {/* bg-gray-400 text-white font-semibold tracking-widest px-5 py-3 hover:bg-white hover:text-blue-400 transition duration-300 cursor-pointer */}

    </form>
   </div> 
    </motion.div>


</motion.div>



</SectionWrapper>


<motion.footer 
className=" mt-12  text-center text-sm dark:text-black shadow-inner "
   initial = {{opacity: 0,y: 50}}
   whileInView={{opacity: 1,y: 0}}
   viewport={{once:true}}
  transition={{duration: 0.8, ease: "easeOut", delay:0.5}}

>

&copy; {new Date().getFullYear()} Temi Otun, All rights reserved.
</motion.footer>

          




</div>

  );




}

