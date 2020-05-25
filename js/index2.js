var remove_animate = function () {
    let li = document.querySelectorAll('.animate__animated')
    for (node of li) {
        node.classList.remove("animate__animated");
    }
}

window.onload = function () {
    window.setTimeout(() => {
        remove_animate()
    }, 750)
};

$(function () {
    // document.querySelector('.screen').onfocus = function(){
    //     // document.querySelector('.screen').style.setProperty('display', 'none')
    //     alert(123)
    // }
    const animateCSS = (element, animation, prefix = 'animate__') =>
		// We create a Promise and return it
		new Promise((resolve, reject) => {
			const animationName = `${prefix}${animation}`;
			const node = document.querySelector(element);
			node.classList.add(`${prefix}animated`, animationName);

			// When the animation ends, we clean the classes and resolve the Promise
			function handleAnimationEnd() {
				node.classList.remove(`${prefix}animated`, animationName);
				node.removeEventListener('animationend', handleAnimationEnd);

				resolve('Animation ended');
			}
			node.addEventListener('animationend', handleAnimationEnd);
		});
    var app = new Vue({
        el: '#div',
        data: {
            tabPosition:'left',
        },
        methods: {
            show_app_proto_card:function(){
                element = document.querySelector('#app_proto_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s');
                document.querySelector('.screen').style.setProperty('display', 'block')
                animateCSS('#app_proto_card', 'fadeInLeft')
            },
            close_app_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#app_proto_card', 'zoomOut').then((message) => {
                    document.querySelector('#app_proto_card').style.setProperty('display', 'none')
                });
            },
            show_transport_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#transport_proto_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#transport_proto_card', 'fadeInLeft')
            },
            close_transport_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#transport_proto_card', 'zoomOut').then((message) => {
                    document.querySelector('#transport_proto_card').style.setProperty('display', 'none')
                });
            },
            show_internet_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#internet_proto_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#internet_proto_card', 'fadeInLeft')
            },
            close_internet_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#internet_proto_card', 'zoomOut').then((message) => {
                    document.querySelector('#internet_proto_card').style.setProperty('display', 'none')
                });
            },
            show_router_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#router_proto_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#router_proto_card', 'fadeInLeft')
            },
            close_router_proto_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#router_proto_card', 'zoomOut').then((message) => {
                    document.querySelector('#router_proto_card').style.setProperty('display', 'none')
                });
            },
            show_lower_proto_card:function(){
                this.$alert('暂无介绍', '底层网络协议', {
                    confirmButtonText: '确定',
                    center: true,
                    // callback: action => {
                    //   this.$message({
                    //     type: 'info',
                    //     message: `action: ${ action }`,
                    //   });
                    // }
                  });
            },
            show_app:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#app_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#app_card', 'fadeInLeft')
            },
            close_app_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#app_card', 'zoomOut').then((message) => {
                    document.querySelector('#app_card').style.setProperty('display', 'none')
                });
            },
            show_transport:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#transport_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#transport_card', 'fadeInLeft')
            },
            close_transport_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#transport_card', 'zoomOut').then((message) => {
                    document.querySelector('#transport_card').style.setProperty('display', 'none')
                });
            },
            show_internet:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#internet_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#internet_card', 'fadeInLeft')
            },
            close_internet_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#internet_card', 'zoomOut').then((message) => {
                    document.querySelector('#internet_card').style.setProperty('display', 'none')
                });
            },
            show_datalink:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#datalink_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#datalink_card', 'fadeInLeft')
            },
            close_datalink_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#datalink_card', 'zoomOut').then((message) => {
                    document.querySelector('#datalink_card').style.setProperty('display', 'none')
                });
            },
            show_physical:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#physical_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#physical_card', 'fadeInLeft')
            },
            close_physical_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#physical_card', 'zoomOut').then((message) => {
                    document.querySelector('#physical_card').style.setProperty('display', 'none')
                });
            },
            show_appdata_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#appdata_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#appdata_card', 'fadeInLeft')
            },
            close_appdata_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#appdata_card', 'zoomOut').then((message) => {
                    document.querySelector('#appdata_card').style.setProperty('display', 'none')
                });
            },
            show_tcpheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#tcpheader_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#tcpheader_card', 'fadeInLeft')
            },
            close_tcpheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#tcpheader_card', 'zoomOut').then((message) => {
                    document.querySelector('#tcpheader_card').style.setProperty('display', 'none')
                });
            },
            show_ipheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#ipheader_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#ipheader_card', 'fadeInLeft')
            },
            close_ipheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#ipheader_card', 'zoomOut').then((message) => {
                    document.querySelector('#ipheader_card').style.setProperty('display', 'none')
                });
            },
            show_macheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#macheader_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#macheader_card', 'fadeInLeft')
            },
            close_macheader_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#macheader_card', 'zoomOut').then((message) => {
                    document.querySelector('#macheader_card').style.setProperty('display', 'none')
                });
            },
            show_bits_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#bits_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#bits_card', 'fadeInLeft')
            },
            close_bits_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#bits_card', 'zoomOut').then((message) => {
                    document.querySelector('#bits_card').style.setProperty('display', 'none')
                });
            },
            show_layer:function(){
                document.querySelector('.screen').style.setProperty('display', 'block')
                element = document.querySelector('#layer_card')
                element.style.setProperty('display', 'block')
                element.style.setProperty('--animate-duration', '0.5s')
                animateCSS('#layer_card', 'fadeInLeft')
            },
            close_layer_card:function(){
                document.querySelector('.screen').style.setProperty('display', 'none')
                animateCSS('#layer_card', 'zoomOut').then((message) => {
                    document.querySelector('#layer_card').style.setProperty('display', 'none')
                });
			}
        }
    })

})

