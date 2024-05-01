document.addEventListener("DOMContentLoaded", function () {
	let lazyloadImages;
	
	if ("IntersectionObserver" in window) {
		lazyloadImages = document.querySelectorAll(".lazy");
		let imageObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					let img = entry.target;
					img.src = img.dataset.src;
					img.classList.remove("lazy");
					imageObserver.unobserve(img);
					
					const imageWrapper = img.parentNode;
					
					if (imageWrapper.parentNode.classList.contains("disabled")) {
						
						const w = (img.offsetWidth - 4.8) / 2; // border 4.8
						const h = (img.offsetHeight - 4.8) / 2; // border 4.8
						const d = Math.round(Math.sqrt(h * w * 2) * 2);
						
						const angle = Math.round(Math.atan(h / w) * (180 / Math.PI));
						
						const closestHeight = (g) => Array(105, 100, 80, 75)
							.reduce((p, c) => Math.abs(c - g) < Math.abs(p - g) ? c : p);
						
						let leftPosition = new Map();
						leftPosition.set(105, -48);
						leftPosition.set(100, -44);
						leftPosition.set(80, 0);
						leftPosition.set(75, -28);
						
						const cross = document.createElement("style");
						cross.innerHTML = `
#img_wrapper_${img.id.slice(4)}, #btn_${img.id.slice(4)} {
    cursor: not-allowed;
}
    
#img_${img.id.slice(4)} {
    border: solid red;
}
    
#btn_${img.id.slice(4)} {
    background-color: red;
}
    
#price_${img.id.slice(4)} {
    text-decoration: line-throught;
}
    
#img_wrapper_${img.id.slice(4)}::before, #img_wrapper_${img.id.slice(4)}::after {
    content: "";
    position: absolute;
    top: 47.9%;
    left: ${leftPosition.get(closestHeight(h))}px;
    width: ${d}px;
    height: 3px;
    background: red;
}
    
#img_wrapper_${img.id.slice(4)}::before {
    transform: rotate(${angle}deg);
}
    
#img_wrapper_${img.id.slice(4)}::after {
    transform: rotate(-${angle}deg);
}
`;
						
						imageWrapper.appendChild(cross);
					}
				}
			});
		});
		
		lazyloadImages.forEach(function (image) {
			imageObserver.observe(image);
		});
	} else {
		let lazyloadThrottleTimeout;
		lazyloadImages = document.querySelectorAll(".lazy");
		
		function lazyload() {
			if (lazyloadThrottleTimeout) {
				clearTimeout(lazyloadThrottleTimeout);
			}
			
			lazyloadThrottleTimeout = setTimeout(function () {
				let scrollTop = window.pageYOffset;
				lazyloadImages.forEach(function (img) {
					if (img.offsetTop < (window.innerHeight + scrollTop)) {
						img.src = img.dataset.src;
						img.classList.remove('lazy');
					}
				});
				if (lazyloadImages.length == 0) {
					document.removeEventListener("scroll", lazyload);
					window.removeEventListener("resize", lazyload);
					window.removeEventListener("orientationChange", lazyload);
				}
			}, 20);
		}
		
		document.addEventListener("scroll", lazyload);
		window.addEventListener("resize", lazyload);
		window.addEventListener("orientationChange", lazyload);
	}
})
