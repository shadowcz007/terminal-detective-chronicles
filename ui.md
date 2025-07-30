<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Wanted Criminal</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&amp;family=Share+Tech+Mono&amp;display=swap" rel="stylesheet"/>
<style>
        body {
            background-color: #0c1424;
            font-family: 'Share Tech Mono', monospace;
            color: #64f0ff;
        }
        .container-bg {
            background-color: #1a233a;
            border: 2px solid #3a4c6f;
        }
        .info-box {
            border: 1px solid #3a4c6f;
            padding: 8px;
            position: relative;
        }
        .info-box::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            width: 10px;
            height: 10px;
            border-top: 2px solid #64f0ff;
            border-left: 2px solid #64f0ff;
        }
        .info-box::after {
            content: '';
            position: absolute;
            bottom: -1px;
            right: -1px;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid #64f0ff;
            border-right: 2px solid #64f0ff;
        }
        .text-glow {
            text-shadow: 0 0 5px #64f0ff, 0 0 10px #64f0ff;
        }
        .scanline-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: linear-gradient(rgba(12, 20, 36, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 6px 100%;
            animation: scan 10s linear infinite;
        }
        @keyframes scan {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
        }
        .decorative-border {
            border: 1px solid #3a4c6f;
            position: relative;
        }
        .corner {
            position: absolute;
            width: 8px;
            height: 8px;
            border-color: #64f0ff;
        }
        .top-left { top: -2px; left: -2px; border-top-width: 2px; border-left-width: 2px; }
        .top-right { top: -2px; right: -2px; border-top-width: 2px; border-right-width: 2px; }
        .bottom-left { bottom: -2px; left: -2px; border-bottom-width: 2px; border-left-width: 2px; }
        .bottom-right { bottom: -2px; right: -2px; border-bottom-width: 2px; border-right-width: 2px; }
        .decorative-line {
            background: #3a4c6f;
            height: 1px;
        }
        .decorative-line-v {
            background: #3a4c6f;
            width: 1px;
        }
        .glitch-text {
            animation: glitch 1.5s linear infinite;
        }
        @keyframes glitch{
          2%,64%{
            transform: translate(2px,0) skew(0deg);
          }
          4%,60%{
            transform: translate(-2px,0) skew(0deg);
          }
          62%{
            transform: translate(0,0) skew(5deg);
          }
        }
        .glitch-text:before,
        .glitch-text:after{
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text:before{
          left: 2px;
          text-shadow: -1px 0 red;
          clip: rect(44px, 450px, 56px, 0);
          animation: glitch-anim 5s infinite linear alternate-reverse;
        }
        .glitch-text:after{
          left: -2px;
          text-shadow: -1px 0 blue;
          clip: rect(85px, 450px, 140px, 0);
          animation: glitch-anim2 5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim{
          0% { clip: rect(42px, 9999px, 44px, 0); }
          5% { clip: rect(17px, 9999px, 96px, 0); }
        }
        @keyframes glitch-anim2{
          0% { clip: rect(68px, 9999px, 119px, 0); }
          5% { clip: rect(40px, 9999px, 123px, 0); }
        }
        .grid-bg {
            background-image:
                linear-gradient(to right, #3a4c6f44 1px, transparent 1px),
                linear-gradient(to bottom, #3a4c6f44 1px, transparent 1px);
            background-size: 20px 20px;
        }
    </style>
</head>
<body class="p-4 sm:p-8">
<div class="container-bg mx-auto max-w-7xl p-2 relative overflow-hidden">
<div class="scanline-overlay"></div>
<div class="border-2 border-[#3a4c6f] p-4 grid-bg">
<div class="flex justify-between items-center mb-4">
<div class="text-sm">BGONLINE.TC</div>
<div class="flex space-x-2">
<div class="w-6 h-1 bg-[#3a4c6f]"></div>
<div class="w-6 h-1 bg-[#3a4c6f]"></div>
<div class="w-6 h-1 bg-[#3a4c6f]"></div>
</div>
</div>
<div class="flex justify-center items-center space-x-2 mb-4">
<div class="h-1 flex-grow bg-[#3a4c6f]"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full bg-[#3a4c6f]"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
<div class="h-1 flex-grow bg-[#3a4c6f]"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="space-y-4">
<div class="info-box p-0">
<div class="bg-[#1a233a] p-2 flex items-center justify-between">
<h2 class="text-xl text-glow glitch-text" data-text="₩ 1,800,000">₩ 1,800,000</h2>
</div>
<div class="relative">
<img alt="A mugshot of an anime character with black hair." class="w-full h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2CtZfD8yZxl0lR94LFeGKQZ8CGXjfiuGqeaNtE01cTDQ-4n9BIP_pM57tAK5HiOpixAaq5AUSTqf-Pqo4mvNIjXapQnHhdHHeGaIxLrKbc6LwK5sCaHX_a_xhu8LEC_L6i9IL7yKVfJlTiytTx40RchHA96zdbDLltY37Xq1JOZJpHBFV-nz0WerbYNKaCFM16b4BXT3sI9HCJHVhPMN-dOmzUNJtuERFXYJ3Ve0Di6SOhY4p7ryV5k-kAxpwGBeEzLpa7b-XH7A2"/>
<div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center text-2xl font-bold tracking-widest text-glow">
                                L83645KDR
                            </div>
</div>
</div>
<div class="grid grid-cols-3 gap-2 text-xs text-center">
<div class="p-1 border border-[#3a4c6f]">ID no. L83645KDR</div>
<div class="p-1 border border-[#3a4c6f]">RETINA <span class="text-red-500">////////</span></div>
<div class="p-1 border border-[#3a4c6f]">VOICE PRINT <span class="text-red-500">////////</span></div>
</div>
</div>
<div class="space-y-4">
<div class="info-box">
<h2 class="text-sm uppercase text-red-400 text-glow">Wanted Criminal</h2>
<p class="text-2xl font-bold tracking-wider glitch-text" data-text="RHINT CELONIAS">RHINT CELONIAS</p>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="info-box">
<p class="text-xs text-gray-400">HEIGHT</p>
<p class="text-lg">5 FEET 11 INCHES</p>
</div>
<div class="info-box">
<p class="text-xs text-gray-400">WEIGHT</p>
<p class="text-lg">154.5 POUNDS</p>
</div>
</div>
<div class="decorative-line w-full my-2"></div>
<div class="grid grid-cols-2 gap-4">
<div class="info-box">
<p class="text-xs text-gray-400">AGE</p>
<p class="text-lg">27</p>
</div>
<div class="info-box">
<p class="text-xs text-gray-400">DOMI.</p>
<p class="text-lg">GANYMEDE</p>
</div>
</div>
<div class="decorative-line w-full my-2"></div>
<div class="info-box">
<p class="text-xs text-gray-400">CRIMINAL RECORD</p>
<p class="text-lg text-red-500">MURDER</p>
</div>
<div class="decorative-line w-full my-2"></div>
<div class="info-box">
<p class="text-xs text-gray-400">DNA FINGER PRINT</p>
<div class="h-12 mt-2 border border-[#3a4c6f] bg-black bg-opacity-20 flex items-center justify-center">
<span class="text-red-500 text-xs">/////////////</span>
</div>
</div>
</div>
</div>
<div class="flex justify-center items-center space-x-2 mt-4">
<div class="h-1 flex-grow bg-[#3a4c6f]"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full bg-[#3a4c6f]"></div>
<div class="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
<div class="h-1 flex-grow bg-[#3a4c6f]"></div>
</div>
</div>
</div>

</body></html>