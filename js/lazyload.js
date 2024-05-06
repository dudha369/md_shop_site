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
					
					let imageWrapper = img.parentNode;
					
					if (imageWrapper.parentNode.classList.contains("disabled")) {
						let item_name = img.id.slice(4);
						
						let w = (img.offsetWidth - 4.8) / 2; // border 4.8
						let h = (img.offsetHeight - 4.8) / 2; // border 4.8
						let d = Math.round(Math.sqrt(h * w * 2) * 2);
						
						let angle = Math.round(Math.atan(h / w) * (180 / Math.PI));
						
						let closestHeight = (g) => Array(105, 100, 80, 75)
							.reduce((p, c) => Math.abs(c - g) < Math.abs(p - g) ? c : p);
						
						let leftPosition = new Map();
						leftPosition.set(105, -48);
						leftPosition.set(100, -44);
						leftPosition.set(80, 0);
						leftPosition.set(75, -28);
						
						let cross = document.createElement("style");
						cross.innerHTML = `
#img_wrapper_${item_name}, #btn_${item_name} {
    cursor: not-allowed;
}
    
#img_${item_name} {
    border: solid red;
}
    
#btn_${item_name} {
    background-color: red;
}
    
#price_${item_name} {
    text-decoration: line-throught;
}
    
#img_wrapper_${item_name}::before, #img_wrapper_${item_name}::after {
    content: "";
    position: absolute;
    top: 47.9%;
    left: ${leftPosition.get(closestHeight(h))}px;
    width: ${d}px;
    height: 3px;
    background: red;
}
    
#img_wrapper_${item_name}::before {
    transform: rotate(${angle}deg);
}
    
#img_wrapper_${item_name}::after {
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
