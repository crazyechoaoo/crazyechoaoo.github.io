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
	var PACKET_LOSS_RATIO = 0 //loss ratio;
	var WINDOW_SIZE = 5 //window size;
	const FREQUENCY = 500 //invoke clocktime() frequency
	var resend_time = 0;
	var S1 = new Socket("113.66.15.125", 8000)
	var S2 = new Socket("47.102.67.1", 80)
	var ALLSOCKET = [S1, S2] //Addr:Socket
	var EVENTLIST = []
	var btnRequestEnabled = true
	var btnShutdownEnabled = false
	var eventToggle = {
		event1: false,
		event2: false,
		event3: false,
		event4: false,
		event5: false,
		event6: false,
		event7: false,
		event8: false,
		event9: false,
	}
	var equal = function (a, b) {
		//对比两个对象，键和值都相同返回true
		var result = true
		if (Object.keys(a).length != Object.keys(b).length) {
			result = false
			return result
		}
		for (let key in a) {
			if (!(key in b)) {
				result = false
				break
			}
			if (a[key] != b[key]) {
				result = false
				break
			}
		}
		return result
	}

	var app = new Vue({
		el: '#div',
		data: {
			server_timer: 0,
			client_timer: 0,
			Client: S1,
			Server: S2,
			inputEnabled:!btnRequestEnabled,
			packetInfo: [],
			eventTable: [{
					id: 'event1',
					event: '握手第一步的数据报丢失'
				},
				{
					id: 'event2',
					event: '握手第二步的数据报丢失'
				},
				{
					id: 'event3',
					event: '握手第三步的数据报丢失'
				},
				{
					id: 'event4',
					event: '挥手第一步的数据报丢失'
				},
				{
					id: 'event5',
					event: '挥手第二步的数据报丢失'
				},
				{
					id: 'event6',
					event: '挥手第三步的数据报丢失'
				},
				{
					id: 'event7',
					event: '挥手第四步的数据报丢失'
				},
				{
					id: 'event8',
					event: '试图与一个不处于监听状态的端口建立连接'
				},
				{
					id: 'event9',
					event: '试图连接一个不存在的主机'
				},
			]
		},
		methods: {
			request() {
				//请求连接
				if (!btnRequestEnabled) {
					return
				}
				btnRequestEnabled = !btnRequestEnabled
				app.inputEnabled = !btnRequestEnabled
				S1.init()
				S2.init()
				EVENTLIST = Object.values(eventToggle)
				S1.pushPacket(S2.addr.ip, S2.addr.port, "SYN-SENT", ["SYN"], 0)
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (row.src == S1.addr.ip) {
					return 'warning-row'
				} else {
					return 'success-row'
				}
			},
			shutdown() {
				if (!btnShutdownEnabled) {
					// this.$message({
					// 	showClose: true,
					// 	message: '还未建立连接',
					// 	type: 'error'
					// });
					return
				}
				EVENTLIST = Object.values(eventToggle)
				btnShutdownEnabled = !btnShutdownEnabled
				S1.pushPacket(S2.addr.ip, S2.addr.port, "FIN-WAIT-1", ["FIN"], 0);
			},
			send10() {

				datasize = 1024 * 4
				S1.pushData(S2.addr.ip, S2.addr.port, datasize)
			},
			reset() {
				location.href = './tcp.html'
			},
			handleSelectionChange(val) {
				// eventToggle is a object
				for (var key in eventToggle) {
					eventToggle[key] = false
				}
				// val is a array
				for (var obj of val) {
					eventToggle[obj.id] = true
				}
			},
			click_transport_layer_2() {
				this.$notify({
					title: '网际层',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">负责点到点的传输(这里的“点”指主机或路由器)，而传输层负责端到端 (end-to-end)的传输(这里的“端”指源主机和目的主机)。</p>'
				});
			},
			click_transport_layer_1() {
				this.$notify({
					title: '传输层',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">传输层负责在两个终端应用之间传输应用层的报文。这里我们使用了传输层的TCP协议来传输应用层的报文。<p class="illustration">当用户需要发送数据时，传输层会根据应用层的报文创建相应的 Socket，然后Socket将应用层报文分成多份，加上TCP的首部。封装成TCP报文段传递给网络层。</p><p class="illustration">当传输层接收到来自网络层的数据报时，传输层会根据TCP报文段的头部信息中的目标端口，将报文段传给指定的 Socket。Socket 收集到所有的报文段后，将报文段转换为应用层报文，然后应用软件读取Socket中的应用层报文，经过处理后将报文中的内容呈现给用户。</p>'
				});
			},
			click_internet_layer_1() {
				// this.$alert('负责点到点的传输(这里的“点”指主机或路由器)，而传输层负责\
				// 端到端 (end-to-end)的传输(这里的“端”指源主机和目的主机)。',
				// 	'网际层', {
				// 		confirmButtonText: '确定'
				// 	});
				this.$notify({
					title: '网络层',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">网络层负责为互联网上的不同主机提供通信服务，要注意和传输层区分开来，传输层的是负责在两个终端应用之间传输应用层的消息。也就是说网络层负责主机到主机（或路由器）之间的传输，而传输层负责应用进程到应用进程之间的传输</p><p class="illustration">互联网是由大量的异构网络通过路由器相互连接起来的。要想在互联网中找到目标主机，就需要网络层的IP协议，网络层将传输层递交的TCP报文段进行封装，在报文段前面加上IP首部，IP首部中包含目标主机的IP地址，互联网中的路由器根据目标主机的IP地址进行一系列的转发，最终找到目标主机，完成IP数据报的传输。在本例中，当网络层收到来自服务器的数据报时，网络层会将其中的报文段递交给传输层处理。</p>'
				});
			},
			click_internet_layer_2() {
				this.$notify({
					title: '网际层',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<p>负责点到点的传输(这里的“点”指主机或路由器)，而传输层负责端到端 (end-to-end)的传输(这里的“端”指源主机和目的主机)。</p>'
				});
			},
			click_user() {
				this.$notify({
					title: '应用层与用户',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">应用层主要是针对用户的需求提供解决方案，用户想要通过网络做到什么事，应用层就提供应用软件能满足用户需求的协议</p>\
					<p class="illustration">在本例中，用户要浏览网页，应用层就会提供HTTP协议给浏览器。用户在浏览器地址栏中输入一个网页地址，生成一个访问网页的请求，浏览器会将访问请求交给应用层，应用层生成相应的请求报文，将报文交给下一层（传输层）处理。</p>\
					<p class="illustration">远程计算机接收到请求后，会处理该请求，将网页资源发送给用户，应用层最终会得到来自远程计算机的网页数据，然后将网页数据递交给浏览器，由浏览器渲染网页内容并呈现给用户。</p>'
				});
			},
			format(percentage) {
				if (percentage === 0) return '计时器'
				if (percentage === 100) return '超时重传'
				return `${percentage}%`
			},
			show_status() {
				this.$notify({
					title: 'TCP连接的各种状态之间的关系',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><div style="width: 600px;margin:0 auto"><img width=600 src="./img/tcp_status.png"></div>'
				});
			},
			show_ex_case7() {
				this.$notify({
					title: '连接一个不处于监听状态的端口',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">连接一个不处于监听状态的端口，这种情况下客户端会收到“连接拒绝”的消息。</p>\
					<p class="illustration">在本例中，服务端本来就没有程序监听在这个接口，因此在服务端是无法完成连接的建立过程的。当客户端的SYN包到达服务端时,TCP协议没有找到监听的套接字，就会向客户端发送一个包含RST的报文，告诉客户端产生了错误。</p>'
				});
			},
			show_ex_case8() {
				this.$notify({
					title: '连接一个不存在的主机',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">由于目标主机不存在，客户端不会收到任何回复。</p>\
					<p class="illustration">在本例中，客户端起初是不知道目标主机不存在的。第一次超时重传的发生时</p>'
				});
			},
			show_ip_tips(){
				this.$notify({
					title: 'IP地址',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">整个的互联网就是一个单一的、抽象的网络。IP地址就是给互联网上的每一台主机〈或路由器）的每一个接口分配一个在全世界范围内是唯一的32位的标识符。IP地址的结构使我们可以在互联网上很方便地进行寻址。</p>\
					<p class="illustration">IP地址的编址方法共经历了三个阶段：(1)分类的IP地址。这是最基本的编址方法，在1981年就通过了相应的标准协议。(2)子网的划分。这是对最基本的编址方法的改进，其标准RFC 950在1985年通过。(3)构成超网。这是比较新的无分类编址方法。1993年提出后很快就得到推广应用。本节只讨论最基本的分类的IP地址。</p>\
					<p class="illustration">所谓“分类的IP地址”就是将IP地址划分为若干个固定类，每一类地址都由两个固定长度的字段组成，其中第一个字段是网络号(net-id),它标志主机(或路由器)所连接到的网络。一个网络号在整个互联网范围内必须是唯一的。第二个字段是主机号(host-id),它标志该主机（或路由器）。一台主机号在它前面的网络号所指明的网络范围内必须是唯一的。由此可见，一个IP地址在整个互联网范围内是唯一的。</p>\
					<div style="width: 600px;margin:0 auto"><img width=400 src="./img/show_ip_tips.png"></div>\
					<p class="illustration">其中特殊地址有0.0.0.0（当前主机）、255.255.255.255（子网的广播）、E类IP地址、127.0.0.1到127.255.255.255（回路测试地址）。</p>\
					<p class="illustration">从上图中，我们可以得出：A类IP地址范围1.0.0.1到126.255.255.254；B类IP地址范围128.0.0.1到191.255.255.254；C类IP地址范围192.0.0.1到223.255.255.254</p>'
				});
			},
			retify_port(str,num){
				port = parseInt(str)
				if(65535 >= port && port>= 1024 ){
				}else{
					this.$message({
						showClose: true,
						message: '端口号不符合标准',
						type: 'error'
					});
					this.Client.addr.port = 8000
				}
			},
			retify_size(str,num){
				size = parseInt(str)
				if(9 >= size && size>= 1 ){
				}else{
					this.$message({
						showClose: true,
						message: '窗口大小不符合标准',
						type: 'error'
					});
					this.Server.recvWindowSize = 5
				}
			},
			retify_mss(str,num){
				mss = parseInt(str)
				if(1460 >= mss && mss>= 256 ){
				}else{
					this.$message({
						showClose: true,
						message: '最大报文段不符合标准',
						type: 'error'
					});
					this.Server.maxSegmentSize = 1460
				}
			},
			show_mss_tips(){
				this.$notify({
					title: '最大报文段长度（MSS）',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">在本例中，客户端与服务端的默认MSS为1460。可以修改服务器的MSS，本例允许MSS在256~1460之间。这个MSS指的是TCP报文段中数据部分的最大长度，并不是整个TCP报文段长度。整个TCP报文段长度 = TCP首部长度 + TCP数据部分长度。</p>\
					<p class="illustration"> 最大报文段长度（MSS）表示TCP传往另一端的最大数据的长度。当一个连接建立时，连接的双方都要通告各自的MSS，可以在含有SYN的包中查看MSS值。</p>\
					<p class="illustration">MSS的值是在TCP三次握手建立连接的过程中，经通信双方协商确定的。如果链路层使用以太网的话，IP层的MTU（最大传输单元）是1500 byte，这样去掉IP数据报首部（20 byte），在去掉TCP首部（20 byte）后为1460 byte，此时在默认情况下TCP“选项”字段的MSS值为1460 byte = 1500 - 20 - 20。另外，在以太网中，最小帧长为64byte <= IP数据报首部（20 byte+在去掉TCP首部（20 byte）+TCP数据部分长度，因此TCP数据部分长度必须大于等于24B。而在Internet标准中，IP层的MTU是576 byte，那么此时TCP“选项”字段的MSS值为536 byte = 576 - 20 - 20。</p>'
				});
			},
			show_size_tips(){
				this.$notify({
					title: '窗口大小',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">客户端和服务器的接收窗口大小都默认为5（实际上远比5要大，但这里为了更清楚地展示，所以默认为5），可以通过修改该项改变服务器的接受窗口大小（0~9之间）。在建立连接（SYN）时，服务器会告诉客户端其接收窗口大小，客服端的发送窗口大小会设置为服务器接收窗口大小。</p>\
					<p class="illustration"> TCP是双工的协议，会话的双方都可以同时接收、发送数据。TCP会话的双方都各自维护一个“发送窗口”和一个“接收窗口”。其中各自的“接收窗口”大小取决于应用、系统、硬件的限制（TCP传输速率不能大于应用的数据处理速率）。各自的“发送窗口”则要求取决于对端通告的“接收窗口”，要求相同。</p>\
					<div style="width: 600px;margin:0 auto"><img width=600 src="./img/show_size_tips.png"></div>'
				});
			},
			show_port_tips(){
				this.$notify({
					title: '端口号',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration">端口号的主要作用是表示一台计算机中的特定进程所提供的服务。网络中的计算机是通过IP地址来代表其身份的，它只能表示某台特定的计算机，但是一台计算机上可以同时提供很多个服务，如数据库服务、FTP服务、Web服务等，我们就通过端口号来区别相同计算机所提供的这些不同的服务，如常见的端口号21表示的是FTP服务，端口号23表示的是Telnet服务端口号25指的是SMTP服务等。端口号一般习惯为4位整数，在同一台计算机上端口号不能重复，否则，就会产生端口号冲突。</p>\
					<p class="illustration"> 端口范围的划分：0~1023（知名端口号）和1024~65535（操作系统动态分配的端口号）。本例中发送端端口号允许修改为1024~65535。下图展示了一些知名端口号。</p>\
					<div style="width: 600px;margin:0 auto"><img width=600 src="./img/show_port_tips.png"></div>'
				});
			}
		}
	})

	var send = function (packet) {
		//该函数主要负责传输动画、传输过程。
		var str
		str = packet.flags.indexOf("SYN") > -1 ? "SYN" : ""
		str = packet.flags.indexOf("FIN") > -1 ? "FIN" : str
		str = packet.flags.indexOf("RST") > -1 ? "RST" : str
		// str = packet.len > 0 ? "seq=" + packet.seq + ",len=" + packet.len : str
		if (packet.flags.indexOf("ACK") > -1) {
			str += str ? "," : ""
			str += "ACK"
		}

		var arrive = function (dst) {
			//数据报到达函数。主要处理事件对协议的影响。。
			let r = Math.random() * 100
			for (let i = 0; i < EVENTLIST.length; i++) {
				if (EVENTLIST[i]) {
					switch (i) {
						case 0:
							if (packet.str == 'SYN-SENT') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 1:
							if (packet.str == 'SYN-RCVD') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 2:
							if (packet.str == 'ESTABLISHED') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 3:
							if (packet.str == 'FIN-WAIT-1') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 4:
							if (packet.str == 'CLOSE-WAIT') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 5:
							if (packet.str == 'LAST-ACK') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 6:
							if (packet.str == 'TIME-WAIT') {
								r = 0
								EVENTLIST[i] = false
							}
							break
						case 7:
							app.show_ex_case7()
							r = 100
							packet.dstport = '一个不处于监听状态的端口'
							EVENTLIST[i] = false
							break
						case 8:
							packet.dst = '一个不存在的主机'
							// EVENTLIST[i] = false
							resend_time += 1
							addtoWireShark(packet, true, dst_isnot_exist = true)
							return
					}
				}
			}
			if (r > PACKET_LOSS_RATIO) {
				//发送成功了
				addtoWireShark(packet, false)
				return false
			} else {
				// 发送失败
				addtoWireShark(packet, true)
				return true
			}
		}

		var isfail = arrive(packet.dst) //这个数据包是否丢失

		var app_layer_1 = $('#user')
		var app_layer_2 = $('#server')
		var transport_layer_1 = $('#transport_layer_1')
		var transport_layer_2 = $('#transport_layer_2')
		var internet_layer_1 = $('#internet_layer_1')
		var internet_layer_2 = $('#internet_layer_2')

		// console.log(app_layer_1.width(),app_layer_1.offset().top)

		//创建应用数据节点
		var app_data = $("<div class='label tcp_app_data'>&nbsp&nbsp应用数据&nbsp&nbsp</div>")
		app_data.css("position", "fixed")
		app_data.css("display", "none")
		//创建TCP首部节点
		if (str) {
			var tcp_block = $("<div class='tcp_block'>&nbsp&nbspTCP首部[" + str + "]&nbsp</div>")
		} else {
			var tcp_block = $("<div class='tcp_block'>&nbsp&nbspTCP首部&nbsp</div>")
		}
		tcp_block.css("position", "fixed")
		tcp_block.css("display", "none")
		//创建IP首部节点
		var ip_pkt = $("<div class='ip_pkt' isfail=" + isfail + ">&nbspIP首部&nbsp</div>")
		ip_pkt.css("position", "fixed")
		ip_pkt.css("display", "none")
		$('body').append(app_data)
		$('body').append(tcp_block)
		$('body').append(ip_pkt)
		// console.log(tcp_block.actual('width'))
		// console.log(ip_pkt.actual('width'))
		// console.log(app_data.actual('width'))

		//以下都是动画代码
		if (packet.src == S1.addr.ip) {
			app_data.css({
				top: app_layer_1.offset().top + app_layer_1.height() / 2 - app_data.height() / 1.5 - 110,
				left: app_layer_1.offset().left + app_layer_1.width() / 2 - app_data.width() / 1.5
			});
			app_data.css("display", "inline-block")
			animateCSS(app_data, 'zoomIn').then((message) => {
				app_data.delay(200).animate({
					top: transport_layer_1.offset().top + transport_layer_1.height() / 2 - app_data.height() / 2,
					left: transport_layer_1.offset().left + tcp_block.actual('width')
				}, 500, 'swing', function () {
					tcp_block.css("display", "inline-block")
					// element.style.setProperty('--animate-duration', '0.5s')
					tcp_block.css({
						top: transport_layer_1.offset().top + transport_layer_1.height() / 2 - tcp_block.height() / 2,
						left: transport_layer_1.offset().left
					});
					animateCSS(tcp_block, 'slideInDown').then((message) => {
						$(this).css('position', 'static')
						$(tcp_block).append($(this))
						$(tcp_block).delay(500).animate({
							top: internet_layer_1.offset().top + internet_layer_1.height() / 2 - tcp_block.height() / 2,
							left: internet_layer_1.offset().left + ip_pkt.actual('width')
						}, 500, 'swing', function () {
							ip_pkt.css("display", "inline-block")
							ip_pkt.css({
								top: internet_layer_1.offset().top + internet_layer_1.height() / 2 - ip_pkt.height() / 2,
								left: internet_layer_1.offset().left
							});
							animateCSS(ip_pkt, 'slideInDown').then((message) => {
								$(this).css('position', 'static')
								$(ip_pkt).append($(this))
								if (ip_pkt.attr('isfail') == 'false') { // 没有丢包
									$(ip_pkt).delay(500).animate({
										top: internet_layer_2.offset().top + internet_layer_2.height() / 2 - ip_pkt.height() / 2,
										left: internet_layer_2.offset().left
									}, 750, 'swing', function () {
										$(tcp_block).css('position', 'fixed')
										$("body").append($(tcp_block))
										$(tcp_block).css({
											top: internet_layer_2.offset().top + internet_layer_2.height() / 2 - tcp_block.height() / 2,
											left: internet_layer_2.offset().left + ip_pkt.actual('width')
										})
										animateCSS(ip_pkt, 'zoomOut').then((message) => {
											$(this).remove()
										})
										$(tcp_block).delay(500).animate({
											top: transport_layer_2.offset().top + transport_layer_2.height() / 2 - tcp_block.height() / 2,
											left: transport_layer_2.offset().left
										}, 500, 'swing', function () {
											$(app_data).css('position', 'fixed')
											$("body").append($(app_data))
											$(app_data).css({
												top: transport_layer_2.offset().top + transport_layer_2.height() / 2 - app_data.height() / 2,
												left: transport_layer_2.offset().left + tcp_block.actual('width')
											})
											animateCSS(tcp_block, 'zoomOut').then((message) => {
												$(this).remove()
											})
											$(app_data).delay(500).animate({
												top: app_layer_2.offset().top + app_layer_2.height() / 2 - app_data.height() / 2 - 110,
												left: app_layer_2.offset().left + app_layer_2.width() / 2 - app_data.width() / 2
											}, 500, 'swing', function () {
												for (let index in ALLSOCKET) {
													if (ALLSOCKET[index].addr.ip == packet.dst) {
														animateCSS(app_data, 'zoomOut').then((message) => {
															ALLSOCKET[index].recvCache.push(packet)
															app_data.remove();
														})
													}
												}
											})
										})
									})
								} else {
									$(ip_pkt).delay(500).animate({
										top: 316,
										left: 506
									}, 750, 'swing', () => {
										// use [0] to transform from jquery object into dom object
										ip_pkt[0].style.setProperty('--animate-duration', '1.5s')
										ip_pkt[0].classList.add('animate__animated', 'animate__swing')
										chat_img('pkt_die')
										ip_pkt[0].addEventListener('animationend', () => {
											ip_pkt[0].style.setProperty('--animate-duration', '1s')
											ip_pkt[0].classList.add('animate__animated', 'animate__fadeOutUp')
											ip_pkt[0].addEventListener('animationend', () => {
												ip_pkt.remove()
												if (resend_time >= 3) {
													//目标主机不存在，放弃连接
													chat_img("giveup")
													S1.close()
													S2.close()
													btnRequestEnabled = true
													app.inputEnabled = !btnRequestEnabled
													btnShutdownEnabled = false
												}
											})
										})
									})
								}
							})
						})
					});
				})
			})
		} else {
			app_data.css({
				top: app_layer_2.offset().top + app_layer_2.height() / 2 - app_data.height() / 1.5 - 110,
				left: app_layer_2.offset().left + app_layer_2.width() / 2 - app_data.width() / 1.5
			});
			app_data.css("display", "inline-block")
			animateCSS(app_data, 'zoomIn').then((message) => {
				app_data.delay(200).animate({
					top: transport_layer_2.offset().top + transport_layer_2.height() / 2 - app_data.height() / 2,
					left: transport_layer_2.offset().left + tcp_block.actual('width')
				}, 500, 'swing', function () {
					tcp_block.css("display", "inline-block")
					tcp_block.css({
						top: transport_layer_2.offset().top + transport_layer_2.height() / 2 - tcp_block.height() / 2,
						left: transport_layer_2.offset().left
					});
					animateCSS(tcp_block, 'slideInDown').then((message) => {
						$(this).css('position', 'static')
						$(tcp_block).append($(this))
						$(tcp_block).delay(500).animate({
							top: internet_layer_2.offset().top + internet_layer_2.height() / 2 - tcp_block.height() / 2,
							left: internet_layer_2.offset().left + ip_pkt.actual('width')
						}, 500, 'swing', function () {
							ip_pkt.css("display", "inline-block")
							ip_pkt.css({
								top: internet_layer_2.offset().top + internet_layer_2.height() / 2 - ip_pkt.height() / 2,
								left: internet_layer_2.offset().left
							});
							animateCSS(ip_pkt, 'slideInDown').then((message) => {
								$(this).css('position', 'static')
								$(ip_pkt).append($(this))
								if (ip_pkt.attr('isfail') == 'false') { // 没有丢包
									$(ip_pkt).delay(500).animate({
										top: internet_layer_1.offset().top + internet_layer_1.height() / 2 - ip_pkt.height() / 2,
										left: internet_layer_1.offset().left
									}, 750, 'swing', function () {
										$(tcp_block).css('position', 'fixed')
										$("body").append($(tcp_block))
										$(tcp_block).css({
											top: internet_layer_1.offset().top + internet_layer_1.height() / 2 - tcp_block.height() / 2,
											left: internet_layer_1.offset().left + ip_pkt.actual('width')
										})
										animateCSS(ip_pkt, 'zoomOut').then((message) => {
											$(this).remove()
										})
										$(tcp_block).delay(500).animate({
											top: transport_layer_1.offset().top + transport_layer_1.height() / 2 - tcp_block.height() / 2,
											left: transport_layer_1.offset().left
										}, 500, 'swing', function () {
											$(app_data).css('position', 'fixed')
											$("body").append($(app_data))
											$(app_data).css({
												top: transport_layer_1.offset().top + transport_layer_1.height() / 2 - app_data.height() / 2,
												left: transport_layer_1.offset().left + tcp_block.actual('width')
											})
											animateCSS(tcp_block, 'zoomOut').then((message) => {
												$(this).remove()
											})
											$(app_data).delay(500).animate({
												top: app_layer_1.offset().top + app_layer_1.height() / 2 - app_data.height() / 2 - 110,
												left: app_layer_1.offset().left + app_layer_1.width() / 2 - app_data.width() / 2
											}, 500, 'swing', function () {
												for (let index in ALLSOCKET) {
													if (ALLSOCKET[index].addr.ip == packet.dst) {
														animateCSS(app_data, 'zoomOut').then((message) => {
															ALLSOCKET[index].recvCache.push(packet)
															app_data.remove();
														})
													}
												}
											})
										})
									})
								} else {
									$(ip_pkt).delay(500).animate({
										top: 316,
										left: 506
									}, 750, 'swing', () => {
										// use [0] to transform from jquery object into dom object
										ip_pkt[0].style.setProperty('--animate-duration', '1.5s')
										ip_pkt[0].classList.add('animate__animated', 'animate__swing')
										chat_img('pkt_die')
										ip_pkt[0].addEventListener('animationend', () => {
											ip_pkt[0].style.setProperty('--animate-duration', '1s')
											ip_pkt[0].classList.add('animate__animated', 'animate__fadeOutUp')
											ip_pkt[0].addEventListener('animationend', () => {
												ip_pkt.remove()
												if (resend_time >= 3) {
													//目标主机不存在，放弃连接
													chat_img("giveup")
													S1.close()
													S2.close()
													btnRequestEnabled = true
													app.inputEnabled = !btnRequestEnabled
													btnShutdownEnabled = false
													//这里差一个图片
												}
											})
										})
									})
								}
							})

						})
					})

				})
			})

		}
	};

	var timer_show = function (socket, num) {
		if (socket.addr.ip == S1.addr.ip) {
			if (num > 100) {
				app.client_timer = 100
			} else {
				app.client_timer = num
			}
		} else {
			if (num > 100) {
				app.server_timer = 100
			} else {
				app.server_timer = num
			}
		}
	}

	var chat_img = function (str) {
		var imganimate = $('#' + str)
		imganimate.css('display', 'block')
		imganimate.animate({
			"opacity": "1"
		}, 700, 'swing')
		window.setTimeout(function () {
			imganimate.animate({
				"opacity": "0"
			}, 700, 'swing', function () {
				$(this).css('display', 'none')
			})
		}, 3000)
	}

	var clocktime = function (socket) {
		for (var seq in socket.ackTimer) {
			socket.ackTimer[seq] += FREQUENCY
			timer_show(socket, parseInt(socket.ackTimer[seq] / 180, 10))

			if (socket.ackTimer[seq] > 18000) {
				for (let i = 0; i < socket.sendCache.length; i++) {
					if (socket.sendCache[i].seq == seq) {
						socket.sendCache[i].timeoutRetran = true
						if (socket.addr.ip == S1.addr.ip) {
							chat_img('resend_1')
						} else {
							chat_img('resend_2')
						}
						send(socket.sendCache[i])
						break
					}
				}
				socket.ackTimer[seq] = 0
			}
		}

		let i = 0
		let goout = false
		for (i; i < socket.sendCache.length; i++) {
			let p = socket.sendCache[i]
			switch (p.str) {
				case "SYN-SENT":
					if (!(p.seq in socket.ackTimer)) {
						socket.changeStatus("SYN-SENT")
						send(p)
						socket.ackTimer[p.seq] = 0
						goout = true
						chat_img(p.str)
					}
					break
				case "SYN-RCVD":
					if (!(p.seq in socket.ackTimer)) {
						socket.changeStatus("SYN-RCVD")
						send(p)
						socket.ackTimer[p.seq] = 0
						goout = true
						chat_img(p.str)
					}
					break
				case "ESTABLISHED":
					socket.changeStatus("ESTABLISHED")
					socket.sendCache.splice(i, 1)
					socket.ackCache[p.ack] = p
					send(p)
					goout = true
					chat_img(p.str)
					break
				case "FIN-WAIT-1":
					if (!(p.seq in socket.ackTimer)) {
						socket.changeStatus("FIN-WAIT-1")
						send(socket.sendCache[i])
						socket.ackTimer[p.seq] = 0
						goout = true
						chat_img(p.str)
					}
					break
				case "CLOSE-WAIT":
					socket.changeStatus("CLOSE-WAIT")
					socket.sendCache.splice(i, 1)
					send(p)
					socket.ackCache[p.ack] = p
					goout = true
					chat_img(p.str)
					break
				case "LAST-ACK":
					if (!(p.seq in socket.ackTimer)) {
						socket.changeStatus("LAST-ACK")
						send(socket.sendCache[i])
						socket.ackTimer[p.seq] = 0
						goout = true
						chat_img(p.str)
					}
					break
				case "TIME-WAIT":
					socket.changeStatus("TIME-WAIT")
					socket.sendCache.splice(i, 1)
					send(p)
					socket.ackCache[p.ack] = p
					socket.timeWait()
					goout = true
					chat_img(p.str)
					break
				case "DATA-TRANSMISSION":
					block: {
						if (Object.keys(socket.ackTimer)) {
							if (p.seq >= Number.parseInt(Object.keys(socket.ackTimer).sort()[0]) + Number.parseInt(socket.sendWindowSize)) {
								break block
							}
						}
						if (!(p.seq in socket.ackTimer)) {
							send(socket.sendCache[i])
							socket.ackTimer[p.seq] = 0
							goout = true
						}
					}
					break
				case "DATA-TRANSMISSION-ACK":
					socket.sendCache.splice(i, 1)
					send(p)
					socket.ackCache[p.ack] = p
					goout = true
					break
				case "Error":
					socket.sendCache.splice(i, 1)
					send(p)
					socket.ackCache[p.ack] = p
					goout = true
					socket.init()
					break
				default:
					console.log("exception！")
			}
			if (goout) break;
		}

		if (socket.recvCache.length > 0) {
			socket.response(socket.recvCache.shift());
		}
	};

	var addtoWireShark = function (packet, isFail, dst_isnot_exist = false) {
		let len = app.packetInfo.length + 1;
		let str = ""
		str += packet.flags.indexOf("SYN") > -1 ? "SYN" : ""
		str += packet.flags.indexOf("FIN") > -1 ? "FIN" : ""
		str += packet.flags.indexOf("RST") > -1 ? "RST" : ""
		if (packet.flags.indexOf("ACK") > -1) {
			str += str ? "," : ""
			str += " ACK"
		}
		str = str ? " [ " + str + " ] " : str
		str = packet.srcport + " → " + packet.dstport + str
		str += packet.seq >= 0 ? " Seq=" + packet.seq : ""
		str += packet.ack >= 0 ? " Ack=" + packet.ack : ""
		str += " Win=" + packet.windowSize
		str += " Len=" + packet.len
		str += packet.flags.indexOf("SYN") > -1 ? " MSS=" + packet.mss : ""

		if (isFail) {
			str += " 【该包丢失了】"
		}

		if (packet.timeoutRetran) {
			str += " 【超时重传包】"
		}

		var pacinfo = {
			id: len,
			src: packet.src,
			description: str
		}

		if (dst_isnot_exist) {
			pacinfo = {
				id: len,
				src: packet.src,
				description: "目标主机不存在"
			}
		}

		app.packetInfo.push(pacinfo)
	}

	function TcpPkt(srcport, dstport, seq, ack, hdr_len, flags, window_size_value, checksum, urgent_pointer, options, data) {
		this.srcport = srcport
		this.dstport = dstport
		this.seq = seq
		this.ack = ack
		this.hdr_len = hdr_len
		this.flags = flags
		this.window_size_value = tcp.window_size_value
		this.checksum = tcp.checksum
		this.urgent_pointer = urgent_pointer
		this.options = options
		this.data = data
	}

	function Packet(src, srcport, dst, dstport, str, seq, ack, flags, windowSize, len, mss, timeoutRetran = false) {
		this.str = str //描述字符串
		this.src = src //源地址
		this.srcport = srcport
		this.dst = dst //目标地址
		this.dstport = dstport
		this.seq = seq //序号
		this.ack = ack //确认号
		this.len = len //数据偏移
		this.flags = flags //URG ACK PSH RST SYN FIN
		this.windowSize = windowSize //窗口
		this.timeoutRetran = timeoutRetran
		this.mss = mss
		//this.checksum = 0; //校验和
		this.equal = function (packet) {
			if (this.str == packet.str &&
				this.src == packet.src &&
				this.srcport == packet.srcport &&
				this.dstport == packet.dstport &&
				this.dst == packet.dst &&
				this.seq == packet.seq &&
				this.ack == packet.ack &&
				this.len == packet.len &&
				this.flags == packet.flags &&
				this.windowSize == packet.windowSize) return true
		}
	}

	function Addr(ip, port) {
		this.ip = ip;
		this.port = port;
		this.equal = function (addr) {
			if (this.ip == addr.ip && this.port == addr.port) return true
			else return false;
		}
		this.toString = function () {
			return "(" + this.ip.replace('-', '.') + "," + this.port + ")"
		}
		this.ipToString = function () {
			return this.ip.replace('-', '.')
		}
	}

	function Socket(ip, port) {
		this.addr = new Addr(ip, port)
		this.status = 'CLOSED'
		this.seq = 0
		this.initialSeq = this.seq
		this.rcvdComulativeSeq = -1
		this.recvWindowSize = WINDOW_SIZE
		this.sendWindowSize = WINDOW_SIZE
		this.recvCache = [] //packet
		this.sendCache = [] //packet

		this.ackTimer = {} //packet.seq:time
		this.ackCache = {} //packet.ack:packet
		this.rcvdComulativeSeq = -1
		this.closeTimerId = -1
		this.maxSegmentSize = 1460 //Number.parseInt($('#'+this.addr.ip + ' .mss').attr('value'))
		this.cumulativeack = false

		this.init = function () {
			this.status = 'CLOSED'
			this.seq = 0
			this.initialSeq = this.seq
			this.rcvdComulativeSeq = -1
			if (!this.recvWindowSize) this.recvWindowSize = WINDOW_SIZE
			if (!this.sendWindowSize) this.sendWindowSize = WINDOW_SIZE
			this.recvCache = [] //packet
			this.sendCache = [] //packet
			this.ackTimer = {} //packet.seq:time
			for (key in this.ackTimer) {
				this.ackTimer[key] = 0
			}
			this.ackCache = {} //packet.ack:packet
			this.rcvdComulativeSeq = -1
			this.closeTimerId = -1
			if (!this.maxSegmentSize) this.maxSegmentSize = 1460 //Number.parseInt($('#'+this.addr.ip + ' .mss').attr('value'))
			this.cumulativeack = false
			if (this.clocktimeId) {
				clearInterval(this.clocktimeId)
			}
			this.clocktimeId = setInterval(clocktime, FREQUENCY, this)
		}
		this.close = function () {
			this.init()
			clearInterval(this.clocktimeId);
			timer_show(this, 0)
		}
		this.changeStatus = function (str) {
			// LISTEN SYN-RCVD SYN-SENT ESTABLISHED
			//FIN-WAIT TIME-WAIT CLOSE-WAIT
			this.status = str;
		}
		this.pushPacket = function (dst, dstport, str, flags, len, ack = -1) {
			var packet;

			var _seq;
			if (len > 0 || flags.indexOf("SYN") > -1 || flags.indexOf("FIN") > -1) {
				_seq = this.seq;
				this.seq += 1;
			} else {
				_seq = -1;
			}

			var ip = this.addr.ip
			var port = this.addr.port
			var recvWindowSize = this.recvWindowSize
			if (flags.indexOf("RST") > -1) {
				recvWindowSize = 0
				_seq = 1
				port = '一个不处于监听状态的端口'
			}

			if (flags.indexOf("SYN") > -1) {
				packet = new Packet(ip, port, dst, dstport, str, _seq, ack, flags, recvWindowSize, len, mss = this.maxSegmentSize)
			} else {
				packet = new Packet(ip, port, dst, dstport, str, _seq, ack, flags, recvWindowSize, len, mss = this.maxSegmentSize)
			}
			this.sendCache.push(packet);
		}
		this.rcvdPacket = function (packet) {
			this.recvCache[packet.seq] = packet;
		}
		this.response = function (packet) {
			//收到确认,暂停计时器
			if (packet.flags.indexOf("ACK") > -1) {
				for (var seq in this.ackTimer) {
					if (seq == packet.ack - 1) {
						delete this.ackTimer[seq];
						timer_show(this, 0)
						for (let i = 0; i < this.sendCache.length; i++) {
							if (this.sendCache[i].seq == seq) {
								this.sendCache.splice(i, 1)
								break
							}
						}
						break
					}
				}
			}

			//累计确认收到的seq号
			var isFirst = this.rcvdComulativeSeq >= packet.seq ? false : true;
			this.rcvdComulativeSeq = packet.seq;

			//找到对方地址
			for (let index in ALLSOCKET) {
				if (ALLSOCKET[index].addr.ip == packet.src) {
					var dst = ALLSOCKET[index].addr.ip
					var dstport = ALLSOCKET[index].addr.port
				}
			}

			// 端口不处于监听状态
			if (packet.dstport == '一个不处于监听状态的端口') {
				this.pushPacket(dst, dstport, "Error", ["RST", "ACK"], 0, packet.seq + 1);
				chat_img("SYN-RCVD-fail")
				return
			}

			//如果已经是TIME-WAIT状态，重置TIME-WAIT计时器
			if (this.status == "TIME-WAIT") {
				clearTimeout(this.closeTimerId);
				this.timeWait();
			}

			//三次握手中第一次
			if (packet.str == "SYN-SENT") {
				if (isFirst) {
					this.pushPacket(dst, dstport, "SYN-RCVD", ["SYN", "ACK"], 0, packet.seq + 1);
					this.sendWindowSize = packet.windowSize
				} else {
					timer_show(this, 0)
					delete this.ackTimer[0];
					this.sendWindowSize = packet.windowSize
				}
			}
			//三次握手中第二次
			else if (packet.str == "SYN-RCVD") {
				if (this.ackCache[packet.seq + 1]) {
					send(this.ackCache[packet.seq + 1])
					this.sendWindowSize = packet.windowSize
				} else {
					this.pushPacket(dst, dstport, "ESTABLISHED", ["ACK"], 0, packet.seq + 1);
					this.sendWindowSize = packet.windowSize
				}
			}
			//三次握手中的第三次
			else if (packet.str == "ESTABLISHED") {
				this.changeStatus("ESTABLISHED");
				btnShutdownEnabled = true
				chat_img('know_established')
			}
			//四次挥手中FIN-WAIT-1
			else if (packet.str == "FIN-WAIT-1") {
				if (this.ackCache[packet.seq + 1]) {
					send(this.ackCache[packet.seq + 1]);
				} else {
					this.pushPacket(dst, dstport, "CLOSE-WAIT", ["ACK"], 0, packet.seq + 1);
					var that = this
					setTimeout(function () {
						that.pushPacket(dst, dstport, "LAST-ACK", ["FIN", "ACK"], 0, packet.seq + 1);
					}, 2000);
				}
			}
			//四次挥手中CLOSE-WAIT
			else if (packet.str == "CLOSE-WAIT") {
				this.changeStatus("FIN-WAIT-2");
			}
			//四次挥手中LAST-ACK
			else if (packet.str == "LAST-ACK") {
				if (this.ackCache[packet.seq + 1]) {
					send(this.ackCache[packet.seq + 1]);
				} else {
					this.pushPacket(dst, dstport, "TIME-WAIT", ["ACK"], 0, packet.seq + 1);
				}
			}
			//四次挥手中的TIME-WAIT
			else if (packet.str == "TIME-WAIT") {
				this.close();
			}
			//DATA-TRANSMISSION
			else if (packet.str == "DATA-TRANSMISSION") {
				if (this.ackCache[packet.seq + 1]) {
					send(this.ackCache[packet.seq + 1]);
				} else {
					this.pushPacket(dst, dstport, "DATA-TRANSMISSION-ACK", ["ACK"], 0, packet.seq + 1);
				}
			}
			//Error -> RST 服务器不同意建立连接
			else if (packet.str == "Error") {
				if (packet.flags.indexOf("RST") > -1) {
					this.init()
					chat_img("ESTABLISHED-fail")
					btnRequestEnabled = true
					app.inputEnabled = !btnRequestEnabled
				}
			}
		}
		this.timeWait = function () {
			var that = this;
			this.closeTimerId = setTimeout(function () {
				that.close();
				btnRequestEnabled = true
				app.inputEnabled = !btnRequestEnabled
			}, 20000);
		}
		this.pushData = function (dst, dstport, datalen) {
			S2.maxSegmentSize = Number.parseInt(S2.maxSegmentSize)
			console.log(S2.maxSegmentSize)
			if (datalen <= 0 || this.status != "ESTABLISHED")
				return
			for (let i = 0; i < Math.floor(datalen / S2.maxSegmentSize); i++) {
				this.pushPacket(dst, dstport, "DATA-TRANSMISSION", [], len = S2.maxSegmentSize)
			}
			if (datalen % S2.maxSegmentSize) {
				this.pushPacket(dst, dstport, "DATA-TRANSMISSION", [], len = datalen % S2.maxSegmentSize)
			}
		}
	};

	const animateCSS = (element, animation, prefix = 'animate__') =>
		// We create a Promise and return it
		new Promise((resolve, reject) => {
			const animationName = `${prefix}${animation}`;
			const node = element[0];
			node.style.setProperty('--animate-duration', '0.6s')
			node.classList.add(`${prefix}animated`, animationName);

			// When the animation ends, we clean the classes and resolve the Promise
			function handleAnimationEnd() {
				node.classList.remove(`${prefix}animated`, animationName);
				node.removeEventListener('animationend', handleAnimationEnd);

				resolve('Animation ended');
			}

			node.addEventListener('animationend', handleAnimationEnd);
		});

	$("#user").hover(function () {
		// $("#user").css('width','110%')
		// animateCSS('#user', 'animate__pulse').then((message) => {
		// 	// Do something after the animation
		// 	console.log(message)
		// });
	}, function () {
		// $("#user").css("background-color", "pink");
	});
});