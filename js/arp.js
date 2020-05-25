var remove_animate = function () {
	let li = document.querySelectorAll('.animate__animated')
	for (node of li) {
		node.classList.remove("animate__animated");
	}
}

var el_position

window.onload = function () {
	window.setTimeout(() => {
		remove_animate()
		el_position = {
			user: {
				top: $('#arp_user').offset().top + $('#arp_user').height() / 2,
				left: $('#arp_user').offset().left + $('#arp_user').height() / 2
			},
			host1: {
				top: $('#arp_host1').offset().top + $('#arp_host1').height() / 2,
				left: $('#arp_host1').offset().left + $('#arp_host1').height() / 2
			},
			host2: {
				top: $('#arp_host2').offset().top + $('#arp_host2').height() / 2,
				left: $('#arp_host2').offset().left + $('#arp_host2').height() / 2
			},
			host3: {
				top: $('#arp_host3').offset().top + $('#arp_host3').height() / 2,
				left: $('#arp_host3').offset().left + $('#arp_host3').height() / 2
			},
			router: {
				top: $('#arp_router').offset().top + $('#arp_router').height() / 2,
				left: $('#arp_router').offset().left + $('#arp_router').height() / 2
			},
			server: {
				top: $('#arp_server').offset().top + $('#arp_server').height() / 2,
				left: $('#arp_server').offset().left + $('#arp_server').height() / 2
			}
		}
	}, 750)
};

$(function () {

	var hostlist = {
		user: {
			host: '用户',
			ip: '192.168.1.100',
			mac: '34-de-1a-49-54-0d',
			gateway: '192.168.1.1'
		},
		host1: {
			host: '主机1',
			ip: '192.168.1.101',
			mac: '00-50-56-ea-20-6a',
			gateway: '192.168.1.1'
		},
		host2: {
			host: '主机2',
			ip: '192.168.1.102',
			mac: 'fc-d7-33-ce-ca-24',
			gateway: '192.168.1.1'
		},
		host3: {
			host: '主机3',
			ip: '192.168.1.103',
			mac: '01-00-5e-00-00-fc',
			gateway: '192.168.1.1'
		},
		router: {
			host: '路由器',
			ip: '192.168.1.1',
			mac: '03-2c-5a-00-03-fa',
			gateway: ''
		},
	}

	var locate = function (host, node) {
		a = {
			top: el_position[host].top - node.height() / 2,
			left: el_position[host].left - node.width() / 2
		}
		return a
	}

	var arp_check_timer_id = 0

	var TRANSMISSION_TIME = 1400 //a packet transmission time;
	var FREQUENCY = 500 //invoke clocktime() frequency
	var pkt_cache = null

	var EVENTLIST = []
	var eventToggle = {
		event1: false,
		event2: false,
		event3: false,
		event4: false,
		event5: false,
		event6: false,
		event7: false,
		event8: false,
		event9: false
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
			is_arp_cheat: false,
			packetInfo: [],
			arp_table: [],
			hostInfo: [
				hostlist.user,
				hostlist.host1,
				hostlist.host2,
				hostlist.host3,
				hostlist.router,
			],
			eventTable: [{
				id: 'event1',
				event: '用户受到arp欺骗'
			}]
		},
		methods: {
			handleCommand: function (command) {
				var ip_pkt
				if (command.startsWith('host')) {
					ip_pkt = icmp_to_ip(icmp_pkt = new IcmpPacket(),
						src = hostlist['user'].ip,
						dst = hostlist[command].ip)
				} else {
					ip_pkt = icmp_to_ip(icmp_pkt = new IcmpPacket(),
						src = hostlist['user'].ip,
						dst = '某个远程服务器')
				}
				pkt = ip_to_ether(ip_pkt)
				// console.log(pkt instanceof EthernetFrame)
				if (pkt instanceof EthernetFrame) {
					trans_animate(pkt)
				} else {
					window.setTimeout(function () {
						pkt = ip_to_ether(ip_pkt)
						if (pkt instanceof EthernetFrame) {
							trans_animate(pkt)
						}
					}, TRANSMISSION_TIME * 4)
				}
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (row.src == '192-168-7-1') {
					return 'warning-row'
				} else {
					return 'success-row'
				}
			},
			reset() {
				window.location.href = './arp.html'
			},
			arp_cheat_change(val) {
				// val is a boolean
				if (val) { //arp cheat open
					arp_attack()
					this.show_arpcheat_tips()
					arp_check_timer_id = window.setInterval(arp_attack, 3 * TRANSMISSION_TIME)
					document.querySelector("#attacker").style.setProperty('display', 'block')
					animateCSS('#attacker', 'fadeIn')
				} else { //close arp cheat
					arp_check_timer_id = 0
					animateCSS('#attacker', 'zoomOut').then((message) => {
						document.querySelector("#attacker").style.setProperty('display', 'none')
					})
				}
			},
			handleDelete(index, row) {
				// console.log(index, row);
				this.arp_table.splice(index, 1)
			},
			show_arpcheat_tips() {
				this.$notify({
					title: 'ARP欺骗',
					customClass: 'tcp_notify_css',
					dangerouslyUseHTMLString: true,
					position: 'top-left',
					duration: 0,
					message: '<hr><p class="illustration"></p>\
					<p class="illustration"> ARP欺骗的运作原理是由攻击者发送假的ARP数据包到网络上，尤其是送到网关上。其目的是要让送至特定的IP地址的流量被错误送到攻击者所取代的地方。攻击者可将这些流量另行转送到真正的网关或是篡改后再转送（中间人攻击）。攻击者亦可将ARP数据包导到不存在的MAC地址以达到拒绝服务攻击的效果。</p>\
					<p class="illustration">在本例中，攻击者发送ARP应答包给用户主机，将用户主机的网关MAC地址修改为攻击者的MAC地址。接下来若用户主机要发送ICMP回显请求给外网主机的话，数据包会被攻击者截取，本例中攻击者不再转发截获的数据包，导致用户主机无法PING通局域网外的主机。</p>'
				});
			},
		}
	})

	var arp_attack = function () {
		for (arp_item of app.arp_table) {
			if (arp_item.ip == hostlist.host1.ip) {
				arp_item.mac = hostlist.host1.mac
				pkt_arp = new ArpPacket('ethernet', 'ipv4', '6', '4', 'reply',
					hostlist.host1.mac, hostlist.router.ip, hostlist.user.mac, hostlist.user.ip)
				addtoWireShark(pkt_arp)
				pkt_ethernet = EthernetFrameGenerator(pkt_arp)
				trans_animate(pkt_ethernet)
				return
			}
		}
		app.arp_table.push({
			ip: hostlist.host1.ip,
			mac: hostlist.host1.mac,
		})
		pkt_arp = new ArpPacket('ethernet', 'ipv4', '6', '4', 'reply',
			hostlist.host1.mac, hostlist.router.ip, hostlist.user.mac, hostlist.user.ip)
		addtoWireShark(pkt_arp)
		pkt_ethernet = EthernetFrameGenerator(pkt_arp)
		trans_animate(pkt_ethernet)
	}

	var arp_request = function (ip) {
		targethost = findHostByIp(ip)
		p_arp = new ArpPacket('ethernet', 'ipv4', '6', '4', 'request',
			hostlist['user'].mac, hostlist['user'].ip, '00-00-00-00-00-00', targethost.ip)
		addtoWireShark(p_arp)
		p_li = EthernetFrameGenerator(p_arp)
		for (pkt of p_li) {
			trans_animate(pkt)
		}
	}

	var trans_animate = function (frame) {
		if (frame.type == 'arp') {
			if (frame.data.opcode == 'request') {
				var pNode = $("<span class='label ip_pkt'>ARP请求</span>")
			} else {
				var pNode = $("<span class='label ip_pkt'>ARP应答</span>")
			}
			$("body").append(pNode);
			pNode.css("position", "absolute")
			pNode.css("display", "incline")

			var begin_top, begin_left, end_top, end_left
			var srchost, dsthost
			for (host in hostlist) {
				//找到出发点
				// console.log(hostlist[host].mac==frame.source)
				if (hostlist[host].mac == frame.source) {
					srchost = hostlist[host]
					// console.log(srchost.host)
					a = locate(host, pNode)
					begin_top = a.top
					begin_left = a.left
				}
				//找到终点
				if (hostlist[host].mac == frame.destination) {
					dsthost = hostlist[host]
					a = locate(host, pNode)
					end_top = a.top
					end_left = a.left
				}
			}
			// console.log(begin_top,begin_left,end_top,end_left)

			pNode.css({
				"top": begin_top,
				"left": begin_left
			})
			animateCSS2(pNode, 'zoomIn').then((message) => {
				pNode.animate({
					top: end_top,
					left: end_left
				}, TRANSMISSION_TIME, 'swing', () => {
					animateCSS2(pNode, 'zoomOut').then((message) => {
						pNode.remove()
						response(frame)
					})
				})
			})

		}
		if (frame.type == 'ipv4') {
			if (frame.data.data.type == 8) {
				var pNode = $("<span class='label tcp_block'>ICMP回显请求</span>")
			} else {
				var pNode = $("<span class='label tcp_block'>ICMP回显应答</span>")
			}
			$("body").append(pNode);
			pNode.css("position", "absolute");
			pNode.css("display", "incline");

			var begin_top, begin_left, end_top, end_left
			var srchost, dsthost
			for (host in hostlist) {
				//找到出发点
				// console.log(hostlist[host].mac==frame.source)
				if (hostlist[host].mac == frame.source) {
					srchost = hostlist[host]
					// console.log(srchost.host)
					a = locate(host, pNode)
					begin_top = a.top
					begin_left = a.left
				}
				//找到终点
				if (hostlist[host].mac == frame.destination) {
					dsthost = hostlist[host]
					a = locate(host, pNode)
					end_top = a.top
					end_left = a.left
				}
			}

			pNode.css({
				"top": begin_top,
				"left": begin_left
			});
			animateCSS2(pNode, 'zoomIn').then((message) => {
				pNode.animate({
					top: end_top,
					left: end_left
				}, TRANSMISSION_TIME, 'swing', () => {
					animateCSS2(pNode, 'zoomOut').then((message) => {
						pNode.remove()
						response(frame)
					})
				})
			})
		}
	}

	var addtoWireShark = function (pkt) {
		let id = app.packetInfo.length + 1

		if (pkt instanceof ArpPacket) {
			if (pkt.opcode == 'request') {
				type = 'ARP请求'
				dst_mac = '广播'
			} else {
				type = 'ARP应答'
				dst_mac = pkt.targetMacAddress
			}
			dst_ip = pkt.targetIpAddress
			src_mac = pkt.serderMacAddress
			src_ip = pkt.senderIpAddress
			pacinfo = {
				id,
				type,
				src_ip,
				src_mac,
				dst_ip,
				dst_mac,
			}
		}
		if (pkt instanceof IpPacket) {
			if (pkt.data.type == 8) {
				type = 'ICMP请求'
			} else {
				type = 'ICMP应答'
			}
			dst_mac = findHostByIp(pkt.dst) ? findHostByIp(pkt.dst).mac : hostlist['router'].mac
			if (app.is_arp_cheat) {
				dst_mac = hostlist['host1'].mac
			}
			dst_ip = pkt.dst
			src_mac = findHostByIp(pkt.src).mac
			src_ip = pkt.src
			pacinfo = {
				id,
				type,
				src_ip,
				src_mac,
				dst_ip,
				dst_mac,
			}
		}
		app.packetInfo.push(pacinfo)
	}

	var EthernetFrameGenerator = function (pkt_arp) {
		if (pkt_arp.opcode == 'request') {
			var p_ethernet_li = []
			var srchost = findHostByMac(pkt_arp.serderMacAddress)
			//给网段里的其他主机发包
			for (key in hostlist) {
				if (hostlist[key].mac == pkt_arp.serderMacAddress) continue
				var pkt_ethernet = new EthernetFrame(hostlist[key].mac, srchost.mac, 'arp', data = pkt_arp)
				p_ethernet_li.push(pkt_ethernet)
			}
			return p_ethernet_li
		} else if (pkt_arp.opcode == 'reply') {
			p_ethernet = new EthernetFrame(pkt_arp.targetMacAddress, pkt_arp.serderMacAddress, 'arp', data = pkt_arp)
			return p_ethernet
		}
	}

	var icmp_to_ip = function (icmp_pkt, src, dst) {
		return new IpPacket(proto = 'ICMP', src = src, dst = dst, data = icmp_pkt)
	}

	var ip_to_ether = function (ip_pkt) {
		//route:
		if (ip_pkt.dst.startsWith('192.168.1.')) {
			// arp table have mac address associated with the ip_pkt.dst
			for (arp_item of app.arp_table) {
				if (arp_item.ip == ip_pkt.dst) {
					addtoWireShark(ip_pkt)
					return new EthernetFrame(findHostByIp(ip_pkt.dst).mac, findHostByIp(ip_pkt.src).mac, 'ipv4', data = ip_pkt)
				}
			}
			if (ip_pkt.src != hostlist['user'].ip) {
				addtoWireShark(ip_pkt)
				return new EthernetFrame(findHostByIp(ip_pkt.dst).mac, findHostByIp(ip_pkt.src).mac, 'ipv4', data = ip_pkt)
			}
			// arp table have not mac address associated with the ip_pkt.dst
			arp_request(ip_pkt.dst)
			return ip_pkt
		} else {
			for (arp_item of app.arp_table) {
				if (arp_item.ip == hostlist['router'].ip) {
					addtoWireShark(ip_pkt)
					return new EthernetFrame(arp_item.mac, findHostByIp(ip_pkt.src).mac, 'ipv4', data = ip_pkt)
				}
			}
			// arp table have not mac address associated with the ip_pkt.dst
			arp_request(hostlist['router'].ip)
			return ip_pkt
		}
	}

	function IpPacket(proto, src, dst, data) {
		this.version = 4 //ipv4
		this.hdr_len = ''
		this.dsfield = ''
		this.len = ''
		this.id = ''
		this.flags = ''
		this.frag_offset = ''
		this.ttl = ''
		this.proto = proto
		this.checksum = ''
		this.src = src
		this.dst = dst
		this.data = data
	}

	function IcmpPacket(type = 8, code = 0, checksum = 0, id = 0, seq = 0, data = 0) {
		this.type = type
		this.code = code
		this.checksum = checksum
		this.id = id
		this.seq = seq
		this.data = data
	}

	function EthernetFrame(destination, source, type, data) {
		this.destination = destination
		this.source = source
		this.type = type
		this.data = data
	}

	function ArpPacket(hardwareType, ProtocolType, hardwareSize, protocolSize, opcode,
		serderMacAddress, senderIpAddress, targetMacAddress, targetIpAddress) {
		this.hardwareType = hardwareType // ethernet
		this.ProtocolType = ProtocolType // ipv4
		this.hardwareSize = hardwareSize // 6
		this.protocolSize = protocolSize // 4
		this.opcode = opcode // request/reply
		this.serderMacAddress = serderMacAddress //
		this.senderIpAddress = senderIpAddress //
		this.targetMacAddress = targetMacAddress //
		this.targetIpAddress = targetIpAddress //
	}

	var response = function (frame) {
		if (frame.type == 'arp') {
			if (frame.data.opcode == 'request') {
				for (key in hostlist) {
					if (hostlist[key].ip == frame.data.targetIpAddress && hostlist[key].mac == frame.destination) {
						pkt_arp = new ArpPacket('ethernet', 'ipv4', '6', '4', 'reply',
							hostlist[key].mac, hostlist[key].ip, frame.data.serderMacAddress, frame.data.senderIpAddress)
						addtoWireShark(pkt_arp)
						pkt_ethernet = EthernetFrameGenerator(pkt_arp)
						trans_animate(pkt_ethernet)
					}
				}
			}
			if (frame.data.opcode == 'reply') {
				for (arp_item of app.arp_table) {
					if (arp_item.ip == frame.data.senderIpAddress) {
						arp_item.mac = frame.data.serderMacAddress
						return
					}
				}
				app.arp_table.push({
					ip: frame.data.senderIpAddress,
					mac: frame.data.serderMacAddress,
				})
				// ether_frame = ip_to_ether(pkt_cache)
				// trans_animate(pkt_ethernet)
			}
		}
		if (frame.type == 'ipv4') {
			if (frame.destination == hostlist['router'].mac) { // 路由器收到ICMP请求
				if (frame.data.dst != hostlist['router'].ip) {
					if (frame.data.data.type == 8) {
						var pNode = $("<span class='label tcp_block'>ICMP回显请求</span>")
						$("body").append(pNode);
						pNode.css("position", "absolute");
						pNode.css("display", "incline");

						var begin_top, begin_left, end_top, end_left
						a = locate('router', pNode)
						begin_top = a.top
						begin_left = a.left
						a = locate('server', pNode)
						end_top = a.top
						end_left = a.left

						pNode.css({
							"top": begin_top,
							"left": begin_left
						});
						pNode.delay(200).animate({
							top: end_top,
							left: end_left
						}, TRANSMISSION_TIME, 'swing', () => {
							animateCSS2(pNode, 'zoomOut').then((message) => {
								pNode.remove()
								var pNode2 = $("<span class='label tcp_block'>ICMP回显应答</span>")
								$("body").append(pNode2);
								pNode2.css("position", "absolute");
								pNode2.css("display", "incline");
								var begin_top, begin_left, end_top, end_left
								a = locate('server', pNode2)
								begin_top = a.top
								begin_left = a.left
								a = locate('router', pNode2)
								end_top = a.top
								end_left = a.left
								pNode2.css({
									"top": begin_top,
									"left": begin_left
								});
								pNode2.delay(200).animate({
									top: end_top,
									left: end_left
								}, TRANSMISSION_TIME, 'swing', () => {
									animateCSS2(pNode2, 'zoomOut').then((message) => {
										pNode2.remove()
										var pNode3 = $("<span class='label tcp_block'>ICMP回显应答</span>")
										$("body").append(pNode3);
										pNode3.css("position", "absolute");
										pNode3.css("display", "incline");

										var begin_top, begin_left, end_top, end_left
										a = locate('router', pNode3)
										begin_top = a.top
										begin_left = a.left
										a = locate('user', pNode3)
										end_top = a.top
										end_left = a.left

										pNode3.css({
											"top": begin_top,
											"left": begin_left
										});
										pNode3.delay(200).animate({
											top: end_top,
											left: end_left
										}, TRANSMISSION_TIME, 'swing', () => {
											animateCSS2(pNode3, 'zoomOut').then((message) => {
												pNode3.remove()
											})
										})
										let id = app.packetInfo.length + 1
										let type = 'ICMP应答'
										pacinfo = {
											id,
											type,
											src_ip: hostlist['router'].ip,
											src_mac: hostlist['router'].mac,
											dst_ip: hostlist['user'].ip,
											dst_mac: hostlist['user'].mac,
										}
										app.packetInfo.push(pacinfo)
									})
								})
								let id = app.packetInfo.length + 1
								let type = 'ICMP应答'
								pacinfo = {
									id,
									type,
									src_ip: '某个远程服务器',
									src_mac: '',
									dst_ip: hostlist['router'].ip,
									dst_mac: hostlist['router'].mac,
								}
								app.packetInfo.push(pacinfo)
							})
						})

						let id = app.packetInfo.length + 1
						let type = 'ICMP请求'
						pacinfo = {
							id,
							type,
							src_ip: hostlist['router'].ip,
							src_mac: hostlist['router'].mac,
							dst_ip: '某个远程服务器',
							dst_mac: '',
						}
						app.packetInfo.push(pacinfo)
					} else {}



				}
			} else if (frame.destination != hostlist['user'].mac) { // 主机收到ICMP请求
				if (frame.data.data.type = 8) {
					if (frame.destination == hostlist['host1'].mac && app.is_arp_cheat && frame.data.dst == "某个远程服务器") return
					var ip_pkt = icmp_to_ip(icmp_pkt = new IcmpPacket(type = 0),
						src = findHostByMac(frame.destination).ip,
						dst = findHostByMac(frame.source).ip)
					var pkt = ip_to_ether(ip_pkt)
					// console.log(pkt)
					// // console.log(pkt instanceof EthernetFrame)
					if (pkt instanceof EthernetFrame) {
						trans_animate(pkt)
					}
				}
			}
		}
		return
	}

	// var isRouter = function (mac) {
	// 	for (r of rlist) {
	// 		if (r.host.mac == mac) {
	// 			return r
	// 		}
	// 	}
	// 	return null
	// }

	var isHost = function (mac) {
		for (h of hlist) {
			if (h.host.mac == mac) {
				return h
			}
		}
		return null
	}

	var findHostByMac = function (mac) {
		for (h in hostlist) {
			if (hostlist[h].mac == mac) {
				return hostlist[h]
			}
		}
	}

	var findHostByIp = function (ip) {
		for (h in hostlist) {
			if (hostlist[h].ip == ip) {
				return hostlist[h]
			}
		}
		return null
	}

	var isHostInNet = function (host, net) {
		for (h of net) {
			if (h.mac == host.mac) {
				return true
			}
		}
		return false
	}

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

	const animateCSS2 = (element, animation, prefix = 'animate__') =>
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
	// console.log(isRouter('34-de-1a-49-54-0d'))
	// console.log(isRouter('00-50-56-ea-20-6a'))
	// console.log(isRouter('00-50-56-e8-05-2e'))
	// console.log(isRouter('fc-d7-33-ce-ca-24'))
	// console.log(isRouter('01-00-5e-00-00-fc'))
	// console.log(isRouter('03-2c-5a-00-03-fa'))

});